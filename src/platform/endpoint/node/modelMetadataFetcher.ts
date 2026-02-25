/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RequestType } from '@vscode/copilot-api';
import { LanguageModelChat, workspace } from 'vscode';
import { TaskSingler } from '../../../util/common/taskSingler';
import { TokenizerType } from '../../../util/common/tokenizer';
import { Emitter, Event } from '../../../util/vs/base/common/event';
import { Disposable } from '../../../util/vs/base/common/lifecycle';
import { generateUuid } from '../../../util/vs/base/common/uuid';
import { IInstantiationService, ServicesAccessor } from '../../../util/vs/platform/instantiation/common/instantiation';
import { IAuthenticationService } from '../../authentication/common/authentication';
import { ConfigKey, IConfigurationService } from '../../configuration/common/configurationService';
import { IEnvService } from '../../env/common/envService';
import { ILogService } from '../../log/common/logService';
import { IFetcherService } from '../../networking/common/fetcherService';
import { IRequestLogger } from '../../requestLogger/node/requestLogger';
import { IExperimentationService } from '../../telemetry/common/nullExperimentationService';
import { ITelemetryService } from '../../telemetry/common/telemetry';
import { ICAPIClientService } from '../common/capiClient';
import { ChatEndpointFamily, IChatModelInformation, ICompletionModelInformation, IEmbeddingModelInformation, IModelAPIResponse, isChatModelInformation, isCompletionModelInformation, isEmbeddingModelInformation, ModelSupportedEndpoint } from '../common/endpointProvider';
import { ModelAliasRegistry } from '../common/modelAliasRegistry';

export interface IModelMetadataFetcher {

	/**
	 * Fires whenever we refresh the models from the server.
	 * Does not always indicate there is a change, just that the data is fresh
	 */
	onDidModelsRefresh: Event<void>;

	/**
	 * Gets all the completion models known by the model fetcher endpoint
	 */
	getAllCompletionModels(forceRefresh: boolean): Promise<ICompletionModelInformation[]>;

	/**
	 * Gets all the chat models known by the model fetcher endpoint
	 */
	getAllChatModels(): Promise<IChatModelInformation[]>;

	/**
	 * Retrieves a chat model by its family name
	 * @param family The family of the model to fetch
	 */
	getChatModelFromFamily(family: ChatEndpointFamily): Promise<IChatModelInformation>;

	/**
	 * Retrieves a chat model by its id
	 * @param id The id of the chat model you want to get
	 * @returns The chat model information if found, otherwise undefined
	 */
	getChatModelFromApiModel(model: LanguageModelChat): Promise<IChatModelInformation | undefined>;

	/**
	 * Retrieves an embeddings model by its family name
	 * @param family The family of the model to fetch
	 */
	getEmbeddingsModel(family: 'text-embedding-3-small'): Promise<IEmbeddingModelInformation>;
}

/**
 * Responsible for interacting with the CAPI Model API
 * This is solely owned by the EndpointProvider (and TestEndpointProvider) which uses this service to power server side rollout of models
 * All model acquisition should be done through the EndpointProvider
 */
export class ModelMetadataFetcher extends Disposable implements IModelMetadataFetcher {

	private static readonly ALL_MODEL_KEY = 'allModels';

	private _familyMap: Map<string, IModelAPIResponse[]> = new Map();
	private _completionsFamilyMap: Map<string, IModelAPIResponse[]> = new Map();
	private _copilotBaseModel: IModelAPIResponse | undefined;
	private _lastFetchTime: number = 0;
	private readonly _taskSingler = new TaskSingler<IModelAPIResponse | undefined | void>();
	private _lastFetchError: any;

	private readonly _onDidModelRefresh = new Emitter<void>();
	public onDidModelsRefresh = this._onDidModelRefresh.event;

	constructor(
		private readonly collectFetcherTelemetry: ((accessor: ServicesAccessor, error: any) => void) | undefined,
		protected readonly _isModelLab: boolean,
		@IFetcherService private readonly _fetcher: IFetcherService,
		@IRequestLogger private readonly _requestLogger: IRequestLogger,
		@ICAPIClientService private readonly _capiClientService: ICAPIClientService,
		@IConfigurationService private readonly _configService: IConfigurationService,
		@IExperimentationService private readonly _expService: IExperimentationService,
		@IEnvService private readonly _envService: IEnvService,
		@IAuthenticationService private readonly _authService: IAuthenticationService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ILogService private readonly _logService: ILogService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();
		this._register(this._authService.onDidAuthenticationChange(() => {
			// Auth changed so next fetch should be forced to get a new list
			this._familyMap.clear();
			this._completionsFamilyMap.clear();
			this._lastFetchTime = 0;
		}));

		this._register(workspace.onDidChangeConfiguration(async e => {
			if (e.affectsConfiguration('github.copilot.hackModels')) {
				await this._fetchModels(true);
			}
		}));
	}

	public async getAllCompletionModels(forceRefresh: boolean): Promise<ICompletionModelInformation[]> {
		await this._taskSingler.getOrCreate(ModelMetadataFetcher.ALL_MODEL_KEY, () => this._fetchModels(forceRefresh));
		const completionModels: ICompletionModelInformation[] = [];
		for (const [, models] of this._completionsFamilyMap) {
			for (const model of models) {
				if (isCompletionModelInformation(model)) {
					completionModels.push(model);
				}
			}
		}
		return completionModels;
	}

	public async getAllChatModels(): Promise<IChatModelInformation[]> {
		await this._taskSingler.getOrCreate(ModelMetadataFetcher.ALL_MODEL_KEY, this._fetchModels.bind(this));
		const chatModels: IChatModelInformation[] = [];
		for (const [, models] of this._familyMap) {
			for (const model of models) {
				if (isChatModelInformation(model)) {
					chatModels.push(model);
				}
			}
		}
		return chatModels;
	}

	/**
	 * Hydrates a model API response from the `/models` endpoint with proper exp overrides and error handling
	 * @param resolvedModel The resolved model to hydrate
	 * @returns The resolved model with proper exp overrides and token counts
	 */
	private async _hydrateResolvedModel(resolvedModel: IModelAPIResponse | undefined): Promise<IModelAPIResponse> {
		if (!resolvedModel) {
			throw this._lastFetchError;
		}

		// If it's a chat model, update max prompt tokens based on settings + exp
		if (isChatModelInformation(resolvedModel) && (resolvedModel.capabilities.limits)) {
			resolvedModel.capabilities.limits.max_prompt_tokens = this._getMaxPromptTokensOverride(resolvedModel);
			// Also ensure prompt tokens + output tokens <= context window. Output tokens is capped to max 15% input tokens
			const outputTokens = Math.floor(Math.min(resolvedModel.capabilities.limits.max_output_tokens ?? 4096, resolvedModel.capabilities.limits.max_prompt_tokens * 0.25));
			const contextWindow = resolvedModel.capabilities.limits.max_context_window_tokens ?? (outputTokens + resolvedModel.capabilities.limits.max_prompt_tokens);
			resolvedModel.capabilities.limits.max_prompt_tokens = Math.min(resolvedModel.capabilities.limits.max_prompt_tokens, contextWindow - outputTokens);
		}

		// If it's a chat model, update showInModelPicker based on experiment overrides
		if (isChatModelInformation(resolvedModel)) {
			resolvedModel.model_picker_enabled = this._getShowInModelPickerOverride(resolvedModel);
		}

		if (resolvedModel.preview && !resolvedModel.name.endsWith('(Preview)')) {
			// If the model is a preview model, we append (Preview) to the name
			resolvedModel.name = `${resolvedModel.name} (Preview)`;
		}
		return resolvedModel;
	}

	public async getChatModelFromFamily(family: ChatEndpointFamily): Promise<IChatModelInformation> {
		await this._taskSingler.getOrCreate(ModelMetadataFetcher.ALL_MODEL_KEY, this._fetchModels.bind(this));
		let resolvedModel: IModelAPIResponse | undefined;
		family = ModelAliasRegistry.resolveAlias(family) as ChatEndpointFamily;

		if (family === 'gpt-4.1') {
			resolvedModel = this._familyMap.get('gpt-4.1')?.[0] ?? this._familyMap.get('gpt-4o')?.[0];
		} else if (family === 'copilot-base') {
			resolvedModel = this._copilotBaseModel;
		} else {
			resolvedModel = this._familyMap.get(family)?.[0];
		}
		if (!resolvedModel || !isChatModelInformation(resolvedModel)) {
			throw new Error(`Unable to resolve chat model with family selection: ${family}`);
		}
		return resolvedModel;
	}

	public async getChatModelFromApiModel(apiModel: LanguageModelChat): Promise<IChatModelInformation | undefined> {
		await this._taskSingler.getOrCreate(ModelMetadataFetcher.ALL_MODEL_KEY, this._fetchModels.bind(this));
		let resolvedModel: IModelAPIResponse | undefined;
		for (const models of this._familyMap.values()) {
			resolvedModel = models.find(model =>
				model.id === apiModel.id &&
				model.version === apiModel.version &&
				model.capabilities.family === apiModel.family);
			if (resolvedModel) {
				break;
			}
		}
		if (!resolvedModel) {
			return;
		}
		if (!isChatModelInformation(resolvedModel)) {
			throw new Error(`Unable to resolve chat model: ${apiModel.id},${apiModel.name},${apiModel.version},${apiModel.family}`);
		}
		return resolvedModel;
	}

	public async getEmbeddingsModel(family: 'text-embedding-3-small'): Promise<IEmbeddingModelInformation> {
		await this._taskSingler.getOrCreate(ModelMetadataFetcher.ALL_MODEL_KEY, this._fetchModels.bind(this));
		const resolvedModel = this._familyMap.get(family)?.[0];
		if (!resolvedModel || !isEmbeddingModelInformation(resolvedModel)) {
			throw new Error(`Unable to resolve embeddings model with family selection: ${family}`);
		}
		return resolvedModel;
	}

	// private _shouldRefreshModels(): boolean {
	// 	if (this._familyMap.size === 0) {
	// 		return true;
	// 	}
	// 	const tenMinutes = 10 * 60 * 1000; // 30 seconds in milliseconds
	// 	const now = Date.now();

	// 	if (!this._lastFetchTime) {
	// 		return true; // If there's no last fetch time, we should refresh
	// 	}

	// 	// We only want to fetch models if the current session is active
	// 	if (!this._envService.isActive) {
	// 		return false;
	// 	}

	// 	const timeSinceLastFetch = now - this._lastFetchTime;

	// 	return timeSinceLastFetch > tenMinutes;
	// }

	// private async _fetchModels(force?: boolean): Promise<void> {
	// 	if (!force && !this._shouldRefreshModels()) {
	// 		return;
	// 	}
	// 	const requestStartTime = Date.now();

	// 	const copilotToken = (await this._authService.getCopilotToken()).token;
	// 	const requestId = generateUuid();
	// 	const requestMetadata = { type: RequestType.Models, isModelLab: this._isModelLab };

	// 	try {
	// 		const response = await getRequest(
	// 			this._fetcher,
	// 			this._telemetryService,
	// 			this._capiClientService,
	// 			requestMetadata,
	// 			copilotToken,
	// 			await createRequestHMAC(process.env.HMAC_SECRET),
	// 			'model-access',
	// 			requestId,
	// 		);

	// 		this._lastFetchTime = Date.now();
	// 		this._logService.info(`Fetched model metadata in ${Date.now() - requestStartTime}ms ${requestId}`);

	// 		if (response.status < 200 || response.status >= 300) {
	// 			// If we're rate limited and have models, we should just return
	// 			if (response.status === 429 && this._familyMap.size > 0) {
	// 				this._logService.warn(`Rate limited while fetching models ${requestId}`);
	// 				return;
	// 			}
	// 			throw new Error(`Failed to fetch models (${requestId}): ${(await response.text()) || response.statusText || `HTTP ${response.status}`}`);
	// 		}

	// 		this._familyMap.clear();

	// 		const data: IModelAPIResponse[] = (await response.json()).data;
	// 		this._requestLogger.logModelListCall(requestId, requestMetadata, data);
	// 		for (let model of data) {
	// 			model = await this._hydrateResolvedModel(model);
	// 			const isCompletionModel = isCompletionModelInformation(model);
	// 			// The base model is whatever model is deemed "fallback" by the server
	// 			if (model.is_chat_fallback && !isCompletionModel) {
	// 				this._copilotBaseModel = model;
	// 			}
	// 			const family = model.capabilities.family;
	// 			const familyMap = isCompletionModel ? this._completionsFamilyMap : this._familyMap;
	// 			if (!familyMap.has(family)) {
	// 				familyMap.set(family, []);
	// 			}
	// 			familyMap.get(family)?.push(model);
	// 		}
	// 		this._lastFetchError = undefined;
	// 		this._onDidModelRefresh.fire();

	// 		if (this.collectFetcherTelemetry) {
	// 			this._instantiationService.invokeFunction(this.collectFetcherTelemetry, undefined);
	// 		}
	// 	} catch (e) {
	// 		this._logService.error(e, `Failed to fetch models (${requestId})`);
	// 		this._lastFetchError = e;
	// 		this._lastFetchTime = 0;
	// 		// If we fail to fetch models, we should try again next time
	// 		if (this.collectFetcherTelemetry) {
	// 			this._instantiationService.invokeFunction(this.collectFetcherTelemetry, e);
	// 		}
	// 	}
	// }

	private _shouldRefreshModels(): boolean {
		if (this._familyMap.size === 0) {
			return true;
		}
		const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
		const now = Date.now();

		if (!this._lastFetchTime) {
			return true; // If there's no last fetch time, we should refresh
		}

		const timeSinceLastFetch = now - this._lastFetchTime;
		return timeSinceLastFetch > tenMinutes;
	}

	private async _fetchModels(force?: boolean): Promise<void> {
		if (!force && !this._shouldRefreshModels()) {
			return;
		}

		const requestId = generateUuid();
		const requestMetadata = { type: RequestType.Models, isModelLab: this._isModelLab };

		try {
			const base_config = workspace.getConfiguration('github.copilot.hackModels.base');
			const inline_config = workspace.getConfiguration('github.copilot.hackModels.inline');
			const embedding_config = workspace.getConfiguration('github.copilot.hackModels.embedding');
			const fast_config = workspace.getConfiguration('github.copilot.hackModels.fast');

			const models: IModelAPIResponse[] = [
				// base
				{
					id: "gpt-5-mini",
					preview: false,
					baseUrl: base_config.get("baseUrl", "http://steam"),
					apiKey: base_config.get("apiKey", "xxxxx"),
					name: base_config.get("model", "gpt-5.2"),
					model: base_config.get("model", "gpt-5.2"),
					is_chat_default: base_config.get("is_chat_default", true),
					is_chat_fallback: true,
					model_picker_enabled: base_config.get("model_picker_enabled", true),
					version: base_config.get("version", "v1.0.0"),
					supported_endpoints: base_config.get("supported_endpoints", [ModelSupportedEndpoint.ChatCompletions]) as ModelSupportedEndpoint[],
					capabilities: {
						type: "chat",
						family: "gpt-5-mini",
						tokenizer: base_config.get("capabilities.tokenizer", TokenizerType.O200K),
						limits: {
							max_context_window_tokens: base_config.get("capabilities.limits.max_context_window_tokens", 128000),
							max_output_tokens: base_config.get("capabilities.limits.max_output_tokens", Math.floor(base_config.get("capabilities.limits.max_context_window_tokens", 128000) * 0.25)),
							max_prompt_tokens: base_config.get("capabilities.limits.max_prompt_tokens", Math.floor(base_config.get("capabilities.limits.max_context_window_tokens", 128000) * 0.5)),
							vision: {
								max_prompt_images: base_config.get("capabilities.limits.vision.max_prompt_images", 1)
							}
						},
						supports: {
							parallel_tool_calls: base_config.get("capabilities.supports.parallel_tool_calls", true),
							streaming: base_config.get("capabilities.supports.streaming", true),
							tool_calls: base_config.get("capabilities.supports.tool_calls", true),
							vision: base_config.get("capabilities.supports.vision", true)
						},
					},
					policy: {
						state: "enabled",
						terms: "Enable access to the latest GPT-5 mini model from OpenAI. [Learn more about how GitHub Copilot serves GPT-5 mini](https://gh.io/copilot-openai)."
					},
					billing: {
						is_premium: true,
						multiplier: 1
					},
				},
				// ChatCompletions
				{
					id: "gpt-41-copilot",
					preview: false,
					baseUrl: inline_config.get("baseUrl", "http://steam"),
					apiKey: inline_config.get("apiKey", "xxxxx"),
					model: inline_config.get("model", "gpt-4.1"),
					name: inline_config.get("model", "gpt-4.1"),
					is_chat_default: inline_config.get("is_chat_default", false),
					is_chat_fallback: inline_config.get("is_chat_fallback", false),
					model_picker_enabled: inline_config.get("model_picker_enabled", true),
					version: inline_config.get("version", "v1.0.0"),
					supported_endpoints: inline_config.get("supported_endpoints", [ModelSupportedEndpoint.ChatCompletions]) as ModelSupportedEndpoint[],
					capabilities: {
						type: "completion",
						family: "gpt-4.1",
						tokenizer: inline_config.get("capabilities.tokenizer", TokenizerType.O200K),
					},
					billing: {
						is_premium: true,
						multiplier: 1
					},
				},
				// embedding
				{
					id: "text-embedding-3-small",
					preview: false,
					model_picker_enabled: false,
					baseUrl: embedding_config.get("baseUrl", "http://steam"),
					apiKey: embedding_config.get("apiKey", "xxxxx"),
					model: embedding_config.get("model", "text-embedding-3-small"),
					name: embedding_config.get("model", "text-embedding-3-small"),
					is_chat_default: false,
					is_chat_fallback: false,
					version: embedding_config.get("version", "v1.0.0"),
					capabilities: {
						type: "embeddings",
						family: "text-embedding-3-small",
						chunk_strategy: embedding_config.get("capabilities.chunk_strategy", "token"),
						tokenizer: embedding_config.get("capabilities.tokenizer", TokenizerType.O200K),
						limits: {
							max_inputs: embedding_config.get("capabilities.limits.max_inputs", 10),
							max_token: embedding_config.get("capabilities.limits.max_token", 250)
						},
					},
					billing: {
						is_premium: true,
						multiplier: 1
					},
				},
				// fast
				{
					id: "gpt-4o-mini",
					preview: false,
					baseUrl: fast_config.get("baseUrl", "http://steam"),
					apiKey: fast_config.get("apiKey", "xxxxx"),
					name: fast_config.get("model", "gpt-4o-mini"),
					model: fast_config.get("model", "gpt-4o-mini"),
					is_chat_default: fast_config.get("is_chat_default", true),
					is_chat_fallback: fast_config.get("is_chat_fallback", false),
					model_picker_enabled: fast_config.get("model_picker_enabled", false),
					version: fast_config.get("version", "v1.0.0"),
					supported_endpoints: fast_config.get("supported_endpoints", [ModelSupportedEndpoint.ChatCompletions]) as ModelSupportedEndpoint[],
					capabilities: {
						type: "chat",
						family: "gpt-4o-mini",
						tokenizer: fast_config.get("capabilities.tokenizer", TokenizerType.O200K),
						limits: {
							max_context_window_tokens: fast_config.get("capabilities.limits.max_context_window_tokens", 128000),
							max_output_tokens: fast_config.get("capabilities.limits.max_output_tokens", Math.floor(base_config.get("capabilities.limits.max_context_window_tokens", 128000) * 0.25)),
							max_prompt_tokens: fast_config.get("capabilities.limits.max_prompt_tokens", Math.floor(base_config.get("capabilities.limits.max_context_window_tokens", 128000) * 0.5)),
							vision: {
								max_prompt_images: fast_config.get("capabilities.limits.vision.max_prompt_images", 1)
							}
						},
						supports: {
							parallel_tool_calls: fast_config.get("capabilities.supports.parallel_tool_calls", true),
							streaming: fast_config.get("capabilities.supports.streaming", true),
							tool_calls: fast_config.get("capabilities.supports.tool_calls", true),
							vision: fast_config.get("capabilities.supports.vision", true)
						},
					},
					billing: {
						is_premium: true,
						multiplier: 1
					},
				},
				{
					id: "gpt-4.1",
					preview: false,
					baseUrl: fast_config.get("baseUrl", "http://steam"),
					apiKey: fast_config.get("apiKey", "xxxxx"),
					name: fast_config.get("model", "gpt-4.1"),
					model: fast_config.get("model", "gpt-4.1"),
					is_chat_default: fast_config.get("is_chat_default", true),
					is_chat_fallback: fast_config.get("is_chat_fallback", false),
					model_picker_enabled: false,
					version: fast_config.get("version", "v1.0.0"),
					supported_endpoints: fast_config.get("supported_endpoints", [ModelSupportedEndpoint.ChatCompletions]) as ModelSupportedEndpoint[],
					capabilities: {
						type: "chat",
						family: "gpt-4.1",
						tokenizer: fast_config.get("capabilities.tokenizer", TokenizerType.O200K),
						limits: {
							max_context_window_tokens: fast_config.get("capabilities.limits.max_context_window_tokens", 128000),
							max_output_tokens: fast_config.get("capabilities.limits.max_output_tokens", Math.floor(base_config.get("capabilities.limits.max_context_window_tokens", 128000) * 0.25)),
							max_prompt_tokens: fast_config.get("capabilities.limits.max_prompt_tokens", Math.floor(base_config.get("capabilities.limits.max_context_window_tokens", 128000) * 0.5)),
							vision: {
								max_prompt_images: fast_config.get("capabilities.limits.vision.max_prompt_images", 1)
							}
						},
						supports: {
							parallel_tool_calls: fast_config.get("capabilities.supports.parallel_tool_calls", true),
							streaming: fast_config.get("capabilities.supports.streaming", true),
							tool_calls: fast_config.get("capabilities.supports.tool_calls", true),
							vision: fast_config.get("capabilities.supports.vision", true)
						},
					},
					billing: {
						is_premium: true,
						multiplier: 1
					},
				}
			];

			const extras = workspace.getConfiguration('github.copilot.hackModels').get('extras', []) as IModelAPIResponse[];
			for (var i = 0; i < extras.length; i++) {
				const item = extras[i];
				try {
					item.id = item.model ?? `custom_${i}`;
					item.name = item.model ?? `Custom Model ${i}`;
					item.model_picker_enabled = true;

					if (item.capabilities.family.length <= 0) {
						item.capabilities.family = "custom";
					}

					models.push(item);
				} catch (e) {
					this._logService.error(e, `Failed to append extras model ${String(item.model)}.`);
				}
			}

			this._familyMap.clear();

			this._requestLogger.logModelListCall(requestId, requestMetadata, models);
			for (let model of models) {
				model = await this._hydrateResolvedModel(model);
				const isCompletionModel = isCompletionModelInformation(model);
				// The base model is whatever model is deemed "fallback" by the server
				if (model.is_chat_fallback && !isCompletionModel) {
					this._copilotBaseModel = model;
				}
				const family = model.capabilities.family;
				const familyMap = isCompletionModel ? this._completionsFamilyMap : this._familyMap;
				if (!familyMap.has(family)) {
					familyMap.set(family, []);
				}
				familyMap.get(family)?.push(model);
			}

			this._lastFetchTime = Date.now();
			this._lastFetchError = undefined;
			this._onDidModelRefresh.fire();

		} catch (e) {
			this._logService.error(e, `Failed to fetch models (${requestId})`);
			this._lastFetchError = e;
			this._lastFetchTime = 0;
		}
	}

	// get ChatMaxNumTokens from config for experimentation
	private _getMaxPromptTokensOverride(chatModelInfo: IChatModelInformation): number {
		// check debug override ChatMaxTokenNum
		const chatMaxTokenNumOverride = this._configService.getConfig(ConfigKey.TeamInternal.DebugOverrideChatMaxTokenNum); // can only be set by internal users
		// Base 3 tokens for each OpenAI completion
		let modelLimit = -3;
		// if option is set, takes precedence over any other logic
		if (chatMaxTokenNumOverride > 0) {
			modelLimit += chatMaxTokenNumOverride;
			return modelLimit;
		}

		let experimentalOverrides: Record<string, number> = {};
		try {
			const expValue = this._expService.getTreatmentVariable<string>('copilotchat.contextWindows');
			experimentalOverrides = JSON.parse(expValue ?? '{}');
		} catch {
			// If the experiment service either is not available or returns a bad value we ignore the overrides
		}

		// If there's an experiment that takes precedence over what comes back from CAPI
		if (experimentalOverrides[chatModelInfo.id]) {
			modelLimit += experimentalOverrides[chatModelInfo.id];
			return modelLimit;
		}

		// Check if CAPI has prompt token limits and return those
		if (chatModelInfo.capabilities?.limits?.max_prompt_tokens) {
			modelLimit += chatModelInfo.capabilities.limits.max_prompt_tokens;
			return modelLimit;
		} else if (chatModelInfo.capabilities.limits?.max_context_window_tokens) {
			// Otherwise return the context window as the prompt tokens for cases where CAPI doesn't configure the prompt tokens
			modelLimit += chatModelInfo.capabilities.limits.max_context_window_tokens;
			return modelLimit;
		}

		return modelLimit;
	}

	private _getShowInModelPickerOverride(resolvedModel: IModelAPIResponse): boolean {
		let modelPickerOverrides: Record<string, boolean> = {};
		const expResult = this._expService.getTreatmentVariable<string>('copilotchat.showInModelPicker');
		try {
			modelPickerOverrides = JSON.parse(expResult || '{}');
		} catch {
			// No-op if parsing experiment fails
		}

		return modelPickerOverrides[resolvedModel.id] ?? resolvedModel.model_picker_enabled;
	}
}

//#endregion

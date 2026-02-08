# hack


# 配置

- 文件： `package.json`
- 修改字段 ： 'contributes.configuration.properties'

```json
"github.copilot.hackModels": {
	"type": "object",
	"default": {},
	"properties": {
		"base": {
			"type": "object",
			"default": {},
			"properties": {
				"baseUrl": { "type": "string" },
				"apiKey": { "type": "string" },
				"model": { "type": "string" },
				"model_picker_enabled": { "type": "boolean", "default": true },
				"is_chat_default": { "type": "boolean" , "default": false},
				"version": { "type": "string" , "default":"v1.0.0"},
				"supported_endpoints": {
					"type": "array",
					"default": [],
					"items": {
						"type": "string",
						"enum": [
							"/chat/completions",
							"/responses",
							"/v1/messages"
						]
					}
				},
				"capabilities": {
					"type": "object",
					"default": {
						"type": "chat",
						"family": "custom",
						"tokenizer": "o200k_base",
						"supports": {
							"streaming": true,
							"thinking": false,
							"vision": false,
							"tool_calls": true,
							"parallel_tool_calls": true
						}
					},
					"properties": {
						"type": { "const": "chat" },
						"tokenizer": { "type": "string", "enum": ["cl100k_base", "o200k_base"], "default": "o200k_base" },
						"limits": {
							"type": "object",
							"properties": {
								"max_prompt_tokens": { "type": "number", "default":  128000},
								"max_output_tokens": { "type": "number" , "default": 64000},
								"max_context_window_tokens": { "type": "number", "default":  264000},
								"vision": {
									"type": "object",
									"properties": {
										"max_prompt_images": { "type": "number" }
									}
								}
							},
							"additionalProperties": false
						},
						"supports": {
							"type": "object",
							"default": {
								"thinking": false,
								"vision": false,
								"tool_calls": true,
								"parallel_tool_calls": true
							},
							"properties": {
								"parallel_tool_calls": { "type": "boolean", "default": true },
								"tool_calls": { "type": "boolean" , "default": true},
								"streaming": { "type": ["boolean","null"], "default": true },
								"vision": { "type": "boolean", "default": false },
								"prediction": { "type": "boolean", "default": false },
								"thinking": { "type": "boolean", "default":false }
							}
						}
					}
				}

			},
			"required": ["apiKey","baseUrl","model"],
			"additionalProperties": false
		},
		"inline": {
			"type": "object",
			"properties": {
				"baseUrl": { "type": "string" },
				"apiKey": { "type": "string" },
				"model": { "type": "string" },
				"mode": { "type": "string" , "enum": ["chat", "code"]},
				"model_picker_enabled": { "type": "boolean", "default": false },
				"stop": {
					"type": "array",
					"items": { "type": "string" }
				},
				"is_chat_default": { "type": "boolean" , "default": false},
				"is_chat_fallback": { "type": "boolean" , "default": true},
				"version": { "type": "string" , "default":"v1.0.0"},
				"capabilities": {
					"type": "object",
					"properties": {
						"type": { "const": "completion" },
						"tokenizer": { "type": "string", "enum": ["cl100k_base", "o200k_base"] , "default": "o200k_base"},
						"limits": {
							"type": "object",
							"properties": {
								"interval": {"type": "number", "default": 300}
							}
						}
					},
					"additionalProperties": false
				}
			},
			"required": ["apiKey","baseUrl","model","mode"],
			"additionalProperties": false
		},
		"next": {
			"type": "object",
			"properties": {
				"baseUrl": { "type": "string" },
				"apiKey": { "type": "string" },
				"model": { "type": "string" },
				"model_picker_enabled": { "type": "boolean", "default": false },
				"is_chat_default": { "type": "boolean" , "default": false},
				"is_chat_fallback": { "type": "boolean" , "default": true},
				"version": { "type": "string" , "default":"v1.0.0"},
				"supported_endpoints": {
					"type": "array",
					"items": {
						"type": "string",
						"enum": [
							"/chat/completions",
							"/responses",
							"/v1/messages"
						]
					}
				},
				"capabilities": {
					"type": "object",
					"default": {
						"type": "chat",
						"family": "custom",
						"tokenizer": "o200k_base",
						"supports": {
							"streaming": true,
							"thinking": false,
							"vision": false,
							"tool_calls": true,
							"parallel_tool_calls": true
						}
					},
					"properties": {
						"type": { "const": "chat" },
						"tokenizer": { "type": "string", "enum": ["cl100k_base", "o200k_base"], "default": "o200k_base" },
						"limits": {
							"type": "object",
							"properties": {
								"max_prompt_tokens": { "type": "number", "default":  128000},
								"max_output_tokens": { "type": "number" , "default": 64000},
								"max_context_window_tokens": { "type": "number", "default":  264000},
								"vision": {
									"type": "object",
									"properties": {
										"max_prompt_images": { "type": "number" }
									}
								}
							},
							"additionalProperties": false
						},
						"supports": {
							"type": "object",
							"default":{
								"streaming": true,
								"thinking": false,
								"vision": false,
								"tool_calls": true,
								"parallel_tool_calls": true
							},
							"properties": {
								"parallel_tool_calls": { "type": "boolean", "default": true },
								"tool_calls": { "type": "boolean" , "default": true},
								"streaming": { "type": ["boolean","null"], "default": true },
								"vision": { "type": "boolean", "default": false },
								"prediction": { "type": "boolean", "default": false },
								"thinking": { "type": "boolean", "default":false }
							}
						}
					}
				}
			},
			"required": ["apiKey","baseUrl","model"],
			"additionalProperties": false
		},
		"embedding": {
			"type": "object",
			"properties": {
				"baseUrl": { "type": "string" },
				"apiKey": { "type": "string" },
				"model": { "type": "string" },
				"version": { "type": "string" , "default":"v1.0.0"},
				"capabilities": {
					"type": "object",
					"properties": {
						"type": { "const": "embeddings" },
						"tokenizer": { "type": "string", "enum": ["cl100k_base", "o200k_base"] , "default": "o200k_base"},
						"chunk_strategy": { "type": "string", "enum": ["token", "recursive"], "default":"token"},
						"limits": {
							"type": "object",
							"properties": {
								"max_inputs": { "type": "number" },
								"max_token": { "type": "number" }
							},
							"additionalProperties": false
						}
					}
				}
			},
			"required": ["apiKey","baseUrl","model"],
			"additionalProperties": false
		},
		"fast": {
			"type": "object",
			"properties": {
				"baseUrl": { "type": "string" },
				"apiKey": { "type": "string" },
				"model": { "type": "string" },
				"model_picker_enabled": { "type": "boolean", "default": true },
				"is_chat_default": { "type": "boolean" , "default": false},
				"is_chat_fallback": { "type": "boolean" , "default": false},
				"version": { "type": "string" , "default":"v1.0.0"},
				"supported_endpoints": {
					"type": "array",
					"items": {
						"type": "string",
						"enum": [
							"/chat/completions",
							"/responses",
							"/v1/messages"
						]
					}
				},
				"capabilities": {
					"type": "object",
					"default": {
						"type": "chat",
						"family": "custom",
						"tokenizer": "o200k_base",
						"supports": {
							"streaming": true,
							"thinking": false,
							"vision": false,
							"tool_calls": true,
							"parallel_tool_calls": true
						}
					},
					"properties": {
						"type": { "const": "chat" },
						"tokenizer": { "type": "string", "enum": ["cl100k_base", "o200k_base"], "default": "o200k_base" },
						"limits": {
							"type": "object",
							"properties": {
								"max_prompt_tokens": { "type": "number", "default":  128000},
								"max_output_tokens": { "type": "number" , "default": 64000},
								"max_context_window_tokens": { "type": "number", "default":  264000},
								"vision": {
									"type": "object",
									"properties": {
										"max_prompt_images": { "type": "number" }
									}
								}
							},
							"additionalProperties": false
						},
						"supports": {
							"type": "object",
							"default": {
								"streaming": true,
								"thinking": false,
								"vision": false,
								"tool_calls": true,
								"parallel_tool_calls": true
							},
							"properties": {
								"parallel_tool_calls": { "type": "boolean", "default": true },
								"tool_calls": { "type": "boolean" , "default": true},
								"streaming": { "type": ["boolean","null"], "default": true },
								"vision": { "type": "boolean", "default": false },
								"prediction": { "type": "boolean", "default": false },
								"thinking": { "type": "boolean", "default":false }
							}
						}
					}
				}
			},
			"required": ["apiKey","baseUrl","model"],
			"additionalProperties": false
		},
		"extras":{
			"type":"array",
			"items": {
				"type": "object",
				"properties": {
					"baseUrl": { "type": "string" },
					"apiKey": { "type": "string" },
					"model": { "type": "string" },
					"is_chat_default": { "type": "boolean" , "default": false},
					"is_chat_fallback": { "type": "boolean" , "default": false},
					"version": { "type": "string" , "default":"v1.0.0"},
					"supported_endpoints": {
						"type": "array",
						"items": {
							"type": "string",
							"enum": [
								"/chat/completions",
								"/responses",
								"/v1/messages"
							]
						}
					},
					"capabilities": {
						"type": "object",
						"default": {
							"type": "chat",
							"family": "custom",
							"tokenizer": "o200k_base",
							"supports": {
								"streaming": true,
								"thinking": false,
								"vision": false,
								"tool_calls": true,
								"parallel_tool_calls": true
							}
						},
						"properties": {
							"type": { "const": "chat" },
							"family": { "type": "string", "default": "custom"},
							"tokenizer": { "type": "string", "enum": ["cl100k_base", "o200k_base"], "default": "o200k_base" },
							"limits": {
								"type": "object",
								"properties": {
									"max_prompt_tokens": { "type": "number", "default":  128000},
									"max_output_tokens": { "type": "number" , "default": 64000},
									"max_context_window_tokens": { "type": "number", "default":  264000},
									"vision": {
										"type": "object",
										"properties": {
											"max_prompt_images": { "type": "number" }
										}
									}
								},
								"additionalProperties": false
							},
							"supports": {
								"type": "object",
								"default": {
									"streaming": true,
									"thinking": false,
									"vision": false,
									"tool_calls": true,
									"parallel_tool_calls": true
								},
								"properties": {
									"parallel_tool_calls": { "type": "boolean", "default": true },
									"tool_calls": { "type": "boolean" , "default": true},
									"streaming": { "type": ["boolean","null"], "default": true },
									"vision": { "type": "boolean", "default": false },
									"prediction": { "type": "boolean", "default": false },
									"thinking": { "type": "boolean", "default":false }
								}
							}
						},
						"required": ["type","family","tokenizer","supports"]
					}
				},
				"required": ["apiKey","baseUrl","model","capabilities"],
				"additionalProperties": false
			}
		}
	},
	"required": ["base","inline", "fast" , "next", "embedding"]
}
```



# 登陆验证

## session

- 文件： `src\platform\authentication\vscode-node\session.ts`
- 修改函数

    ```ts
    async function getAuthSession(providerId: string, defaultScopes: string[], getSilentSession: () => Promise<AuthenticationSession | undefined>, options: AuthenticationGetSessionOptions = {}) {
       /* 省略.... */
    }
    ```
- 修改实现

    ```ts
    async function getAuthSession(providerId: string, defaultScopes: string[], getSilentSession: () => Promise<AuthenticationSession | undefined>, options: AuthenticationGetSessionOptions = {}) {
        return {
            id: '855414255f361cfd',
            account: {
                label: 'guest',
                id: '1234'
            },
            scopes: ["user:email"],
            accessToken: 'xx',
        } as AuthenticationSession;
    }
    ```

## token

- 文件: `src\platform\authentication\node\copilotTokenManager.ts`
- 修改函数

    ```ts
	private async doAuthFromGitHubTokenOrDevDeviceId(
		context: { githubToken: string; ghUsername: string } | { devDeviceId: string }
	): Promise<TokenInfoOrError & NotGitHubLoginFailed> {
        /* ..... */
    }
    ```
- 修改实现

    ```ts
	private async doAuthFromGitHubTokenOrDevDeviceId(
		context: { githubToken: string; ghUsername: string } | { devDeviceId: string }
	): Promise<TokenInfoOrError & NotGitHubLoginFailed> {

		let userInfo: CopilotUserInfo | undefined;

		const tokenInfo: TokenEnvelope = {
			// Required fields
			token: "tid=70b36c9e-ea08-48c2-b28e-0dd535b39982",
			expires_at: 2770033513,
			refresh_in: 1500000,
			sku: "copilot_for_business_seat_quota",
			individual: false,

			// Feature flags
			blackbird_clientside_indexing: false,
			code_quote_enabled: true,
			code_review_enabled: true,
			codesearch: true,
			copilotignore_enabled: false,
			vsc_electron_fetcher_v2: false,

			// Consent settings
			public_suggestions: 'disabled',
			telemetry: 'disabled',

			// Optional fields
			/** SKU-isolated endpoints. */
			endpoints: {
				api: "https://xxxx",
				"origin-tracker": "https://xxxx",
				proxy: "https://xxxxx",
				telemetry: "https://xxxxx"
			},
			enterprise_list: null,
			limited_user_quotas: null,
			limited_user_reset_date: null,
			organization_list: ["184531bbdd2fc3x8eee45c6c7e42aeb6"]
		};

		tokenInfo.expires_at = nowSeconds() + tokenInfo.refresh_in + 60; // extra buffer to allow refresh to happen successfully

		// extend the token envelope
		const login = 'gust';
		let isVscodeTeamMember = false;
		// VS Code team members are guaranteed to be a part of an internal org so we can check that first to minimize API calls
		if (containsInternalOrg(tokenInfo.organization_list ?? []) && 'githubToken' in context) {
			isVscodeTeamMember = !!(await this._baseOctokitservice.getTeamMembershipWithToken(VSCodeTeamId, context.githubToken, login));
		}
		const extendedInfo: ExtendedTokenInfo = {
			...tokenInfo,
			copilot_plan: userInfo?.copilot_plan ?? tokenInfo.sku ?? '',
			quota_snapshots: userInfo?.quota_snapshots,
			quota_reset_date: userInfo?.quota_reset_date,
			codex_agent_enabled: userInfo?.codex_agent_enabled,
			organization_login_list: userInfo?.organization_login_list ?? [],
			username: login,
			isVscodeTeamMember,
		};
		return { kind: 'success', ...extendedInfo };
	}

    ```

# 模型


## 新增字段

- 文件：`src\platform\endpoint\common\endpointProvider.ts`
- 修改接口: `IModelAPIResponse`
- 修改后

	```ts
	export interface IModelAPIResponse {
		id: string;
		name: string;
		policy?: ModelPolicy;
		model_picker_enabled: boolean;
		preview?: boolean;
		baseUrl?: string;				// 新增字段
		apiKey?: string;				// 新增字段
		model?: string;					// 新增字段
		is_chat_default: boolean;
		is_chat_fallback: boolean;
		version: string;
		warning_messages?: { code: string; message: string }[];
		info_messages?: { code: string; message: string }[];
		billing?: { is_premium: boolean; multiplier: number; restricted_to?: string[] };
		capabilities: IChatModelCapabilities | ICompletionModelCapabilities | IEmbeddingModelCapabilities;
		supported_endpoints?: ModelSupportedEndpoint[];
		custom_model?: { key_name: string; owner_name: string };
	}

	```

- 文件：`node_modules\@vscode\copilot-api\dist\types.d.ts`
- 修改接口：`RequestMetadata`
- 修改后

	```ts
	export type RequestMetadata = {
		baseUrl?: string;  // 新增字段
		apiKey?: string;	// 新增字段
		model?: string; // 新增字段
	} & {
		/* .... */
	}
	```

- 文件： `src\platform\endpoint\node\chatEndpoint.ts`
- 修改接口：`public get urlOrRequestMetadata(): string | RequestMetadata`
- 修改后

	```ts
	public get urlOrRequestMetadata(): string | RequestMetadata {
		// Use override or respect setting.
		// TODO unlikely but would break if it changes in the middle of a request being constructed
		return this.modelMetadata.urlOrRequestMetadata ??
			(this.useResponsesApi ? { type: RequestType.ChatResponses, baseUrl: this.modelMetadata.baseUrl, apiKey: this.modelMetadata.apiKey } :
				this.useMessagesApi ? { type: RequestType.ChatMessages, baseUrl: this.modelMetadata.baseUrl, apiKey: this.modelMetadata.apiKey, model: this.modelMetadata.model } : { type: RequestType.ChatCompletions, baseUrl: this.modelMetadata.baseUrl, apiKey: this.modelMetadata.apiKey });
	}
	```

- 文件 `src\platform\endpoint\node\embeddingsEndpoint.ts`
- 修改接口 `public get urlOrRequestMetadata(): string | RequestMetadata`
- 修改后

	```ts
	public get urlOrRequestMetadata(): string | RequestMetadata {
		return { type: RequestType.CAPIEmbeddings, modelId: LEGACY_EMBEDDING_MODEL_ID.TEXT3SMALL, baseUrl: this._modelInfo.baseUrl, apiKey: this._modelInfo.apiKey, model: this._modelInfo.model };
	}
	```


## 模型获取


- 文件： `src\platform\endpoint\node\modelMetadataFetcher.ts`
- 修改函数： `private async _fetchModels(force?: boolean): Promise<void>`
- 修改后

	```ts
	// NOTE - 需要 Ai 实现 this._onDidModelRefresh.fire() 触发 src\extension\conversation\vscode-node\languageModelAccess.ts 中的 this._onDidChange.fire() ，实现 language Models 界面刷新

	private _shouldRefreshModels(): boolean {
		if (this._familyMap.size === 0) {
			return true;
		}
		const tenMinutes = 30 * 1000; // 30 seconds in milliseconds
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
							max_output_tokens: base_config.get("capabilities.limits.max_output_tokens", 64000),
							max_prompt_tokens: base_config.get("capabilities.limits.max_prompt_tokens", 128000),
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
					is_chat_default: inline_config.get("is_chat_default", true),
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
							max_output_tokens: fast_config.get("capabilities.limits.max_output_tokens", 64000),
							max_prompt_tokens: fast_config.get("capabilities.limits.max_prompt_tokens", 128000),
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
							max_output_tokens: fast_config.get("capabilities.limits.max_output_tokens", 64000),
							max_prompt_tokens: fast_config.get("capabilities.limits.max_prompt_tokens", 128000),
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
					item.name = item.name ?? item.model ?? `Custom Model ${i}`;
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
	```


## autoMode

- 文件：`src\platform\endpoint\node\automodeService.ts`
- 修改函数: `private async _fetchToken(): Promise<void>{}`
- 修改后
	```ts
	private async _fetchToken(): Promise<void> {

		const data: AutoModeAPIResponse = {
			available_models: ["gpt-5-mini", "gpt-4.1", "gpt-4o"],
			selected_model: "gpt-5-mini",
			session_token: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmFpbGFibGVfbW9kZWxzIjpbImdwdC01LW1pbmkiLCJncHQtNC4xIiwiZ3B0LTRvIl0sInNlbGVjdGVkX21vZGVsIjoiZ3B0LTUtbWluaSIsInN1YiI6IjllNTdmMGJmMjY5YzNjZWQ2NTZkZTgzMjQzMGZlNDc3IiwiaWF0IjoxNzcwNDI5MjQ2LCJleHAiOjE3NzA0MzI4NDZ9.V1sHTOUW0xGgARlOC1gT-QxqOx2Pl2qGMAfC8BhoFYC_OamHreu0xsW2LcO29TRRSLdxWhG9r502uzIzGjhQfg",
			expires_at: 2770432846
		};

		data.expires_at = Math.floor(Date.now() / 1000) + 600;

		this._token = data;
		// Trigger a refresh 5 minutes before expiration
		if (!this._store.isDisposed) {
			this._refreshTimer.cancelAndSet(this._fetchToken.bind(this), (data.expires_at * 1000) - Date.now() - 5 * 60 * 1000);
		}
		this._fetchTokenPromise = undefined;
	}
	```

# 请求

## 响应后处理

- 文件： `src\extension\prompt\node\chatMLFetcher.ts`
- 函数

	```ts
	private async processSuccessfulResponse(
		response: ChatResults,
		messages: Raw.ChatMessage[],
		requestBody: IEndpointBody,
		requestId: string,
		maxResponseTokens: number,
		promptTokenCount: number,
		timeToFirstToken: number,
		streamRecorder: FetchStreamRecorder,
		baseTelemetry: TelemetryData,
		chatEndpointInfo: IChatEndpoint,
		userInitiatedRequest: boolean | undefined,
		fetcher: FetcherId | undefined,
		bytesReceived: number | undefined,
	): Promise<ChatResponses | ChatFetchRetriableError<string[]>>

	```

- 修改

	```ts
	private async processSuccessfulResponse(
		response: ChatResults,
		messages: Raw.ChatMessage[],
		requestBody: IEndpointBody,
		requestId: string,
		maxResponseTokens: number,
		promptTokenCount: number,
		timeToFirstToken: number,
		streamRecorder: FetchStreamRecorder,
		baseTelemetry: TelemetryData,
		chatEndpointInfo: IChatEndpoint,
		userInitiatedRequest: boolean | undefined,
		fetcher: FetcherId | undefined,
		bytesReceived: number | undefined,
	): Promise<ChatResponses | ChatFetchRetriableError<string[]>> {

		const completions: ChatCompletion[] = [];

		for await (const chatCompletion of response.chatCompletions) {
			Telemetry.sendSuccessTelemetry(
				this._telemetryService,
				{
					chatCompletion,
					baseTelemetry,
					userInitiatedRequest,
					chatEndpointInfo,
					requestBody,
					maxResponseTokens,
					promptTokenCount,
					timeToFirstToken,
					timeToFirstTokenEmitted: (baseTelemetry && streamRecorder.firstTokenEmittedTime) ? streamRecorder.firstTokenEmittedTime - baseTelemetry.issuedTime : -1,
					hasImageMessages: this.filterImageMessages(messages),
					fetcher,
					bytesReceived,
				}
			);

			if (!this.isRepetitive(chatCompletion, baseTelemetry?.properties)) {
				completions.push(chatCompletion);
			}
		}

		// NOTE - 增加 FinishedCompletionReason.ClientDone 完成标记
		const successFinishReasons = new Set([FinishedCompletionReason.Stop, FinishedCompletionReason.ClientDone, FinishedCompletionReason.ClientTrimmed, FinishedCompletionReason.FunctionCall, FinishedCompletionReason.ToolCalls]);
		const successfulCompletions = completions.filter(c => successFinishReasons.has(c.finishReason));
		if (successfulCompletions.length >= 1) {
			return {
				type: ChatFetchResponseType.Success,
				resolvedModel: successfulCompletions[0].model,
				usage: successfulCompletions.length === 1 ? successfulCompletions[0].usage : undefined,
				value: successfulCompletions.map(c => getTextPart(c.message.content)),
				requestId,
				serverRequestId: successfulCompletions[0].requestId.headerRequestId,
			};
		}

		const result = completions.at(0);

		switch (result?.finishReason) {
			case FinishedCompletionReason.ContentFilter:
				return {
					type: ChatFetchResponseType.FilteredRetry,
					category: result.filterReason ?? FilterReason.Copyright,
					reason: 'Response got filtered.',
					value: completions.map(c => getTextPart(c.message.content)),
					requestId: requestId,
					serverRequestId: result.requestId.headerRequestId,
				};
			case FinishedCompletionReason.Length:
				return {
					type: ChatFetchResponseType.Length,
					reason: 'Response too long.',
					requestId: requestId,
					serverRequestId: result.requestId.headerRequestId,
					truncatedValue: getTextPart(result.message.content)
				};
			case FinishedCompletionReason.ServerError:
				return {
					type: ChatFetchResponseType.Failed,
					reason: 'Server error. Stream terminated',
					requestId: requestId,
					serverRequestId: result.requestId.headerRequestId,
					streamError: result.error
				};
		}
		return {
			type: ChatFetchResponseType.Unknown,
			reason: 'Response contained no choices.',
			requestId: requestId,
			serverRequestId: result?.requestId.headerRequestId,
		};
	}
	```

## 通用请求

- 文件：`src\platform\networking\common\networking.ts`
- 修改函数

	```ts
	function networkRequest(
		fetcher: IFetcher,
		telemetryService: ITelemetryService,
		capiClientService: ICAPIClientService,
		requestType: 'GET' | 'POST',
		endpointOrUrl: IEndpoint | string | RequestMetadata,
		secretKey: string,
		intent: string,
		requestId: string,
		body?: IEndpointBody,
		additionalHeaders?: Record<string, string>,
		cancelToken?: CancellationToken,
		useFetcher?: FetcherId,
		canRetryOnce: boolean = true,
		location?: ChatLocation,
	): Promise<Response>
	```

- 修改后

	```ts
	function networkRequest(
		fetcher: IFetcher,
		telemetryService: ITelemetryService,
		capiClientService: ICAPIClientService,
		requestType: 'GET' | 'POST',
		endpointOrUrl: IEndpoint | string | RequestMetadata,
		secretKey: string,
		intent: string,
		requestId: string,
		body?: IEndpointBody,
		additionalHeaders?: Record<string, string>,
		cancelToken?: CancellationToken,
		useFetcher?: FetcherId,
		canRetryOnce: boolean = true,
		location?: ChatLocation,
	): Promise<Response> {
		// TODO @lramos15 Eventually don't even construct this fake endpoint object.
		const endpoint = typeof endpointOrUrl === 'string' || 'type' in endpointOrUrl ? {
			modelMaxPromptTokens: 0,
			urlOrRequestMetadata: endpointOrUrl,
			family: '',
			tokenizer: TokenizerType.O200K,
			acquireTokenizer: () => {
				throw new Error('Method not implemented.');
			},
			name: '',
			version: '',
		} satisfies IEndpoint : endpointOrUrl;


		let url: string | undefined = undefined;
		if (typeof endpoint.urlOrRequestMetadata !== 'string'
			&& endpoint.urlOrRequestMetadata.baseUrl !== undefined
			&& endpoint.urlOrRequestMetadata.apiKey !== undefined) {
			secretKey = endpoint.urlOrRequestMetadata.apiKey;
			url = endpoint.urlOrRequestMetadata.baseUrl;
			if (body) {
				body.model = endpoint.urlOrRequestMetadata.model;
			}

			switch (endpoint.urlOrRequestMetadata.type) {
				case RequestType.Models: url += "/models"; break;
				case RequestType.CAPIEmbeddings: url += "/embeddings"; break;
				case RequestType.ChatCompletions: url += "/chat/completions"; break;
				case RequestType.ChatResponses: url += "/responses"; break;
				case RequestType.ChatMessages: url += "/v1/messages"; break;
				default:
					url = undefined;
			}
		} else if (typeof endpoint.urlOrRequestMetadata !== 'string'
			&& (endpoint.urlOrRequestMetadata.type == RequestType.ProxyCompletions
				|| endpoint.urlOrRequestMetadata.type == RequestType.ProxyChatCompletions
			)
		) {
			const next_config = workspace.getConfiguration("github.copilot.hackModels.next");
			url = next_config.get("baseUrl", "https://api.vectorengine.ai/v1") + "/chat/completions";
			secretKey = next_config.get("apiKey", "xxx")
			if (body) {
				body.model = next_config.get("model", "gpt-4o");
			}
		}

		const headers: ReqHeaders = {
			Authorization: `Bearer ${secretKey}`,
			'X-Request-Id': requestId,
			'X-Interaction-Type': intent,
			'OpenAI-Intent': intent, // Tells CAPI who flighted this request. Helps find buggy features
			'X-GitHub-Api-Version': '2025-05-01',
			...additionalHeaders,
			...(endpoint.getExtraHeaders ? endpoint.getExtraHeaders(location) : {}),
		};

		if (endpoint.interceptBody) {
			endpoint.interceptBody(body);
		}


		const endpointFetchOptions = endpoint.getEndpointFetchOptions?.();
		const request: FetchOptions = {
			method: requestType,
			headers: headers,
			json: body,
			timeout: requestTimeoutMs,
			useFetcher,
			suppressIntegrationId: endpointFetchOptions?.suppressIntegrationId
		};

		if (cancelToken) {
			const abort = fetcher.makeAbortController();
			cancelToken.onCancellationRequested(() => {
				// abort the request when the token is canceled
				telemetryService.sendGHTelemetryEvent('networking.cancelRequest', {
					headerRequestId: requestId,
				});
				abort.abort();
			});
			// pass the controller abort signal to the request
			request.signal = abort.signal;
		}
		if (typeof endpoint.urlOrRequestMetadata === 'string') {
			const requestPromise = fetcher.fetch(endpoint.urlOrRequestMetadata, request).catch(reason => {
				if (canRetryOnce && canRetryOnceNetworkError(reason)) {
					// disconnect and retry the request once if the connection was reset
					return fetcher.disconnectAll().then(() => {
						return fetcher.fetch(endpoint.urlOrRequestMetadata as string, request);
					});
				} else if (fetcher.isAbortError(reason)) {
					throw new CancellationError();
				} else {
					throw reason;
				}
			});
			return requestPromise;
		} else if (url) {

			const requestPromise = fetcher.fetch(url, request)
				.then(resp => {
					return resp;
				})
				.catch(reason => {
					if (canRetryOnce && canRetryOnceNetworkError(reason)) {
						// disconnect and retry the request once if the connection was reset
						return fetcher.disconnectAll().then(() => {
							return fetcher.fetch(url, request);
						});
					} else if (fetcher.isAbortError(reason)) {
						throw new CancellationError();
					} else {
						throw reason;
					}
				});
			return requestPromise;
		} else {
			return capiClientService.makeRequest(request, endpoint.urlOrRequestMetadata as RequestMetadata);
		}
	}

	```

# 补全

## NES 补全

- 文件： `src\extension\xtab\node\xtabProvider.ts`
- 修改函数

	```ts
	private async *doGetNextEditWithSelection(
		request: StatelessNextEditRequest,
		selection: Range | null,
		delaySession: DelaySession,
		parentTracer: ILogger,
		logContext: InlineEditRequestLogContext,
		cancellationToken: CancellationToken,
		telemetryBuilder: StatelessNextEditTelemetryBuilder,
		retryState: RetryState.t,
	): EditStreaming
	```

- 修改内容

	```ts
	private async *doGetNextEditWithSelection(
		request: StatelessNextEditRequest,
		selection: Range | null,
		delaySession: DelaySession,
		parentTracer: ILogger,
		logContext: InlineEditRequestLogContext,
		cancellationToken: CancellationToken,
		telemetryBuilder: StatelessNextEditTelemetryBuilder,
		retryState: RetryState.t,
	): EditStreaming {

		const tracer = parentTracer.createSubLogger(['XtabProvider', 'doGetNextEditWithSelection']);

		const activeDocument = request.getActiveDocument();

		if (selection === null) {
			return new NoNextEditReason.Uncategorized(new Error('NoSelection'));
		}

		const promptOptions = this.determineModelConfiguration(activeDocument);

		const endpoint = this.getEndpoint(promptOptions.modelName);
		logContext.setEndpointInfo(typeof endpoint.urlOrRequestMetadata === 'string' ? endpoint.urlOrRequestMetadata : JSON.stringify(endpoint.urlOrRequestMetadata.type), endpoint.model);
		telemetryBuilder.setModelName(endpoint.model);

		const cursorPosition = new Position(selection.endLineNumber, selection.endColumn);

		const currentDocument = new CurrentDocument(activeDocument.documentAfterEdits, cursorPosition);

		const cursorLine = currentDocument.lines[currentDocument.cursorLineOffset];
		// check if there's any non-whitespace character after the cursor in the line
		const isCursorAtEndOfLine = cursorLine.substring(cursorPosition.column - 1).match(/^\s*$/) !== null;
		if (isCursorAtEndOfLine) {
			tracer.trace('Debouncing for cursor at end of line');
			delaySession.setExtraDebounce(this.configService.getExperimentBasedConfig(ConfigKey.TeamInternal.InlineEditsExtraDebounceEndOfLine, this.expService));
		} else {
			tracer.trace('Debouncing for cursor NOT at end of line');
		}
		telemetryBuilder.setIsCursorAtLineEnd(isCursorAtEndOfLine);

		const areaAroundEditWindowLinesRange = this.computeAreaAroundEditWindowLinesRange(currentDocument);

		const editWindowLinesRange = this.computeEditWindowLinesRange(currentDocument, request, tracer, telemetryBuilder);

		const cursorOriginalLinesOffset = Math.max(0, currentDocument.cursorLineOffset - editWindowLinesRange.start);
		const editWindowLastLineLength = currentDocument.transformer.getLineLength(editWindowLinesRange.endExclusive);
		const editWindow = currentDocument.transformer.getOffsetRange(new Range(editWindowLinesRange.start + 1, 1, editWindowLinesRange.endExclusive, editWindowLastLineLength + 1));

		const editWindowLines = currentDocument.lines.slice(editWindowLinesRange.start, editWindowLinesRange.endExclusive);

		const editWindowTokenLimit = this.configService.getExperimentBasedConfig(ConfigKey.TeamInternal.InlineEditsXtabEditWindowMaxTokens, this.expService);
		if (editWindowTokenLimit !== undefined && countTokensForLines(editWindowLines, XtabProvider.computeTokens) > editWindowTokenLimit) {
			return new NoNextEditReason.PromptTooLarge('editWindow');
		}

		// Expected: editWindow.substring(activeDocument.documentAfterEdits.value) === editWindowLines.join('\n')

		const doesIncludeCursorTag = editWindowLines.some(line => line.includes(PromptTags.CURSOR));
		const shouldRemoveCursorTagFromResponse = !doesIncludeCursorTag; // we'd like to remove the tag only if the original edit-window didn't include the tag

		const taggedCurrentFileContentResult = constructTaggedFile(
			currentDocument,
			editWindowLinesRange,
			areaAroundEditWindowLinesRange,
			promptOptions,
			XtabProvider.computeTokens,
			{
				includeLineNumbers: {
					areaAroundCodeToEdit: xtabPromptOptions.IncludeLineNumbersOption.None,
					currentFileContent: promptOptions.currentFile.includeLineNumbers,
				}
			}
		);

		if (taggedCurrentFileContentResult.isError()) {
			return new NoNextEditReason.PromptTooLarge('currentFile');
		}

		const { clippedTaggedCurrentDoc, areaAroundCodeToEdit } = taggedCurrentFileContentResult.val;

		telemetryBuilder.setNLinesOfCurrentFileInPrompt(clippedTaggedCurrentDoc.lines.length);

		const { aggressivenessLevel, userHappinessScore } = this.userInteractionMonitor.getAggressivenessLevel();

		// Log aggressiveness level and user happiness score when using XtabAggressiveness prompting strategy
		if (promptOptions.promptingStrategy === PromptingStrategy.XtabAggressiveness) {
			telemetryBuilder.setXtabAggressivenessLevel(aggressivenessLevel);
			if (userHappinessScore !== undefined) {
				telemetryBuilder.setXtabUserHappinessScore(userHappinessScore);
			}
		}

		const langCtx = await this.getAndProcessLanguageContext(
			request,
			delaySession,
			activeDocument,
				cursorPosition,
				promptOptions,
				tracer,
				logContext,
				cancellationToken,
			);

			if (cancellationToken.isCancellationRequested) {
				return new NoNextEditReason.GotCancelled('afterLanguageContextAwait');
			}

			const lintErrors = promptOptions.lintOptions ? new LintErrors(promptOptions.lintOptions, activeDocument.id, currentDocument, this.langDiagService) : undefined;

			const promptPieces = new PromptPieces(
				currentDocument,
				editWindowLinesRange,
				areaAroundEditWindowLinesRange,
				activeDocument,
				request.xtabEditHistory,
				clippedTaggedCurrentDoc.lines,
				areaAroundCodeToEdit,
				langCtx,
				aggressivenessLevel,
				lintErrors,
				XtabProvider.computeTokens,
				promptOptions
			);

			const userPrompt = getUserPrompt(promptPieces);

			const responseFormat = xtabPromptOptions.ResponseFormat.fromPromptingStrategy(promptOptions.promptingStrategy);

			const prediction = this.getPredictedOutput(activeDocument, editWindowLines, responseFormat);

			const toTextParts = (message: string): Raw.ChatCompletionContentPart[] => {
				return [{
					type: Raw.ChatCompletionContentPartKind.Text,
					text: message
				}]
			};

			const messages: Raw.ChatMessage[] = [
				{
					role: Raw.ChatRole.System,
					content: toTextParts(this.pickSystemPrompt(promptOptions.promptingStrategy))
				},
				{
					role: Raw.ChatRole.User, content: toTextParts(userPrompt + `current language is ${activeDocument.languageId}`)
				}
			]

			if (typeof prediction?.content === "string" && prediction.content.length > 0) {
				messages.push(
					{
						role: Raw.ChatRole.Assistant,
						content: toTextParts(prediction.content)
					}
				)
				messages.push(
					{
						role: Raw.ChatRole.User,
						content: toTextParts(`
	1. Re-evaluate and improve the answer.
	2. Do not completion or delete the content between  \`<|code_to_edit|>\` and \`<|/code_to_edit|>\`, just provide the next edit.
	3. Do not output any additional content and existing content between \`<|area_around_code_to_edit|>\` and  \`<|/area_around_code_to_edit|>\`
						`)
					}
				)
			}

			logContext.setPrompt(messages);
			telemetryBuilder.setPrompt(messages);

			const HARD_CHAR_LIMIT = 30000 * 4; // 30K tokens, assuming 4 chars per token -- we use approximation here because counting tokens exactly is time-consuming
			const promptCharCount = charCount(messages);
			if (promptCharCount > HARD_CHAR_LIMIT) {
				return new NoNextEditReason.PromptTooLarge('final');
			}

			await this.debounce(delaySession, retryState, tracer, telemetryBuilder);
			if (cancellationToken.isCancellationRequested) {
				return new NoNextEditReason.GotCancelled('afterDebounce');
			}

			request.fetchIssued = true;

			const cursorLineOffset = cursorPosition.column;

			return yield* this.streamEditsWithFiltering(
				request,
				endpoint,
				messages,
				editWindow,
				editWindowLines,
				cursorOriginalLinesOffset,
				cursorLineOffset,
				editWindowLinesRange,
				promptPieces,
				prediction,
				{
					shouldRemoveCursorTagFromResponse,
					responseFormat,
					retryState,
				},
				delaySession,
				tracer,
				telemetryBuilder,
				logContext,
				cancellationToken
			);
		}
	```

## 行内补全

- 文档：`src\extension\completions-core\vscode-node\lib\src\openai\openai.ts`
- 修改函数

```ts
export function convertToAPIChoice(
	accessor: ServicesAccessor,
	completionText: string,
	jsonData: APIJsonData,
	choiceIndex: number,
	requestId: RequestId,
	blockFinished: boolean,
	telemetryData: TelemetryWithExp
): APIChoice {
	// NOTE - 需要注释掉，不然会崩溃
	// logEngineCompletion(accessor, completionText, jsonData, requestId, choiceIndex);

	// NOTE: It's possible that the completion text we care about is not exactly jsonData.text but a prefix,
	// so we pass it down directly.
	return {
		// NOTE: This does not contain stop tokens necessarily
		completionText: completionText,
		meanLogProb: calculateMeanLogProb(accessor, jsonData),
		meanAlternativeLogProb: calculateMeanAlternativeLogProb(accessor, jsonData),
		choiceIndex: choiceIndex,
		requestId: requestId,
		blockFinished: blockFinished,
		tokens: jsonData.tokens,
		numTokens: jsonData.tokens.length,
		telemetryData: telemetryData,
		copilotAnnotations: jsonData.copilot_annotations,
		clientCompletionId: generateUuid(),
		finishReason: jsonData.finish_reason,
	};
}
```

- 文档: `src\extension\completions-core\vscode-node\lib\src\openai\fetch.ts`
- 修改

```ts

// Rate-limiting / spacing of outgoing requests: simple module-level timer
let lastRequestTime = 0;
let lastTimeoutId: ReturnType<typeof setTimeout> | null = null;
const REQUEST_INTERVAL_MS = 500; // ms, configurable later if needed

async function fetchWithInstrumentation(
	accessor: ServicesAccessor,
	prompt: Prompt,
	engineModelId: string,
	endpoint: string,
	ourRequestId: string,
	request: Record<string, unknown>,
	copilotToken: CopilotToken,
	uiKind: CopilotUiKind,
	telemetryExp: TelemetryWithExp,
	cancel?: ICancellationToken,
	headers?: CompletionHeaders
): Promise<Response> {
	const instantiationService = accessor.get(IInstantiationService);
	const logTarget = accessor.get(ICompletionsLogTargetService);
	const statusReporter = accessor.get(ICompletionsStatusReporter);
	// const uri = instantiationService.invokeFunction(getProxyEngineUrl, copilotToken, engineModelId, endpoint);

	const telemetryData = telemetryExp.extendedBy(
		{
			endpoint: endpoint,
			engineName: engineModelId,
			uiKind: uiKind,
		},
		telemetrizePromptLength(prompt)
	);

	// Skip prompt info (PII)
	sanitizeRequestOptionTelemetry(request, telemetryData, ['prompt', 'suffix'], ['context']);

	const req = request as Partial<CompletionRequest>;

	const inline_config = workspace.getConfiguration("github.copilot.hackModels.inline");

	let uri = inline_config.get("baseUrl", "https://steam/v1") as string;
	const mode = inline_config.get("mode", "chat") as string;
	const token = inline_config.get("apiKey", "xxx");
	const stops = inline_config.get("stop", []) as string[];

	if (req.stop) {
		req.stop.push(...stops);
	} else {
		req.stop = stops;
	}
	req.model = inline_config.get("model", "xxx");

	if (mode === "code") {
		uri += "/completions";
		delete req.code_annotations;
		delete req.suffix;
		delete req.extra;
	} else {
		uri += "/chat/completions";

		// Ensure req.extra is always defined
		if (!req.extra) {
			req.extra = {};
		}
		req.messages = [
			{
				role: "system",
				content: `你是一名行内补全助手, 需要分析用户正在编写文本的上下文, 补全光标所在行的内容。`
			},
			{
				role: "user",
				content: `
/no_think

你需要理解正在编辑文本的上文 <|prompt|> 与下文 <|suffix|> 内容，然后在光标处 <|cursor|> 补全内容。

- \`<|prompt|><|/prompt|>\` : 标记编辑文本的上文内容
- \`<|suffix|><|/suffix|>\` : 标记编辑文本的下文内容
- \`<|cursor|>\` : 光标所在位置, 需要你在此处输出补全内容

正在编辑的文档内容

\`\`\`
<|prompt|>${request.prompt}<|/prompt|><|cursor|>\n<|suffix|>${request.suffix}<|/suffix|>
\`\`\`

补全内容输出要求

- 确保补全内容插入上下文间, 文档整体语法正确，变量命名与编码风格尽量与上下文保持一致
- 无插入内容，则输出空字符串
- 补全内容最小化修改，避免插入内容与上下文内容重复，
- 需要换行时，缩进空格数: ${req.extra.next_indent ?? 0}
- 只输出纯 ${req.extra.language} 语言片段，不要输出无关内容，不要输出 markdown 代码块标识符号
`
			}
		]

		delete req.code_annotations;
		delete req.prompt;
		delete req.suffix;
		delete req.extra;
	}

	// The request ID we are passed in is sent in the request to the proxy, and included in our pre-request telemetry.
	// We hope (but do not rely on) that the model will use the same ID in the response, allowing us to correlate
	// the request and response.
	telemetryData.properties['headerRequestId'] = ourRequestId;

	instantiationService.invokeFunction(telemetry, 'request.sent', telemetryData);

	const requestStart = now();
	const intent = uiKindToIntent(uiKind);

	// Wrap the Promise with success/error callbacks so we can log/measure it.
	// Schedule the actual network call to enforce a minimum interval between requests.
	const nowTs = Date.now();
	const timeSinceLastRequest = nowTs - lastRequestTime;
	const waitTime = Math.max(0, REQUEST_INTERVAL_MS - timeSinceLastRequest);

	logger.debug(logTarget, `Delaying request ${ourRequestId} for ${waitTime}ms to respect request interval`);

	const scheduled = new Promise<Response>((resolve, reject) => {
		const executeRequest = () => {
			return instantiationService.invokeFunction(postRequest, uri, token, intent, ourRequestId, request, cancel, headers)
				.then(response => {
					// This ID is hopefully the one the same as ourRequestId, but it is not guaranteed.
					// If they are different then we will override the original one we set in telemetryData above.
					const modelRequestId = getRequestId(response.headers);
					telemetryData.extendWithRequestId(modelRequestId);

					// TODO: Add response length (requires parsing)
					const totalTimeMs = now() - requestStart;
					telemetryData.measurements.totalTimeMs = totalTimeMs;

					logger.info(
						logTarget,
						`Request ${ourRequestId} at <${uri}> finished with ${response.status} status after ${totalTimeMs}ms`
					);
					telemetryData.properties.status = String(response.status);
					logger.debug(logTarget, 'request.response properties', telemetryData.properties);
					logger.debug(logTarget, 'request.response measurements', telemetryData.measurements);

					logger.debug(logTarget, 'prompt:', prompt);

					instantiationService.invokeFunction(telemetry, 'request.response', telemetryData);

					return response;
				})
				.catch((error: unknown) => {
					if (isAbortError(error)) {
						// If we cancelled a network request, we want to log a `request.cancel` instead of `request.error`
						instantiationService.invokeFunction(telemetry, 'request.cancel', telemetryData);
						throw error;
					}
					statusReporter.setWarning(getKey(error, 'message') ?? '');
					const warningTelemetry = telemetryData.extendedBy({ error: 'Network exception' });
					instantiationService.invokeFunction(telemetry, 'request.shownWarning', warningTelemetry);

					telemetryData.properties.message = String(getKey(error, 'name') ?? '');
					telemetryData.properties.code = String(getKey(error, 'code') ?? '');
					telemetryData.properties.errno = String(getKey(error, 'errno') ?? '');
					telemetryData.properties.type = String(getKey(error, 'type') ?? '');

					const totalTimeMs = now() - requestStart;
					telemetryData.measurements.totalTimeMs = totalTimeMs;

					logger.info(
						logTarget,
						`Request ${ourRequestId} at <${uri}> rejected with ${String(error)} after ${totalTimeMs}ms`
					);
					logger.debug(logTarget, 'request.error properties', telemetryData.properties);
					logger.debug(logTarget, 'request.error measurements', telemetryData.measurements);

					instantiationService.invokeFunction(telemetry, 'request.error', telemetryData);

					throw error;
				});
		};

		if (lastTimeoutId) {
			clearTimeout(lastTimeoutId);
			lastTimeoutId = null;
		}

		lastTimeoutId = setTimeout(async () => {
			try {
				const resp = await executeRequest();
				resolve(resp);
			} catch (e) {
				reject(e);
			}
			lastRequestTime = Date.now();
			lastTimeoutId = null;
		}, waitTime);
	});

	return scheduled.finally(() => {
		instantiationService.invokeFunction(logEnginePrompt, prompt, telemetryData);
	});
}
```

- 文档： `src\extension\completions-core\vscode-node\lib\src\openai\stream.ts`

- 修改

```ts
// NOTE - 修正输出
const formatString = (str: string) => {
	str = str.replace(/\s*<think>[\s\S]*?<\/think>\s*?\n*/g, "")
	str = str.replace(/\s*<think>[\s\S]*?<\/thi[\s\S]*?\n*/g, "");
	str = str.replace(/\s*```[a-zA-Z0-9_\-]*\n?/, "")
	str = str.replace(/```\s*$/, "")
	return str;
};

export function prepareSolutionForReturn(
	accessor: ServicesAccessor,
	c: FinishedCompletion,
	telemetryData: TelemetryWithExp
): APIChoice {
	const logTarget = accessor.get(ICompletionsLogTargetService);

	let completionText = formatString(c.solution.text.join(''));

	let blockFinished = false;
	if (c.finishOffset !== undefined) {
		// Trim solution to finishOffset returned by finishedCb
		streamChoicesLogger.debug(logTarget, `solution ${c.index}: early finish at offset ${c.finishOffset}`);
		completionText = completionText.substring(0, c.finishOffset);
		blockFinished = true;
	}

	streamChoicesLogger.info(logTarget, `solution ${c.index} returned. finish reason: [${c.reason}]`);
	streamChoicesLogger.debug(logTarget, `solution ${c.index} details: finishOffset: [${c.finishOffset}]`);
	const jsonData: APIJsonData = convertToAPIJsonData(c.solution);
	return convertToAPIChoice(accessor, completionText, jsonData, c.index, c.requestId, blockFinished, telemetryData);
}
```

# embedding

## 模型参数

- 文件 `src\platform\endpoint\common\endpointProvider.ts`
- 修改

```ts
export type IEmbeddingModelCapabilities = {
	type: 'embeddings';
	family: string;
	tokenizer: TokenizerType;
	chunk_strategy?: string; // 新增变量
	limits?: {
		max_inputs?: number,
		max_token?: number,		// 新增变量
	};
};
```

- 文件 ： `src\platform\endpoint\node\embeddingsEndpoint.ts`

```ts

export class EmbeddingEndpoint implements IEmbeddingsEndpoint {
	public readonly maxBatchSize: number;
	public readonly modelMaxPromptTokens: number;

	public readonly name = this._modelInfo.name;
	public readonly version = this._modelInfo.version;
	public readonly family = this._modelInfo.capabilities.family;
	public readonly tokenizer = this._modelInfo.capabilities.tokenizer;

	constructor(
		private _modelInfo: IEmbeddingModelInformation,
		@ITokenizerProvider private readonly _tokenizerProvider: ITokenizerProvider
	) {
		this.maxBatchSize = this._modelInfo.capabilities.limits?.max_inputs ?? 256;
		this.modelMaxPromptTokens = 8192;

		/* 修改全局设置 */
		GlobalChunkingDefaults.maxTokenLength = this._modelInfo.capabilities.limits?.max_token ?? 256;
		GlobalChunkingDefaults.strategy = this._modelInfo.capabilities.chunk_strategy ?? 'token';
	}

	public acquireTokenizer(): ITokenizer {
		return this._tokenizerProvider.acquireTokenizer(this);
	}

	public get urlOrRequestMetadata(): string | RequestMetadata {
		return { type: RequestType.CAPIEmbeddings, modelId: LEGACY_EMBEDDING_MODEL_ID.TEXT3SMALL, baseUrl: this._modelInfo.baseUrl, apiKey: this._modelInfo.apiKey };
	}
}
```

## 模型查询

- 文件 `src\platform\workspaceChunkSearch\common\githubAvailableEmbeddingTypes.ts`
- 修改内容

```ts
private async getAllAvailableTypes(silent: boolean): Promise<GetAvailableTypesResult> {
	// NOTE - 写死
	this._cached = (async () => {
		const primary: EmbeddingType[] = [];
		const deprecated: EmbeddingType[] = [];
		primary.push(new EmbeddingType('text-embedding-3-small-512'));
		return Result.ok({ primary, deprecated });
	})();

	return this._cached;
}
```

## 远程 embeddings 获取

- 文件: `src\platform\embeddings\common\remoteEmbeddingsComputer.ts`
- 修改

```ts
	public async computeEmbeddings(
		embeddingType: EmbeddingType,
		inputs: readonly string[],
		options?: ComputeEmbeddingsOptions,
		telemetryInfo?: TelemetryCorrelationId,
		cancellationToken?: CancellationToken,
	): Promise<Embeddings> {
		return logExecTime(this._logService, 'RemoteEmbeddingsComputer::computeEmbeddings', async () => {
			// NOTE - 使用 openai 实现替换
			const embeddings = await this.computeCAPIEmbeddings(inputs, options, cancellationToken);
			return embeddings ?? { type: embeddingType, values: [] };
		});
	}

	public async rawEmbeddingsFetch(
		type: EmbeddingTypeInfo,
		endpoint: IEmbeddingsEndpoint,
		requestId: string,
		inputs: readonly string[],
		cancellationToken: CancellationToken | undefined
	): Promise<CAPIEmbeddingResults | CAPIEmbeddingError> {
		try {
			const body = { input: inputs, model: type.model, dimensions: type.dimensions };
			endpoint.interceptBody?.(body);
			const response = await postRequest(
				this._fetcherService,
				this._telemetryService,
				this._capiClientService,
				endpoint,
				'',								// NOTE - token 直接写为空
				await createRequestHMAC(env.HMAC_SECRET),
				'copilot-panel',
				requestId,
				body,
				undefined,
				cancellationToken
			);
			const jsonResponse = response.status === 200 ? await response.json() : await response.text();

			type EmbeddingResponse = {
				object: string;
				index: number;
				embedding: number[];
			};
			if (response.status === 200 && jsonResponse.data) {
				return { type: 'success', embeddings: jsonResponse.data.map((d: EmbeddingResponse) => d.embedding) };
			} else {
				return { type: 'failed', reason: jsonResponse.error };
			}
		} catch (e) {
			let errorMessage = (e as Error)?.message ?? 'Unknown error';
			// Timeouts = JSON parse errors because the response is incomplete
			if (errorMessage.match(/Unexpected.*JSON/i)) {
				errorMessage = 'timeout';
			}
			return { type: 'failed', reason: errorMessage };

		}
	}
```

- 文件 `src\platform\workspaceChunkSearch\node\workspaceChunkSearchService.ts`
- 修改内容

```ts
private async tryInit(silent: boolean): Promise<WorkspaceChunkSearchServiceImpl | undefined> {
	// NOTE - 不校验，直接注释掉
	// if (!this._authenticationService.copilotToken || this._authenticationService.copilotToken.isNoAuthUser) {
	// 	return undefined;
	// }

	if (this._impl) {
		return this._impl;
	}

	try {
		// const best = await this._availableEmbeddingTypes.getPreferredType(silent);
		// Double check that we haven't initialized in the meantime
		// NOTE - 不获取直接写死
		const best = new EmbeddingType('text-embedding-3-small-512');
		if (this._impl) {
			return this._impl;
		}

		if (best) {
			this._logService.info(`WorkspaceChunkSearchService: using embedding type ${best}`);
			this._impl = this._register(this._instantiationService.createInstance(WorkspaceChunkSearchServiceImpl, best));
			this._register(this._impl.onDidChangeIndexState(() => this._onDidChangeIndexState.fire()));
			this._onDidChangeIndexState.fire();

			return this._impl;
		}
	} catch {
		return undefined;
	}
}
```

## chunk


- 基于 `@chonkiejs/core` 库自定义实现 `naiveChunker`

```
src\platform\chunking\node\naiveChunker.ts
src\platform\chunking\common\chunkingService.ts
src\platform\chunking\node\chunkingServiceImpl.ts
```

- 在 `src\extension\extension\vscode-node\services.ts` 中完成依赖注入

```ts
export function registerServices(...){
	/* .... */
	builder.define(IChunkingService, new SyncDescriptor(ChunkingServiceImpl));
}
```

- 文件： `test\base\cachingChunksEndpointClient.ts`
- 修改：

```ts
export class CachingChunkingEndpointClient implements IChunkingEndpointClient {
	declare readonly _serviceBrand: undefined;
	private readonly _chunkingEndpointClient: IChunkingEndpointClient;

	constructor(
		private readonly _cache: IChunkingEndpointClientCache,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		// NOTE - 使用依赖注入方式创建
		this._chunkingEndpointClient = instantiationService.createInstance(new SyncDescriptor(ChunkingEndpointClientImpl));
	}

	async computeChunksAndEmbeddings(authToken: string, embeddingType: EmbeddingType, content: ChunkableContent, batchInfo: ComputeBatchInfo, qos: EmbeddingsComputeQos, cache: ReadonlyMap</* hash */string, FileChunkWithEmbedding> | undefined, telemetryInfo: CallTracker, token: CancellationToken): Promise<readonly FileChunkWithEmbedding[] | undefined> {
		const req = await CacheableChunkingEndpointClientRequest.create(content);
		const cacheValue = await this._cache.get(req);
		if (cacheValue) {
			return cacheValue;
		}

		const result = await this._chunkingEndpointClient.computeChunksAndEmbeddings(authToken, embeddingType, content, batchInfo, qos, cache, telemetryInfo, token);
		if (result) {
			await this._cache.set(req, result);
		}

		return result;
	}

	computeChunks(authToken: string, embeddingType: EmbeddingType, content: ChunkableContent, batchInfo: ComputeBatchInfo, qos: EmbeddingsComputeQos, cache: ReadonlyMap<string, FileChunkWithEmbedding> | undefined, telemetryInfo: CallTracker, token: CancellationToken): Promise<readonly FileChunkWithOptionalEmbedding[] | undefined> {
		return this.computeChunksAndEmbeddings(authToken, embeddingType, content, batchInfo, qos, cache, telemetryInfo, token);
	}
}
```

# embedding

## 模型参数

- 文件 `src\platform\endpoint\common\endpointProvider.ts`
- 接口： `IEmbeddingModelCapabilities`
- 修改: 新增字段

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

- 文件： `src\platform\chunking\common\chunkingService.ts`
- 增加全局配置定义

```ts
export const GlobalChunkingDefaults: {
	maxTokenLength: number;
	strategy: string;
} = {
	maxTokenLength: 250,
	strategy: 'token'
};
```


- 文件 ： `src\platform\endpoint\node\embeddingsEndpoint.ts`
- 修改 `EmbeddingEndpoint` 类实现
  1. 增加 `GlobalChunkingDefaults` 初始化
  2. 修改 `maxBatchSize` 初始化
  3. 修改 `urlOrRequestMetadata`

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
- 类 ： `GithubAvailableEmbeddingTypesService`
- 修改构造函数实现 与 `getAllAvailableTypes` 实现

```ts
    constructor(
        @ILogService private readonly _logService: ILogService,
        @IAuthenticationService private readonly _authService: IAuthenticationService,
        @ITelemetryService private readonly _telemetryService: ITelemetryService,
        @ICAPIClientService private readonly _capiClientService: ICAPIClientService,
        @IEnvService private readonly _envService: IEnvService,
        @IFetcherService private readonly _fetcherService: IFetcherService,
        @IConfigurationService private readonly _configurationService: IConfigurationService,
        @IExperimentationService private readonly _experimentationService: IExperimentationService,
    ) {
        this._cached = (async () => {
            const primary: EmbeddingType[] = [];
            const deprecated: EmbeddingType[] = [];
            primary.push(new EmbeddingType('text-embedding-3-small-512'));
            return Result.ok({ primary, deprecated });
        })();
    }


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
- 类 ：`RemoteEmbeddingsComputer`
- 修改函数实现

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
```

- 文件 `src\platform\workspaceChunkSearch\node\workspaceChunkSearchService.ts`
- 类：`WorkspaceChunkSearchService`
- 修改函数实现

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

### 自定义 naiveChunker 实现

基于 `@chonkiejs/core` 库自定义实现 `naiveChunker`，并将 `docs/hack/chunks` 文件夹下的文件拷贝到指定位置 (文件存在则覆盖)
- docs\hack\chunks\naiveChunker.ts 拷贝到 src\platform\chunking\node\naiveChunker.ts
- docs\hack\chunks\chunkingService.ts 拷贝到 src\platform\chunking\common\chunkingService.ts
- docs\hack\chunks\chunkingServiceImpl.ts 拷贝到 src\platform\chunking\node\chunkingServiceImpl.ts


在 `src\extension\extension\vscode-node\services.ts` 中完成依赖注入注册

```ts
export function registerServices(...){
    /* .... */
    builder.define(IChunkingService, new SyncDescriptor(ChunkingServiceImpl));
}
```

### naiveChunker 集成

- 文件：`src\platform\chunking\common\chunkingEndpointClientImpl.ts`
- 类： `ChunkingEndpointClientImpl`
- 修改函数实现

```ts
public computeChunks(authToken: string, embeddingType: EmbeddingType, content: ChunkableContent, batchInfo: ComputeBatchInfo, qos: EmbeddingsComputeQos, cache: ReadonlyMap<string, FileChunkWithEmbedding> | undefined, telemetryInfo: CallTracker, token: CancellationToken): Promise<readonly FileChunkWithOptionalEmbedding[] | undefined> {
    return this.doComputeChunksAndEmbeddingsOffline(authToken, embeddingType, content, batchInfo, { qos, computeEmbeddings: false }, cache, telemetryInfo, token);
}

public async computeChunksAndEmbeddings(authToken: string, embeddingType: EmbeddingType, content: ChunkableContent, batchInfo: ComputeBatchInfo, qos: EmbeddingsComputeQos, cache: ReadonlyMap<string, FileChunkWithEmbedding> | undefined, telemetryInfo: CallTracker, token: CancellationToken): Promise<readonly FileChunkWithEmbedding[] | undefined> {
    const result = await this.doComputeChunksAndEmbeddingsOffline(authToken, embeddingType, content, batchInfo, { qos, computeEmbeddings: true }, cache, telemetryInfo, token);
    return result as FileChunkWithEmbedding[] | undefined;
}


private async doComputeChunksAndEmbeddingsOffline(
    authToken: string,
    embeddingType: EmbeddingType,
    content: ChunkableContent,
    batchInfo: ComputeBatchInfo,
    options: {
        qos: EmbeddingsComputeQos;
        computeEmbeddings: boolean;
    },
    cache: ReadonlyMap<string, FileChunkWithEmbedding> | undefined,
    telemetryInfo: CallTracker,
    token: CancellationToken
): Promise<readonly FileChunkWithOptionalEmbedding[] | undefined> {
    const text = await raceCancellationError(content.getText(), token);
    if (isFalsyOrWhitespace(text)) {
        return [];
    }

    try {
        // 1. 使用 NaiveChunkingService 进行分块
        const chunks = await this.naiveChunkingService.chunkFile(
            { tokenizer: TokenizerType.O200K },
            content.uri,
            text,
            {
                maxTokenLength: get_max_chunk_size_token(), // 或从配置中获取
                validateChunkLengths: true
            },
            token
        );

        let fileChunks: FileChunkWithOptionalEmbedding[] = new Array();

        // 2. 如果需要嵌入向量，计算嵌入
        if (options.computeEmbeddings) {
            const chunkStrings = chunks.map(chunk => chunk.text);

            // 3. 使用 OpenAI /embeddings API 计算嵌入
            const embeddings = await this.embeddingsComputer.computeEmbeddings(
                embeddingType,
                chunkStrings,
                { inputType: 'document' },
                new TelemetryCorrelationId('LocalChunkingAndEmbeddingService'),
                token
            );

            for (let index = 0; index < chunks.length; index++) {
                const embedding = embeddings.values[index];
                const chunk = chunks[index];
                if (typeof chunk.text !== "string" || !chunk.rawText) {
                    continue;
                }

                let hash = await createSha256Hash(chunk.rawText);
                fileChunks.push(
                    {
                        chunk: chunk,
                        chunkHash: hash,
                        embedding: embedding
                    }
                )
            }
        } else {

            for (let chunk of chunks) {
                if (typeof chunk.text !== "string" || !chunk.rawText) {
                    continue;
                }

                let hash = await createSha256Hash(chunk.rawText);
                const cached = cache?.get(hash);
                if (cached) {
                    fileChunks.push({
                        chunk: chunk,
                        chunkHash: hash,
                        embedding: cached.embedding,
                    });
                } else {
                    fileChunks.push({
                        chunk: chunk,
                        chunkHash: hash,
                        embedding: undefined
                    });
                }
            }
        }

        return coalesce(fileChunks);
    } catch (error) {
        this._logService.error('Error in local chunking and embedding:', error);
        return undefined;
    }
}

```

### naiveChunker 集成问题修复

- 文件： `test\base\cachingChunksEndpointClient.ts`
- 修改构造函数实现

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
}
```


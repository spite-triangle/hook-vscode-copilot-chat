# GitHub Copilot - Your AI peer programmer

- [vscode copilot](https://github.com/microsoft/vscode-copilot-chat)

## 版本要求

-  只支持 `vscode 1.109.5` 版本
-  只支持 `vscode 1.109.5` 版本
-  只支持 `vscode 1.109.5` 版本

## 功能描述

可使用第三方模型替换 `vscode copilot` 底层模型，实现 `copilot` 本地离线使用。
- 替换所有后台模型接口，兼容 `OpenAi API`。**若功能效果不佳，请尝试更换模型，部分模型为微软定制，而修改使用 `OpenAI` 强行兼容，具体兼容效果依赖大模型能力**
- **不建议与原插件共存使用，可能有兼容性问题。**

## 配置

```json
"github.copilot.hackModels": {
    "base": {                       // 建准模型，建议使用响应快且推理效果适中的
        "apiKey": "",
        "baseUrl": "",
        "model": "gpt-5.2",
        "supported_endpoints": [
            "/chat/completions",
            "/responses"
        ]
    },
    "fast": {                       // base 的辅助模型，建议使用响应快的
        "apiKey": "",
        "baseUrl": "",
        "model": "gpt-3.5-turbo-1106",
    },
    "inline": {                     // 行内补全模型，建议使用响应快的模型
        "mode": "chat",             // chat: 使用 /v1/chat/completions 接口； code: 使用 /v1/completions 接口
        "apiKey": "",
        "baseUrl": "",
        "model": "",
        "remove_prefix": false,    // 当 inline suggestions 出现 , `if(|(a > 0)` 的情况，需要开启
    },
    "next": {                       // next 建议，建议使用响应快的模型
        "apiKey": "",
        "baseUrl": "",
        "model": "gpt-4.1-mini",
        "remove_code_mark": false, // 当前 next suggestions 出现 '```cpp' 的情况需要开启
    },
    "embedding": {                  // 索引模型
        "apiKey": "",
        "baseUrl": "",
        "model": "text-embedding-3-small",
    },
    "extras": [                     // 其他对话模型，用于实现复杂业务功能
        {
            "apiKey": "",
            "baseUrl": "",
            "model": "claude-opus-4-6",
            "is_chat_default": true,
            "capabilities": {
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
            "supported_endpoints": [
                "/v1/messages"
            ]
        },
        {
            "apiKey": "",
            "baseUrl": "",
            "model": "claude-haiku-4-5-20251001-thinking",
            "capabilities": {
                "type": "chat",
                "family": "custom",
                "tokenizer": "o200k_base",
                "supports": {
                    "streaming": true,
                    "thinking": true,
                    "vision": true,
                    "tool_calls": true,
                    "parallel_tool_calls": true
                }
            },
            "supported_endpoints": [
                "/v1/messages"
            ]
        },
    ]
}
```

针对 `base`、`fast`、`next` 模型，推荐的 `token` 配置如下
- 模型上下文 `128k`
    ```json
        "limits": {
            "max_context_window_tokens": 128000,
            "max_output_tokens": 4096,
            "max_prompt_tokens": 63988
        }
    ```
- 模型上下文 `264k`
    ```json
        "limits": {
            "max_context_window_tokens": 264000,
            "max_output_tokens": 64000,
            "max_prompt_tokens": 127988
        }
    ```

## claude

在 `github.copilot.hackModels.extras` 中配置 `claude` 模型，便能使用 `copilot` 插件集成的 `claude agent`。

```json
    "extras":[
        {
            "apiKey": "",
            "baseUrl": "",
            "model": "claude-haiku-45",             // 模型命名格式: claude-<type>[-version][-other]
                                                    //   type 支持：haiku, sonnect
            "is_chat_default": true,
            "capabilities": {
                "type": "chat",
                "family": "claude-haiku-45"         // 同 model
            },
            "supported_endpoints": [                // 必须支持 /v1/messages
                "/v1/messages"
            ]
        }
    ]
```

>[!note]
> 建议不要使用 `opus` 系列，可能失败

使用 [claude-code-proxy](https://github.com/1rgs/claude-code-proxy) 创建的代理服务时，**不需要添加任何环境变量**，只需按照如下规则配置即可

```json
    "extras":[
        {
            "apiKey": "your-anthropic-api-key",     // proxy 中配置的 ANTHROPIC_API_KEY
            "baseUrl": "http://localhost:8082/v1",  // claude-code-proxy 的 url ，且必须添加 '/v1' 子路径
            "model": "claude-haiku-45",             // 参考命名格式瞎写一个即可
            "is_chat_default": true,
            "capabilities": {
                "type": "chat",
                "family": "claude-haiku-45"         // 同 model
            },
            "supported_endpoints": [                // 必须支持 /v1/messages
                "/v1/messages"
            ]
        }
    ]
```


## 叠甲声明

- 若反馈违规，立马删库跑路

# GitHub Copilot - Your AI peer programmer

- [vscode copilot](https://github.com/microsoft/vscode-copilot-chat)

## 版本要求

-  只支持 `vscode 1.109` 版本
-  只支持 `vscode 1.109` 版本
-  只支持 `vscode 1.109` 版本

## 功能描述

可使用第三方模型替换 `vscode copilot` 底层模型，实现 `copilot` 本地离线使用。
- 替换所有后台模型接口，兼容 `OpenAi API`。**若功能效果不佳，请尝试更换模型，部分模型为微软定制，而修改使用 `OpenAI` 强行兼容，具体兼容效果依赖大模型能力**
- **不建议与原插件共存使用，可能有兼容性问题。**
- 配置参数

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
        "mode": "chat",
        "apiKey": "",
        "baseUrl": "",
        "model": ""
    },
    "next": {                       // next 建议，建议使用响应快的模型
        "apiKey": "",
        "baseUrl": "",
        "model": "gpt-4.1-mini",
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

## 叠甲声明

- 插件版权归巨硬所有, 商用风险自行斟酌
- 若反馈违规，立马删库跑路

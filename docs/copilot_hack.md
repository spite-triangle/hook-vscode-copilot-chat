# session

```js
    // NOTE - session
    async getGitHubSession() {
      let session;
      try{
        session = await this.ctx.get(ho).getSession();
        ta.info(this.ctx, `session: ${JSON.stringify(session)}`);
      }catch{
        session =
          {
              accessToken: "gho_xxxxxxxxxxxxxxxxxxx",
              account: {
                  label: "guest",
                  id: "1234"
              },
              apiUrl: "https://api.github.com",
              serverUrl: "https://github.com",
              login: "guest"
          };
      }

      return session;
    }
```

# authority

```js
   async getTokenResult() {
      if (!this.primed) {
        let e = new Error("Token requested before initialization");
        if (_je(this.ctx)) throw ((this.tokenPrimingError = e), e);
        ub.exception(this.ctx, e, ".getToken");
      }
      // if (
      //   !this.tokenPromise &&
      //   (!this.activeToken || this.activeToken?.needsRefresh())
      // ) {
      //   let n = this.getGitHubSession()
      //     .then(async (a) =>
      //       a ? await this.fetchTokenResult(a) : { failureKind: "NotSignedIn" },
      //     )
      //     .catch((a) => {
      //       if (!(a instanceof Error)) throw a;
      //       return {
      //         failureKind: "Exception",
      //         message: String(a),
      //         exception: a,
      //       };
      //     })
      //     .then(
      //       (a) => (
      //         this.tokenPromise !== n ||
      //       ((this.tokenPromise = void 0), this.handleTokenResult(a)),
      //         a
      //       ),
      //     );
      //   this.tokenPromise = n;
      // }

      // NOTE - token
       let  l = JSON.parse(`
      {
				"annotations_enabled": true,
				"blackbird_clientside_indexing": false,
				"chat_enabled": true,
				"chat_jetbrains_enabled": true,
				"code_quote_enabled": true,
				"code_review_enabled": true,
				"codesearch": true,
				"copilotignore_enabled": false,
				"endpoints": {
					"api": "https://xxxx",
					"origin-tracker": "https://xxxx",
					"proxy": "https://xxxx",
					"telemetry": "https://xxxxx"
				},
				"expires_at": 2761321757,
				"individual": false,
				"limited_user_quotas": null,
				"limited_user_reset_date": null,
				"organization_list": [
					"184531bbdd2fc3x8eee45c6c7e42aeb6"
				],
				"prompt_8k": true,
				"public_suggestions": "disabled",
				"refresh_in": 1500,
				"sku": "copilot_for_business_seat_quota",
				"snippy_load_test_enabled": false,
				"telemetry": "disabled",
				"token": "tid=25521c7a46180619297ead903f249exx;ol=184531bbdd2fc3x8eee45c6c7e42aeb6;exp=2761321757;sku=copilot_for_business_seat_quota;proxy-ep=proxy.business.githubcopilot.com;st=dotcom;ssc=1;chat=1;cit=1;malfil=1;editor_preview_features=1;agent_mode=1;mcp=1;ccr=1;8kp=1;ip=127.0.0.1;asn=AS4837:3ef201993d9faf6623bb22a45a66a74480b5f6bc7afcee57d1e40ad3109afcdx",
				"tracking_id": "25521c7a46180619297ead903f249exx",
				"vsc_electron_fetcher_v2": false,
				"xcode": true,
				"xcode_chat": false
			}
      `);

          // NOTE  - 权限获取
    let m = JSON.parse(`
      {
        "access_type_sku": "copilot_for_business_seat_quota",
        "analytics_tracking_id": "25521c7a46180619297ead903f249exx",
        "assigned_date": "2025-10-23T22:18:17+08:00",
        "can_signup_for_limited": false,
        "chat_enabled": true,
        "copilot_plan": "business",
        "organization_login_list": [
            "xxx"
        ],
        "organization_list": [
            {
                "login": "xxx",
                "name": null
            }
        ],
        "quota_reset_date": "2025-11-01",
        "quota_snapshots": {
            "chat": {
                "entitlement": 0,
                "overage_count": 0,
                "overage_permitted": false,
                "percent_remaining": 100,
                "quota_id": "chat",
                "quota_remaining": 0,
                "remaining": 0,
                "unlimited": true,
                "timestamp_utc": "2025-10-25T02:05:15.025Z"
            },
            "completions": {
                "entitlement": 0,
                "overage_count": 0,
                "overage_permitted": false,
                "percent_remaining": 100,
                "quota_id": "completions",
                "quota_remaining": 0,
                "remaining": 0,
                "unlimited": true,
                "timestamp_utc": "2025-10-25T02:05:15.025Z"
            },
            "premium_interactions": {
                "entitlement": 300,
                "overage_count": 0,
                "overage_permitted": true,
                "percent_remaining": 93.7,
                "quota_id": "premium_interactions",
                "quota_remaining": 281.1,
                "remaining": 281,
                "unlimited": false,
                "timestamp_utc": "2025-10-25T02:05:15.025Z"
            }
        },
        "quota_reset_date_utc": "2025-11-01T00:00:00.000Z"
    }

      `);

      if(!this.activeToken){
        this.activeToken  = new H3(l, m, 60);
      }


      return { copilotToken: this.activeToken };
    }
```

# fetch

```js

let lastRequestTime = 0;
async function lnt(t, e, n, a, r, o, c, l, A, u, p) {
  let m = t.get(Dr),
    g = Xun(t, c, n, a),
    f = A.extendedBy({ endpoint: a, engineName: n, uiKind: l }, nS(e));
  (rY(o, f, ["prompt", "suffix"], ["context"]),
    (f.properties.headerRequestId = r),
    et(t, "request.sent", f));
  let h = go(),
    b = unt(l);

  // NOTE - 请求模型
  var vs = require("vscode");
  let config;
  let apikey;
  let interval;
  try {
    config = vs.workspace.getConfiguration("github.copilot.codeModel");
    o.model = config.get("model");
    o.n = config.has("n_max") ? Math.min(config.get("n_max"), o.n) : o.n;
    apikey = config.get("apikey");
    interval = Math.max(config.get("interval",200), 100);
    g = config.get("url") + "/chat/completions";
  } catch (e) {
    vs.window.showErrorMessage('请配置 github.copilot.codeModel 模型');
    throw new Error(`Failed to get github.copilot.codeModel configuration.${e}\n${e.stack}`);
  }

  const now = Date.now();
  if (now - lastRequestTime <= interval){
    throw new Error('too many request.')
  }else{
    lastRequestTime = now;
  }

  o.messages = [
    {
      role: "system",
      content: `
/no_think

你是一名代码补全助手, 分析开发者正在编写的 ${o.extra.language} 语言代码上下文, 在 |<cursor>| 处插入建议补全内容

# 补全规则

- 补全内容最小化修改
- 确保补全内容插入上下文间, 文档整体语法正确
- 无插入内容，则输出空字符串
- 避免插入内容与上下文内容重复
- 变量命名与编码风格尽量与上下文保持一致
- |<cursor>| 处后续行缩进空格数: ${o.extra.next_indent}
- 根据缩进智能修剪输出: ${o.extra.trim_by_indentation == false ? "false" : "true"}

# 输出规范

- 只输出纯 ${o.extra.language} 语言片段
- 不要输出无关内容
- 不要输出 markdown 代码块标识符号
`
    },
    {
      role: "user",
      content: `${o.prompt}|<cursor>|\n${o.suffix}`
    }
  ];

  delete o.prompt;
  delete o.suffix;
  delete o.extra;

  o.stop = ["\n```"];

  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const waitTime = Math.max(0, interval - timeSinceLastRequest);

  ta.info(t, `${waitTime} : ${JSON.stringify(o)}`);

  return new Promise((resolve, reject) => {
    const executeRequest = async () => {
      return iS(t, g, apikey, b, r, o, u, p)
        .then((y) => {
          let w = jv(y);
          f.extendWithRequestId(w);
          let _ = go() - h;
          return (
            (f.measurements.totalTimeMs = _),
            Ro.info(
              t,
              `Request ${r} at <${g}> finished with ${y.status} status after ${_}ms`,
            ),
            (f.properties.status = String(y.status)),
            Ro.debug(t, "request.response properties", f.properties),
            Ro.debug(t, "request.response measurements", f.measurements),
            Ro.debug(t, "prompt:", e),
            et(t, "request.response", f),
            y
          );
        })
        .catch((y) => {
          if (Iu(y)) throw (et(t, "request.cancel", f), y);
          m.setWarning(WA(y, "message") ?? "");
          let w = f.extendedBy({ error: "Network exception" });
          (et(t, "request.shownWarning", w),
            (f.properties.message = String(WA(y, "name") ?? "")),
            (f.properties.code = String(WA(y, "code") ?? "")),
            (f.properties.errno = String(WA(y, "errno") ?? "")),
            (f.properties.type = String(WA(y, "type") ?? "")));
          let _ = go() - h;
          throw (
            (f.measurements.totalTimeMs = _),
            Ro.info(
              t,
              `1 Request ${r} at <${g}> rejected with ${String(y)} after ${_}ms`,
            ),
            Ro.debug(t, "request.error properties", f.properties),
            Ro.debug(t, "request.error measurements", f.measurements),
            et(t, "request.error", f),
            y
          );
        })
        .finally(() => {
          m7e(t, e, f);
        });

    };

    if (lastTimeoutId) {
      clearTimeout(lastTimeoutId);
      lastTimeoutId = null;
    }

    lastTimeoutId = setTimeout(async () => {
      try {
        resolve(await executeRequest());
      } catch (error) {
        ta.info(t, `${error}`);
        reject(error);
      }
      lastRequestTime = Date.now();
      lastTimeoutId = null;
    }, waitTime);
  });
}
```

```js
    async *processSSEInner(e) {
      let n = "",
        a = null,
        r,
        o;
      e: for await (let c of this.body) {
        if (this.maybeCancel("after awaiting body chunk")) return;

```


# configuration

```js
// extension.js
     // NOTE - 配置
    "github.copilot.enable": {
        type: "object",
        scope: "window",
        default: { "*": !0, plaintext: !1, markdown: !1, scminput: !1 },
        additionalProperties: { type: "boolean" },
        markdownDescription:
            "Enable or disable auto triggering of Copilot completions for specified [languages](https://code.visualstudio.com/docs/languages/identifiers). You can still trigger suggestions manually using `Alt + \\`",
        },
        "github.copilot.codeModel": {
        type: "object",
        default: {},
        tags: [
            "experimental"
        ],
        properties: {
            model: {
                type: "string",
                description: "The model identifier to use for the request"
            },
            url: {
                type: "string",
                description: "model url"
            },
            apikey: {
                type: "string",
                description: "api key"
            },
              max_n: {
                type: "integer",
                description: "the max of n."
              }
            },
                interval: {
                type: "integer",
                description: "the interval between tow requists, ms"
              }
        },
        required: [
            "model",
            "url",
            "apikey"
        ]
    }
```

```json
    // package.json
    "github.copilot.enable": {
        "type": "object",
        "scope": "window",
        "default": {
            "*": true,
            "plaintext": false,
            "markdown": false,
            "scminput": false
        },
        "additionalProperties": {
            "type": "boolean"
        },
        "markdownDescription": "Enable or disable auto triggering of Copilot completions for specified [languages](https://code.visualstudio.com/docs/languages/identifiers). You can still trigger suggestions manually using `Alt + \\`"
    },
    "github.copilot.codeModel": {
      "type": "object",
      "default": {},
      "tags": [
        "experimental"
      ],
      "properties": {
        "model": {
          "type": "string",
          "description": "The model identifier to use for the request"
        },
        "url": {
          "type": "string",
          "description": "model url"
        },
        "apikey": {
          "type": "string",
          "description": "api key"
        },
        "max_n": {
          "type": "integer",
          "description": "the max of n."
        },
        "interval": {
            "type": "integer",
            "description": "the interval between tow requists, ms"
          }
      },
      "required": [
        "model",
        "url",
        "apikey"
      ]
    }
```

# 代码块符号修正

```js
  // NOTE - 修正输出
  const formatString = (str) => {
    str = str.replace(/\s*<think>[\s\S]*?<\/think>\s*?\n*/g, "")
    str = str.replace(/\s*<think>[\s\S]*?<\/thi[\s\S]*?\n*/g, "");
    str = str.replace(/\s*```[a-zA-Z0-9_\-]*\n?/, "")
    str = str.replace(/```\s*$/, "")
    return str;
  };

  let a = formatString(e.solution.text.join("")),
    r = !1;
  ta.info(t, a);


```
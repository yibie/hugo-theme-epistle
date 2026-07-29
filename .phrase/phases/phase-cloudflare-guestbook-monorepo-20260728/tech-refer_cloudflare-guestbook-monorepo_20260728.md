# Tech Refer — Cloudflare Guestbook Monorepo

## Options

### Option A — GitHub Actions 直接接匿名表单
**拒绝。** Actions 没有匿名 HTTP 入口；任何直接触发都需要把仓库凭据交给浏览器。

### Option B — Worker → `repository_dispatch` → Action → Issue
**拒绝。** 增加一次无价值转发；完整来信需要进入 dispatch payload，Issue 才是最终持久化对象。

### Option C — Worker 直接创建私人 Issue，Action 只处理批准发布
**采用。** Worker 是安全入口，Issue 同时提供持久化、标签、指派、通知与审计，Action 只响应站长意图。

### Option D — 首版建立通用插件 SDK
**拒绝。** 当前只有 Hugo 一个真实消费者。只稳定批准数据 schema 与 CLI 输入，等第二个发布器出现再提取接口。

## Proposed Approach

### Monorepo layout
```text
/
├── layouts/ static/ archetypes/ theme.toml  # 保持现有 Hugo theme 根兼容
├── exampleSite/                              # Hugo 集成 fixture
├── apps/
│   └── worker/                               # Cloudflare 匿名入口
├── packages/
│   └── hugo-publisher/                       # 批准数据 → Hugo Markdown
├── templates/inbox-workflow/                 # 私人 inbox 仓库安装模板
├── .github/workflows/                        # 当前 monorepo CI
└── package.json                              # npm workspaces
```

### Submission path
1. 接受 `POST`，拒绝其他方法。
2. 检查 `Origin` 精确匹配 allowlist。
3. 读取并限制请求大小，再解析 JSON 或 form data。
4. 规范化称呼、邮箱、正文和许可值，并校验 `sourcePath` 是不含查询、fragment 或路径穿越的站内绝对路径。
5. 服务端调用 Turnstile Siteverify，并验证 `success`、`hostname`、`action`。
6. 生成 `submissionId`，用已允许 origin 与 `sourcePath` 生成 `sourceUrl`，再写入结构化 Issue body。
7. 调用 GitHub Create Issue API，目标固定为环境配置的私人仓库。
8. 返回通用成功/失败响应，不向客户端暴露 GitHub 细节。

### Publish path
1. Workflow 只监听 `issues` 的 `labeled` 事件。
2. 精确匹配 `publish` 标签，并从私人 Issue 获取来信与站长公开回复。
3. 解析为 `Approved Letter v1`，再次确认 `publishConsent === true`。
4. Hugo 发布器以 `submissionId` 生成稳定文件路径。
5. 生成内容只包含公开白名单字段，匿名正文只进入 front matter 字符串，并以 `source_path` 保留文章归属。
6. 专用 Hugo 模板按纯文本渲染，禁止 `.Content`、`markdownify` 和 `safeHTML`。
7. 创建可审阅变更；重复触发应更新同一路径或安全退出。

## Interfaces & APIs

### Worker environment
- `ALLOWED_ORIGINS`
- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_EXPECTED_HOSTNAME`
- `TURNSTILE_EXPECTED_ACTION`
- `GITHUB_TOKEN`
- `GITHUB_INBOX_OWNER`
- `GITHUB_INBOX_REPO`
- `GITHUB_ASSIGNEE`

### HTTP
- `GET /health`：无敏感信息的健康响应。
- `POST /v1/submissions`：匿名投递。
- 其他路径返回 `404`，其他方法返回 `405`。

### Publisher CLI
- 输入：版本化的批准数据 JSON 文件或标准输入。
- 输出：目标 Hugo content 根目录中的确定性 Markdown 文件。
- 错误：schema、许可、回信或路径不合法时非零退出。

## Trust Boundaries
- 浏览器、表单字段、Origin、Issue body、Issue comments 全部是不可信输入。
- Turnstile Secret 与 GitHub Token 只存在于 Worker Secret。
- Actions Secrets 只存在于私人 inbox / 发布仓库环境。
- Shell 不直接插入 Issue 文本；数据通过文件或标准输入传递。
- Markdown/YAML 必须安全序列化，避免 front matter 注入。
- 当前公共主题仓库只分发 Worker、发布器和 workflow 模板；真实来信只存在于站长的私人 inbox 仓库。

## Risks & Mitigations
- **重复请求**：提交按钮禁用重复点击，并依赖 Turnstile token 的单次验证语义；不为低流量首版引入存储层。
- **GitHub API 限流/失败**：有限重试，失败时不向访客声称成功。
- **机器人绕过前端**：Turnstile 必须服务端验证并检查 hostname/action。
- **公开隐私字段**：发布器只组装白名单对象，并用测试断言邮箱不出现。
- **脚本/shortcode 注入**：匿名正文不进入 Markdown body；Hugo 模板只做自动转义的文本输出。
- **Issue 格式漂移**：版本化 marker + 严格解析，未知版本拒绝发布。
- **伪造文章归属**：`sourcePath` 是访客声明的站内路径；Worker 与发布器负责拒绝外站、查询、fragment 和路径穿越，但不能证明浏览器实际停留的文章。该字段只用于内容筛选、不参与文件路径拼接，站长批准公开前仍需核对来源文章。
- **未来适配诱发过度抽象**：第二个发布器出现前不新增注册机制。

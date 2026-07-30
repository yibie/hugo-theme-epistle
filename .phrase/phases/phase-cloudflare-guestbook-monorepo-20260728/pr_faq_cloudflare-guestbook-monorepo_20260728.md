# PR/FAQ — Cloudflare Guestbook Monorepo

状态：Final（依据 2026-07-28 用户确认：“按照你的计划执行……基于 Cloudflare 这一点不变”）

## Press Release

### Headline
> Epistle Guestbook 让静态博客拥有一只不要求登录、可以审阅后再公开的私人信箱

### Subtitle
> Cloudflare 接住匿名来信，私人 GitHub Issues 承担收件与审核，发布器把获准公开的“来信 + 回信”变成博客原生内容；首版支持 Hugo。

### Date
> 2026 年 7 月

### Intro paragraph
Epistle Guestbook 面向希望和读者保持来往、却不想把博客变成公开评论区的静态博客作者。访客无需 GitHub 或社交账号即可投递；站长先在私人收件箱中阅读和回复，只把得到许可且值得保留的来信整理后发布。

### Problem paragraph
现有静态站评论系统通常要求第三方登录，或允许匿名内容直接进入公共讨论区。前者抬高读者表达门槛，后者带来垃圾评论、审核压力和隐私风险。通用表单 SaaS 虽能收件，却把数据、工作流和产品边界交给另一个供应商，也无法自然完成“回复后择选发布”的编辑流程。

### Solution paragraph
系统用 Cloudflare Worker 提供唯一的公开提交入口，并在服务端验证 Turnstile、来源和字段边界。有效来信被写入私人 GitHub Issues，GitHub 成为收件记录与审核界面。站长添加 `publish` 标签后，GitHub Actions 调用首个 Hugo 发布器，将不含私人邮箱的 Markdown 直接提交并部署。

### Company leader quote
> “我们不需要再造一个评论平台。读者需要的是一条轻松、私密的来信路径；作者需要的是一套可掌控、能沉淀、不会误公开的编辑流程。Cloudflare、GitHub 和博客本身已经提供了大部分积木，我们只把边界接好。”

### How the product/service works
1. 站长部署 Worker，配置 Turnstile、私人 inbox 仓库和 GitHub 凭据。
2. Hugo 站点渲染留言表单，访客填写称呼、可选邮箱、正文和默认未勾选的公开许可。
3. Worker 验证请求后在私人仓库创建结构化 Issue，并指派站长。
4. 站长通过 Issue 阅读来信；如需回复，使用访客邮箱联系，并在 Issue 中记录公开版回信。
5. 只有存在明确公开许可和有效回信的 Issue 才能通过 `publish` 标签进入发布工作流。
6. Hugo 发布器将 Markdown 提交到私人源码仓库，并自动触发现有博客构建流程。

### Customer quote
> “读者不用注册，我也不用守着一个公开评论区。值得留下的交流会变成博客的一部分，其余内容一直留在私人信箱里。”

### How to get started
> 在 monorepo 中部署 `apps/worker`，配置私人 inbox 仓库，再按 Hugo 适配文档启用留言页面。

## FAQ

### Internal FAQs

#### 为什么 GitHub Actions 不直接接收浏览器表单？
Actions 只能由 GitHub 事件或需要鉴权的 API 触发，不是匿名 HTTP 服务。把触发令牌放进静态页面会泄露仓库权限，因此公开入口必须位于 Cloudflare。

#### 为什么 Worker 直接创建私人 Issue，而不是先触发 `repository_dispatch`？
Issue 本身就是持久化记录、审核界面和状态机。直接创建 Issue 少一次事件转发，也避免把完整来信作为 dispatch payload 传播。Actions 只在站长明确添加 `publish` 标签后介入。

#### 为什么固定使用 Cloudflare？
Cloudflare 同时提供边缘 HTTP 入口、Secret、Turnstile 和可选邮件能力；用户已明确将其作为不变的运行边界。首版不抽象其他运行时。

#### 为什么使用 GitHub Issues，而不是数据库？
私人 Issues 已具备持久化、搜索、标签、指派、通知和审计记录，足以承担低流量个人博客的收件箱。首版不新增数据库与管理后台；只有当容量、查询或合规需求超出 Issues 时再评估迁移。

#### 如何避免私人数据进入公开仓库？
来信正文和邮箱只写入私人 inbox 仓库。发布器使用明确的白名单字段生成公开内容，永不复制邮箱、IP、Turnstile token 或内部元数据。未同意公开的 Issue 即使被误加标签也必须失败。

#### 如何避免垃圾投递？
Worker 必须执行服务端 Turnstile 校验、请求方法与来源检查、字段长度限制、邮箱格式检查和安全输出编码。首版不自建内容分类器；出现可量化滥用后再增加 Cloudflare Rate Limiting 或更严格规则。

#### monorepo 如何支持未来的博客系统？
首版只固定一个版本化的“已批准来信”数据契约，并实现 Hugo 输出。不会提前建立插件 SDK、注册中心或多运行时抽象；未来适配器只需消费同一批准数据并产出目标博客系统的内容。

#### 初版有哪些明确不做的事？
不做公开线程评论、访客账号、实时聊天、点赞、附件、自建管理后台、数据库、AI 审核、跨站租户平台和 Hugo 以外的发布器。

### Customer FAQs

#### 访客需要 GitHub 登录吗？
不需要。GitHub 只在站长侧承担私人收件和发布流程。

#### 邮箱必须填写吗？
不必须；不填邮箱也能投递，但站长无法私下回复。邮箱永不进入公开内容。

#### 来信会自动公开吗？
不会。表单会明确提示来信可能公开，站长仍必须主动添加 `publish` 标签；公开版回信可以省略。

#### 站长必须使用 GitHub 吗？
首版必须，因为私人 Issues 和 Actions 是收件与发布工作流的一部分。未来可以增加其他内容平台适配器，但 Cloudflare 提交入口保持不变。

#### 必须使用 Epistle 主题吗？
Hugo 首版会为 Epistle 提供开箱即用模板，但发布器产出普通 Hugo Markdown；其他 Hugo 主题可以自定义 section 模板消费它。

#### 服务成本是多少？
系统以个人博客低流量为目标，优先落在 Cloudflare Workers/Turnstile 与 GitHub 的可用免费额度内。实际额度和邮件能力以用户账户与平台当期政策为准。

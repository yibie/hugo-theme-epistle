# Spec — Cloudflare Guestbook Monorepo

## Summary
把当前 Hugo 主题仓库扩展为保持主题根目录兼容的 monorepo，并交付一条完整纵切：匿名访客经 Cloudflare Worker 投递来信，来信进入私人 GitHub Issues；站长完成回复并批准后，GitHub Actions 生成 Hugo Markdown PR；Epistle 主题展示获准公开的“来信 + 回信”。

## Goals & Non-goals

### Goals
- 保持现有 Hugo theme 根目录与消费方式不变。
- Cloudflare Worker 是唯一公开写入口。
- 访客无需账号即可提交，公开许可默认关闭。
- 私人 GitHub Issues 承担收件、状态和审核。
- `publish` 标签只在许可与回信齐全时触发 Hugo 内容生成。
- 首版发布器支持 Hugo，同时把批准数据格式稳定为版本化契约。
- 不把邮箱、IP、验证码或内部 Issue 信息写入公开内容。

### Non-goals
- 不提供公开评论线程或访客身份系统。
- 不提供通用插件框架或非 Hugo 发布器。
- 不提供数据库、自建审核后台、附件或 AI 内容审核。
- 不自动替站长决定哪些来信值得发布。
- 不在初版迁移现有博客内容。

## User Flows

### Flow 1：站长部署留言板
- 操作：部署 Worker，配置 Turnstile、允许来源、私人 inbox 仓库、GitHub 凭据和站长账号。
- 反馈：健康检查成功，测试提交能创建已指派的私人 Issue。
- 失败：缺失 Secret、仓库权限不足或 Turnstile 配置错误时返回可诊断错误，日志不得包含来信正文和邮箱。

### Flow 2：访客匿名投递
- 操作：填写称呼、可选邮箱、正文和公开许可后提交。
- 反馈：Turnstile 与字段校验通过后显示统一成功状态；同一请求重试不得重复创建多封来信。
- 失败：验证失败、来源非法、字段越界或 GitHub 暂时不可用时显示不泄露内部信息的失败提示。

### Flow 3：站长阅读和回复
- 操作：在私人 inbox Issue 中阅读来信；如有邮箱则私下回复，并用约定格式记录公开版回信。
- 反馈：Issue 保留投递时间、称呼、来信、许可状态和回复状态；私人邮箱保持私有。
- 回退：无邮箱时仍可归档或公开来信，但页面需避免暗示已向访客送达私下回复。

### Flow 4：站长批准发布
- 操作：确认公开许可与公开版回信后添加 `publish` 标签。
- 反馈：Action 生成 Hugo Markdown PR，公开字段仅包括显示称呼、来信、回信和必要日期。
- 失败：缺少许可、回信或数据格式不合法时 Action 失败并在 Issue 中给出可修复原因，不创建内容。

### Flow 5：读者浏览公开往来
- 操作：访问 Hugo 留言板 section 或单封往来。
- 反馈：页面展示来信与站长回信，不显示邮箱和内部元数据；无公开往来时显示合适的空状态。

## Data Contract

### Submission v1
- `schemaVersion`: 固定为 `1`
- `submissionId`: Worker 生成的不可预测 ID
- `submittedAt`: ISO 8601 UTC 时间
- `displayName`: 可选，规范化后最长 80 字符
- `email`: 可选，仅私人收件使用
- `message`: 必填，规范化后 1–5000 字符
- `publishConsent`: 必填布尔值，默认 `false`
- `sourceUrl`: 由 Worker 根据允许来源确认，不信任客户端任意值

### Approved Letter v1
- `schemaVersion`: 固定为 `1`
- `submissionId`
- `submittedAt`
- `publishedAt`
- `displayName`
- `message`
- `reply`
- 明确禁止：`email`、IP、Turnstile token、GitHub token、Issue 内部 URL
- `message` 与 `reply` 只保存为 front matter 字符串，由专用 Hugo 模板按纯文本 HTML 上下文渲染；禁止进入 `.Content`、`markdownify` 或 `safeHTML`

## Edge Cases
- Turnstile token 过期、重复使用或 hostname 不匹配。
- 浏览器重复点击、网络重试或 GitHub API 超时。
- 来信包含 HTML、Markdown、YAML 分隔符、控制字符或超长内容。
- 来信包含 Hugo shortcode、raw HTML 或脚本片段。
- Issue 被手动修改为不符合 schema 的内容。
- 未勾选公开许可却被添加 `publish` 标签。
- 已发布 Issue 再次添加标签，不能生成重复文件。
- 发布器面对相同 `submissionId` 必须得到稳定路径。
- Worker CORS 只允许配置的博客 origin。

## Acceptance Criteria
- `npm test` 覆盖 Worker 的成功、校验失败、许可默认值、GitHub 错误与重复请求保护。
- 本地 Worker 集成测试证明有效请求创建结构化私人 Issue，请求日志不输出正文或邮箱。
- Action 监听 `issues:labeled`，仅处理精确的 `publish` 标签。
- 未许可或无有效回信时发布器非零退出且不生成文件。
- 合法 fixture 能生成确定性的 Hugo Markdown，且不含邮箱与内部字段。
- 恶意 HTML、shortcode 与 Markdown 链接在 Hugo 产物中只显示为文本，不执行、不展开。
- `hugo --source exampleSite --themesDir ../.. --destination <tmp>` 构建通过，留言板列表与详情页存在。
- 当前主题的既有首页、文章页、CSS 与 JS 路径保持兼容。
- README 包含部署、Secrets、权限、回滚和 Hugo 接入说明。

## Sources
- 用户确认：使用 monorepo 管理；初版兼容 Hugo；后续可增加更多博客系统；Cloudflare 作为不变边界。
- 已确认平台事实：GitHub Pages 是静态托管；Actions 的外部触发需要鉴权；Cloudflare Worker 可执行服务端 Turnstile 验证。
- 当前仓库事实：Hugo 主题约定目录位于仓库根，`exampleSite/` 是现有验证入口。

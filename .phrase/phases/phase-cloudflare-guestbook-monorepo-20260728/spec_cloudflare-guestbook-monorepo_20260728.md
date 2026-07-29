# Spec — Cloudflare Guestbook Monorepo

## Summary
把当前 Hugo 主题仓库扩展为保持主题根目录兼容的 monorepo，并交付一条完整纵切：匿名访客经 Cloudflare Worker 投递来信，来信进入私人 GitHub Issues；站长批准后，GitHub Actions 生成 Hugo Markdown PR；Epistle 主题展示获准公开的来信与可选回信。

## Goals & Non-goals

### Goals
- 保持现有 Hugo theme 根目录与消费方式不变。
- Cloudflare Worker 是唯一公开写入口。
- 访客无需账号或勾选许可；表单显著说明来信可能被摘录公开，寄出即表示知悉。
- 私人 GitHub Issues 承担收件、状态和审核。
- 同一个私人仓库保存 Issues 与生产 Hugo 源码，批准发布只在仓库内生成 PR。
- `publish` 标签只在投递来自新版告知表单时触发 Hugo 内容生成，作者回复可选。
- 首版发布器支持 Hugo，同时把批准数据格式稳定为版本化契约。
- 不把邮箱、IP、验证码或内部 Issue 信息写入公开内容。
- 每篇文章在正文后直接展示属于该文的公开往来，并由「往来」按钮展开写信表单。

### Non-goals
- 不提供公开评论线程或访客身份系统。
- 不提供通用插件框架或非 Hugo 发布器。
- 不提供数据库、自建审核后台、附件或 AI 内容审核。
- 不自动替站长决定哪些来信值得发布。
- 不迁移与当前生产构建无关的历史归档和本地工具。

## User Flows

### Flow 1：站长部署留言板
- 操作：部署 Worker，配置 Turnstile、允许来源、私人 inbox 仓库、GitHub 凭据和站长账号。
- 反馈：健康检查成功，测试提交能创建已指派的私人 Issue。
- 失败：缺失 Secret、仓库权限不足或 Turnstile 配置错误时返回可诊断错误，日志不得包含来信正文和邮箱。

### Flow 2：访客匿名投递
- 操作：阅读“来信可能被摘录公开、邮箱不会公开”的提示，填写称呼、可选邮箱和正文后提交。
- 反馈：Turnstile 与字段校验通过后显示统一成功状态；同一请求重试不得重复创建多封来信。
- 失败：验证失败、来源非法、字段越界或 GitHub 暂时不可用时显示不泄露内部信息的失败提示。

### Flow 3：站长阅读和回复
- 操作：在私人 inbox Issue 中阅读来信；如有邮箱可私下回复，也可用约定格式记录公开版回信。
- 反馈：Issue 保留投递时间、称呼、来信、告知状态和可选回复；私人邮箱保持私有。
- 回退：无邮箱时仍可归档或公开来信，但页面需避免暗示已向访客送达私下回复。

### Flow 4：站长批准发布
- 操作：确认来信来自已展示公开提示的表单后添加 `publish` 标签；公开版回信可选。
- 反馈：Action 在同一个私人仓库生成 Hugo Markdown PR，公开字段仅包括显示称呼、来信、可选回信和必要日期。
- 失败：旧投递未记录告知、数据格式不合法时 Action 失败并在 Issue 中给出可修复原因，不创建内容。

### Flow 5：读者浏览公开往来
- 操作：阅读文章后继续查看同一张信纸下半区的公开往来，或点击「往来」展开写信表单。
- 反馈：页面直接展示归属于当前文章的来信与站长回信，不显示邮箱和内部元数据；无公开往来时直接展示写信表单。
- 继续阅读：上一封与下一封位于整个往来区域下方，分别靠左与靠右。

## Data Contract

### Submission v1
- `schemaVersion`: 固定为 `1`
- `submissionId`: Worker 生成的不可预测 ID
- `submittedAt`: ISO 8601 UTC 时间
- `displayName`: 可选，规范化后最长 80 字符
- `email`: 可选，仅私人收件使用
- `message`: 必填，规范化后 1–5000 字符
- `publishConsent`: 兼容 v1 的告知确认位；新版表单在显著提示旁固定提交 `true`，旧投递的 `false` 继续保持不可公开
- `sourcePath`: 由表单提交、Worker 严格校验的站内绝对路径
- `sourceUrl`: 由 Worker 将已允许的 origin 与 `sourcePath` 组合，不信任客户端任意 URL

### Approved Letter v1
- `schemaVersion`: 固定为 `1`
- `submissionId`
- `submittedAt`
- `publishedAt`
- `displayName`
- `message`
- `reply`: 可选
- `sourcePath`
- 明确禁止：`email`、IP、Turnstile token、GitHub token、Issue 内部 URL
- `message` 与 `reply` 只保存为 front matter 字符串，由专用 Hugo 模板按纯文本 HTML 上下文渲染；禁止进入 `.Content`、`markdownify` 或 `safeHTML`

## Edge Cases
- Turnstile token 过期、重复使用或 hostname 不匹配。
- 浏览器重复点击、网络重试或 GitHub API 超时。
- 来信包含 HTML、Markdown、YAML 分隔符、控制字符或超长内容。
- 来信包含 Hugo shortcode、raw HTML 或脚本片段。
- Issue 被手动修改为不符合 schema 的内容。
- 旧投递没有公开告知记录却被添加 `publish` 标签。
- 作者没有留下 `/reply`，公开内容只展示访客来信。
- 已发布 Issue 再次添加标签，不能生成重复文件；无新回复时也不能只因 Issue 元数据变化而改写 `lastmod`。
- 发布器面对相同 `submissionId` 必须得到稳定路径。
- Worker CORS 只允许配置的博客 origin。
- `sourcePath` 含 scheme、host、查询、fragment、反斜线或路径穿越。

## Acceptance Criteria
- `npm test` 覆盖 Worker 的成功、校验失败、许可默认值、GitHub 错误与重复请求保护。
- 本地 Worker 集成测试证明有效请求创建结构化私人 Issue，请求日志不输出正文或邮箱。
- Action 监听 `issues:labeled`，仅处理精确的 `publish` 标签。
- 旧投递未记录告知时发布器非零退出；没有有效回信时仍生成只含访客来信的文件。
- 合法 fixture 能生成确定性的 Hugo Markdown，且不含邮箱与内部字段。
- 恶意 HTML、shortcode 与 Markdown 链接在 Hugo 产物中只显示为文本，不执行、不展开。
- `hugo --source exampleSite --themesDir ../.. --destination <tmp>` 构建通过，留言板列表与详情页存在。
- Hugo 文章页与首页只展示 `source_path` 等于当前文章 `.RelPermalink` 的公开往来。
- 有公开往来时直接显示内容，「往来」是唯一写信按钮；无公开往来时表单直接显示。
- 上一封与下一封渲染在往来之后，上一封靠左、下一封靠右。
- 当前主题的既有首页、文章页、CSS 与 JS 路径保持兼容。
- README 包含部署、Secrets、权限、回滚和 Hugo 接入说明。
- 私人仓库合并源码 PR 后构建 Hugo，并以仅作用于公开站点仓库的 Deploy Key 推送静态产物。

## Sources
- 用户确认：使用 monorepo 管理；初版兼容 Hugo；后续可增加更多博客系统；Cloudflare 作为不变边界。
- 已确认平台事实：GitHub Pages 是静态托管；Actions 的外部触发需要鉴权；Cloudflare Worker 可执行服务端 Turnstile 验证。
- 当前仓库事实：Hugo 主题约定目录位于仓库根，`exampleSite/` 是现有验证入口。

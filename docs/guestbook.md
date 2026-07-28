# Epistle 私人留言板部署指南

Epistle 的留言板是一条私人投递通道，不是实时评论区：

1. 访客在 Hugo 页面写信，并决定是否允许公开摘录。
2. Cloudflare Worker 验证来源和 Turnstile，将原始来信写入私人 GitHub Issue。
3. 站长通过 GitHub 通知收信；如访客留了邮箱，可自行邮件回复。
4. 若来信获准公开，站长在 Issue 中写下 `/reply` 公开版回复，再添加 `publish` 标签。
5. GitHub Actions 生成不含邮箱的 Hugo Markdown，并向博客源码仓库提交 PR。

公开页只显示获准公开的来信和站长回复。邮箱、Issue 正文和其他审核信息不会进入 Hugo 内容。

## 需要准备

- Node.js 22+
- 一个 Cloudflare 账号、一个 Worker 和一个 Turnstile Widget
- 一个**私人** GitHub 仓库作为收件箱
- 一个由 Git 管理的 Hugo 源码仓库

先在本仓库验证工具链：

```bash
npm install
npm test
npm run test:hugo
```

## 1. 创建私人收件箱

新建一个 private GitHub repository，并创建三个标签：

- `guestbook`
- `needs-review`
- `publish`

为 Worker 创建 fine-grained personal access token，只授权该私人仓库的 Issues 读写权限。不要把收件箱设为 public；Issue 内含访客可能选择不公开的信息。

GitHub 会按账号的通知设置发送新 Issue 邮件。若希望固定投递到某个邮箱，在 GitHub 的 Notifications 设置中为该私人仓库启用 Watching，并选择接收 Issues 通知的邮箱。

## 2. 配置并部署 Cloudflare Worker

编辑 `apps/worker/wrangler.toml`：

```toml
[vars]
ALLOWED_ORIGINS = "https://example.com"
TURNSTILE_EXPECTED_HOSTNAME = "example.com"
TURNSTILE_EXPECTED_ACTION = "guestbook-submit"
GITHUB_INBOX_OWNER = "your-github-login"
GITHUB_INBOX_REPO = "private-guestbook-inbox"
GITHUB_ASSIGNEE = "your-github-login"
```

多个来源以英文逗号分隔。来源必须精确匹配协议、域名和端口；本地开发可额外加入 `http://localhost:1313`。

在 Cloudflare Turnstile 创建 Widget，把生产域名加入允许列表。然后从仓库根目录保存 Secret 并部署：

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY --config apps/worker/wrangler.toml
npx wrangler secret put GITHUB_TOKEN --config apps/worker/wrangler.toml
npm run deploy --workspace @epistle/guestbook-worker
```

本地调试时，将 `apps/worker/.dev.vars.example` 复制为 `apps/worker/.dev.vars` 并填写测试值；该文件已被 Git 忽略。

Worker 提供：

- `GET /health`
- `POST /v1/submissions`

不建议在浏览器、Hugo 配置或 GitHub Actions 中保存上述两个 Secret。

## 3. 启用 Hugo 页面

在博客的 `hugo.toml` 中添加：

```toml
[params.guestbook]
enabled = true
endpoint = "https://epistle-guestbook-worker.example.workers.dev/v1/submissions"
turnstileSiteKey = "your-turnstile-site-key"
```

再创建 `content/guestbook/_index.md`：

```yaml
---
title: "来信"
---
```

主题会显示匿名投递表单和已公开往来。关闭时只需将 `enabled` 改为 `false` 或删除 `[params.guestbook]`；未启用时不会加载 Turnstile 和留言板脚本。

## 4. 安装审核发布工作流

把 `templates/inbox-workflow/publish-hugo.yml` 复制到私人收件箱仓库：

```text
.github/workflows/publish-hugo.yml
```

在收件箱仓库配置：

| 类型 | 名称 | 值 |
|---|---|---|
| Secret | `BLOG_PUBLISH_TOKEN` | 只授权 Hugo 源码仓库 Contents 与 Pull requests 写入的 fine-grained token |
| Variable | `BLOG_REPOSITORY` | `owner/hugo-source-repository` |
| Variable | `BLOG_BASE_BRANCH` | 可选，默认 `main` |
| Variable | `GUESTBOOK_CONTENT_DIR` | 可选，默认 `content/guestbook` |
| Variable | `GUESTBOOK_MAINTAINERS` | 可发布回复的 GitHub 登录名，多个以逗号分隔 |
| Variable | `GUESTBOOK_SYSTEM_REF` | 必填：经过审阅的 Epistle release 所对应的 40 位 commit SHA |

Hugo 源码必须在 GitHub 仓库中，不能只保留本地目录或构建后的 `public/` 仓库，否则 Action 无法创建内容 PR。

## 5. 审核、回复和公开

收到 Issue 后：

1. 阅读来信，并确认其中的“允许公开”值为“是”。
2. 如有邮箱，可在自己的邮件客户端中私下回复；该邮件往来不会自动公开。
3. 在 Issue 中添加一条由维护者本人发送的评论：

   ```text
   /reply
   这里写准备显示在留言板里的公开回复。
   ```

4. 添加 `publish` 标签。
5. 检查 Hugo 源码仓库中新建或更新的 PR，预览无误后合并。

发布器只接受 `GUESTBOOK_MAINTAINERS` 中的账号。若有多条合法 `/reply` 评论，最后一条生效。重复触发会更新同一份以 submission UUID 命名的 Markdown，不会复制一篇新留言。

若来信未同意公开、没有可信回复或数据损坏，Action 会停止，并把可修复的失败原因评论回这个私人 Issue。

生成文件只含：

- 投递 ID 和日期
- 公开称呼
- 来信正文
- 站长公开回复

邮箱不会被复制。来信和回复只写入 front matter，并由主题模板按普通文本转义；其中的 HTML、Markdown、shortcode 或脚本不会执行。

## 排错与回滚

- 表单提示验证码失败：检查 Turnstile 域名、site key、secret key 和 action 是否一致。
- 表单提示无法寄出：检查 Worker 日志、GitHub token 权限、收件箱仓库名和 `ALLOWED_ORIGINS`。
- 添加 `publish` 后没有 PR：确认 Issue 同时具有 `guestbook` 标签、公开许可为真、存在可信维护者的 `/reply`，并检查 Action 日志。
- 暂停收件：将 Hugo 配置中的 `enabled` 设为 `false`。
- 暂停公开：禁用或移除私人收件箱中的 publish workflow；已有公开内容不受影响。
- 撤回一封公开来信：在 Hugo 源码仓库删除对应 Markdown 并正常走一次 PR/部署流程；私人 Issue 可继续保留供审核追溯。

当前首版只适配 Hugo。未来增加第二种博客系统时，复用 Worker 的私人 Issue 数据，再新增一个对应发布器即可；在出现真实需求前不引入通用插件框架。

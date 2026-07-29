# Plan — Cloudflare Guestbook Monorepo

## Milestones
1. **锁定产品与安全边界**
   - 固化 PR/FAQ、数据契约、隐私边界和失败路径。
2. **建立非破坏性 monorepo**
   - 保留 Hugo theme 根目录。
   - 使用 npm workspaces 管理 Worker 与 Hugo 发布器，不引入应用框架或单实现插件 SDK。
3. **交付匿名收件纵切**
   - Worker 验证 origin、内容、邮箱与 Turnstile。
   - 使用最小权限凭据在私人 inbox 仓库创建结构化 Issue。
4. **交付 Hugo 发布纵切**
   - 从已批准 Issue 提取版本化数据。
   - `publish` 标签触发 Action，生成 Hugo Markdown PR 或可审阅变更。
5. **交付 Epistle 展示适配**
   - 加入留言表单 partial、留言板 section 模板、样式与 exampleSite fixture。
   - 在文章末尾提供留言入口，并让桌面留言表单使用完整信纸宽度与紧凑字段节奏。
   - 将定稿后的「连续信纸」往来嵌入文章和首页：公开往来直接展示，「往来」只展开表单，相邻信件导航位于往来之后。
   - 以显著公开提示替代许可复选框，并允许站长在没有公开回信时只发布访客来信。
6. **验证与运行配置**
   - 单元/集成测试、Hugo 构建、安全检查、平台凭据检查和可回滚部署。

## Scope

### In Scope
- 根 `package.json` / workspace 测试入口。
- `apps/worker/`：Cloudflare Worker、Wrangler 配置、测试。
- `packages/hugo-publisher/`：Hugo Markdown 生成器与 CLI。
- `.github/workflows/`：当前 monorepo CI。
- `templates/`：复制到私人 inbox 仓库的发布工作流模板；不伪装成当前公共仓库可直接接收私人 Issue。
- Hugo 根目录的表单 partial、guestbook section 模板、静态样式/脚本和 exampleSite 内容。
- Worker 与 Hugo 发布器的 `sourcePath` 兼容扩展，用于按文章归属公开往来。
- README、部署说明和 `.phrase` 闭环文档。

### Out of Scope
- Cloudflare 之外的运行时。
- WordPress、Jekyll、Astro 等发布器。
- 管理后台、数据库、附件、富文本编辑器。
- 现有用户博客源码仓库迁移与历史内容导入。

## Priorities
1. **P0：匿名入口不暴露 GitHub 或 Turnstile Secret**
2. **P0：未授权内容绝不公开**
3. **P0：私人字段绝不进入生成内容**
4. **P0：Hugo 主题既有消费方式无回归**
5. **P1：站长用 Issue 标签完成可理解的审核流程**
6. **P1：未来发布器可消费稳定批准数据，但不提前建设插件框架**

## Risks & Dependencies
- 依赖 Cloudflare Worker、Turnstile 与 GitHub API 的可用性。
- Worker 需要最小权限、仅作用于私人 inbox 仓库的凭据。
- 当前博客源码未进入 Git；真正自动发布前需要单独完成源码仓库化。
- GitHub Issue 文本是外部输入，Action 必须按不可信数据处理，禁止直接拼接 shell。
- 示例站允许 raw HTML，匿名正文禁止经过 Hugo `.Content` 或 Markdown 渲染。
- Cloudflare/GitHub 账户配置与 Secret 可能无法在本地自动完成；代码必须支持可重复部署与明确手动步骤。

## Rollback
- Worker 可通过删除 route 或恢复上一 deployment 立即停用。
- Hugo 表单由站点参数控制，关闭参数即可隐藏入口。
- 发布 Action 可禁用，私人 Issues 不受影响。
- monorepo 新目录不改变 Hugo 根约定；移除 workspace 文件即可恢复纯主题仓库。

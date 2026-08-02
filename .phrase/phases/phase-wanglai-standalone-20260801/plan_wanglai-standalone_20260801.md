# Plan — Wanglai / 往来（Approved）

依据：`pr_faq_wanglai-standalone_20260801.md`（Final）与 `spec_wanglai-standalone_20260801.md`（Approved）

## Milestones

1. **锁定公开契约**：确认批准内容的数据结构、隐私白名单、Issue 命令和单 Issue 单提交语义。
2. **抽取自托管模板**：把 Worker、Turnstile、私人 inbox workflow 和跨仓库写入整理为可安装模板，不改变 Cloudflare 固定边界。
3. **交付 Hugo Module**：提供主题无关模板、最小中性样式、示例配置与覆盖点。
4. **完成发布与撤回闭环**：验证 `publish` 直推、幂等、提交回链，以及基于 Git revert 的简单辅助脚本。
5. **发布首个版本**：完成安装文档、安全说明、示例站、升级与故障排查，发布 MIT 授权的语义化版本。
6. **拆分双语文档**：以英文 README 为默认入口、中文 README 为显式入口，并为每份 docs 提供结构一致的 `en` 与 `zh-CN` 版本。

## Scope

- 公共 Wanglai 项目与私有 inbox 模板之间的安装边界。
- Cloudflare Worker + Turnstile 匿名提交。
- 私人 GitHub Issues 收件、`/reply`、`publish` 与发布结果回链。
- 通过目标仓库专用写入凭据直推 Hugo 源码默认分支。
- 普通 Hugo Markdown 输出与主题无关 Hugo Module。
- 一条 Issue 一条发布提交，以及只使用 Git revert 的撤回脚本。
- 文档、最小示例与端到端验证。
- README 与 docs 的中英文独立入口、互链和同名结构。

## Priorities

- **P0**：私人数据隔离、服务端验证、凭据最小权限、发布幂等、撤回可审计。
- **P1**：20 分钟安装路径、任意 Hugo 主题兼容、可诊断失败、稳定版本固定。
- **P2**：更多示例主题与安装体验微调。

## Risks & Dependencies

- GitHub 与 Cloudflare 平台行为可能变化；实现前只依据官方文档验证权限、触发与配额。
- 跨仓库写入凭据是主要安全边界；必须限制到单一 Hugo 源码仓库，并避免日志泄漏。
- 默认分支要求 PR 时无法满足无合并体验；首版明确拒绝该配置。
- Git revert 依赖单 Issue 单提交；发布器不得批量混合多个来信。
- Hugo 主题差异可能影响默认展示；只承诺语义模板、最小样式与标准覆盖点，不维护主题名单。
- 现有 Epistle 实现可作为已验证来源，但抽取时不得携带主题耦合或站点私有配置。

## Rollback

- 发布内容的产品级撤回只使用 `git revert <publish-commit>`；辅助脚本是该命令的校验与推送封装。
- 安装或版本升级失败时，将 Hugo Module 与 workflow 固定回上一已知版本/SHA。
- Worker 发布失败时回滚到上一版本；私人 inbox Issues 不删除，以保留原始审计记录。

## Approval

2026-08-01 用户确认进入实施阶段。按 `task_wanglai-standalone_20260801.md` 顺序执行并逐项验证。

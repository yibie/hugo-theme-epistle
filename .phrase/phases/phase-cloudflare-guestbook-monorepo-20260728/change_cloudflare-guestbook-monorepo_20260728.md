# Change Log — Phase: cloudflare-guestbook-monorepo-20260728

change001 日期:2026-07-28 | 文件:.phrase/phases/phase-cloudflare-guestbook-monorepo-20260728/pr_faq_cloudflare-guestbook-monorepo_20260728.md | 操作:Add | 影响:产品边界 | 说明:固化匿名私人投递、审核回复、择选公开与 Cloudflare 固定边界 | 关联:task001
change002 日期:2026-07-28 | 文件:.phrase/phases/phase-cloudflare-guestbook-monorepo-20260728/spec_cloudflare-guestbook-monorepo_20260728.md | 操作:Add | 影响:需求与验收 | 说明:定义 v1 用户流程、数据契约、隐私规则和验收标准 | 关联:task001
change003 日期:2026-07-28 | 文件:.phrase/phases/phase-cloudflare-guestbook-monorepo-20260728/plan_cloudflare-guestbook-monorepo_20260728.md | 操作:Add | 影响:实施阶段 | 说明:建立非破坏性 monorepo、Worker、Hugo 发布器与验证里程碑 | 关联:task001
change004 日期:2026-07-28 | 文件:.phrase/phases/phase-cloudflare-guestbook-monorepo-20260728/tech-refer_cloudflare-guestbook-monorepo_20260728.md | 操作:Add | 影响:架构与信任边界 | 说明:采用 Worker 直写私人 Issue、Action 仅处理批准发布的最小架构 | 关联:task001
change005 日期:2026-07-28 | 文件:.phrase/phases/phase-cloudflare-guestbook-monorepo-20260728/task_cloudflare-guestbook-monorepo_20260728.md | 操作:Add | 影响:任务闭环 | 说明:以 BDD 单行格式拆分 v1 实现与验证任务 | 关联:task001
change006 日期:2026-07-28 | 文件:package.json,package-lock.json | 操作:Add | 影响:monorepo 工具链 | 说明:以 npm workspaces 接入 Worker、Hugo 发布器和统一测试入口且保留主题根目录 | 关联:task002
change007 日期:2026-07-28 | 文件:apps/worker/src/index.js | 操作:Add | 影响:匿名投递入口 | 说明:实现来源、请求大小、字段与 Turnstile 校验并写入结构化私人 GitHub Issue | 关联:task003
change008 日期:2026-07-28 | 文件:apps/worker/test/handler.test.js | 操作:Add | 影响:Worker 安全边界 | 说明:覆盖非法来源、字段越界、验证码错配、单次 token 重试和上游失败 | 关联:task004
change009 日期:2026-07-28 | 文件:packages/hugo-publisher | 操作:Add | 影响:Hugo 内容生成 | 说明:从批准 Issue 与可信维护者回复生成确定性且不含邮箱的 front matter | 关联:task005
change010 日期:2026-07-28 | 文件:templates/inbox-workflow | 操作:Add | 影响:审核发布流水线 | 说明:提供固定发布器 SHA、失败回写 Issue 和 Hugo 内容 PR 的私人收件箱工作流 | 关联:task005
change011 日期:2026-07-28 | 文件:layouts/guestbook,layouts/partials/guestbook-form.html | 操作:Add | 影响:留言板展示与投递 | 说明:增加可选表单、公开往来列表和详情页并仅按转义文本渲染匿名内容 | 关联:task007
change012 日期:2026-07-28 | 文件:static/js/guestbook.js,static/css/main.css | 操作:Modify | 影响:表单交互与视觉 | 说明:以原生表单增强、可访问状态反馈和现有信纸 token 完成桌面与移动端界面 | 关联:task007
change013 日期:2026-07-28 | 文件:layouts/partials/sidebar.html,layouts/_default/single.html | 操作:Modify | 影响:文章归档与导航 | 说明:按 mainSections 隔离留言页，避免进入信匣和文章上下篇导航 | 关联:task006
change014 日期:2026-07-28 | 文件:test/guestbook-flow.test.mjs,.github/workflows/ci.yml | 操作:Add | 影响:端到端与持续集成 | 说明:锁定 Worker 到私人 Issue 再到公开 Hugo 数据的跨包契约并收窄 CI 权限 | 关联:task009
change015 日期:2026-07-28 | 文件:exampleSite/content/guestbook,exampleSite/hugo.toml | 操作:Add | 影响:安全示例站 | 说明:加入真实路由示例和 raw HTML/Markdown 不执行的公开 fixture | 关联:task006
change016 日期:2026-07-28 | 文件:README.md,docs/guestbook.md | 操作:Modify | 影响:部署与运行手册 | 说明:说明私人收件、GitHub 邮件通知、审核回复、最小权限、排错和回滚步骤 | 关联:task008
change017 日期:2026-07-28 | 文件:.omx/state/guestbook/ralph-progress.json | 操作:Add | 影响:可视验收证据 | 说明:记录桌面与移动端 visual-verdict 93 分通过结论 | 关联:task009
change018 日期:2026-07-28 | 文件:.phrase/phases/phase-cloudflare-guestbook-monorepo-20260728/task_cloudflare-guestbook-monorepo_20260728.md | 操作:Modify | 影响:任务闭环 | 说明:回写 task002-task009 的实现与验证完成状态 | 关联:task009
change019 日期:2026-07-29 | 文件:apps/worker/wrangler.toml | 操作:Modify | 影响:正式 Worker 环境 | 说明:锁定正式站点来源、Turnstile hostname 与私人 inbox 仓库目标 | 关联:task010
change020 日期:2026-07-29 | 文件:.phrase/phases/phase-cloudflare-guestbook-monorepo-20260728/task_cloudflare-guestbook-monorepo_20260728.md | 操作:Modify | 影响:任务闭环 | 说明:记录 Cloudflare Worker 与 GitHub Pages 正式部署验证结果 | 关联:task010
change021 日期:2026-07-29 | 文件:.phrase/phases/phase-cloudflare-guestbook-monorepo-20260728/plan_cloudflare-guestbook-monorepo_20260728.md,.phrase/phases/phase-cloudflare-guestbook-monorepo-20260728/task_cloudflare-guestbook-monorepo_20260728.md | 操作:Modify | 影响:留言可发现性与桌面表单 | 说明:补充文章入口、桌面宽度和字段节奏的验收任务 | 关联:task011
change022 日期:2026-07-29 | 文件:layouts/_default/baseof.html,layouts/_default/single.html,static/css/main.css | 操作:Modify | 影响:留言入口与响应式布局 | 说明:在文章末尾增加留言链接并修复桌面信纸收缩与表单空行占位 | 关联:task011
change023 日期:2026-07-29 | 文件:package.json,.omx/state/guestbook/ralph-progress.json,.phrase/phases/phase-cloudflare-guestbook-monorepo-20260728/task_cloudflare-guestbook-monorepo_20260728.md | 操作:Modify | 影响:回归验证与任务闭环 | 说明:增加 Hugo 产物断言并记录桌面移动端视觉评分 94 分通过 | 关联:task011

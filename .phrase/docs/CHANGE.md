# Change Index

## phase-wanglai-standalone-20260801
- `change008` — 公共仓库、main/tag CI 与 Release：发布 Wanglai v0.1.0（task008）
- `change007` — README、安装/运维文档、v0.1.0 元数据与只读 CI：固定权限、版本与排错路径（task007）
- `change006` — Git revert 撤回脚本与临时仓库测试：仅撤回单文件发布提交并保留审计（task006）
- `change005` — Hugo Module、前端资源、fixture 与视觉状态：文章归属、多表单和响应式 UI 验收通过（task005）
- `change004` — 发布器、私人 inbox workflow 与端到端测试：Deploy Key 跨仓库直推并回写发布提交（task004）
- `change003` — Worker、Wrangler 配置与测试：新增私有 inbox 预检的匿名投递入口（task003）
- `change002` — 独立仓库、MIT、数据契约与 parser：冻结 wanglai:v1 并兼容旧 Epistle marker（task002）
- `change001` — `spec_*`、`plan_*`、`task_*`：确认独立 Wanglai 实施边界并拆分首版任务（task001）

## phase-cloudflare-guestbook-monorepo-20260728
- `change038` — 生产 workflow、README 与 `task_*`：移除 PR 权限并完成托管发布/部署验证（task016）
- `change037` — workflow 模板、README、测试与 phase 文档：publish 直接提交 main 并触发部署，不再创建 PR（task016）
- `change036` — `task_*`：实际 Issue、同仓库 PR、部署、幂等重触发与线上文章完成验证（task015）
- `change035` — 生产 Hugo 源码与 Actions：迁入现有私人 inbox 并完成首次自动部署（task015）
- `change034` — Hugo 发布器与测试：固定无回复来信的 lastmod，重复批准不再制造空变更（task015）
- `change033` — workflow 模板、README、测试与 phase 文档：收敛为同一私人仓库审核和维护源码（task015）
- `change032` — `task_*`、视觉状态：确认往来末尾只保留导航分隔线并完成验收（task014）
- `change031` — `main.css`、`task_*`：移除往来末尾与导航之间的重复分隔线（task014）
- `change030` — `task_*`、视觉状态与博客来信：首封无回复往来上线并完成验证（task013）
- `change029` — 表单、Worker、发布器与说明：以公开提示替代复选框并让回信可选（task013）
- `change028` — `spec_*`、`plan_*`、`task_*` 与测试：锁定提交即知悉和无回复发布契约（task013）
- `change027` — `task_*`、`ralph-progress.json`：记录全量测试、真实博客构建及 99 分视觉验收（task012）
- `change026` — Hugo 模板、CSS、示例、README 与截图：交付定稿的文章内往来界面（task012）
- `change025` — Worker、发布器与测试：贯通并验证 `sourcePath` 文章归属（task012）
- `change024` — `spec_*`、`plan_*`、`tech-refer_*`、`task_*`：锁定按文章归属的连续信纸往来与 `sourcePath` 契约（task012）
- `change001` — `pr_faq_*`：固化留言板产品边界与首版用户流程（task001）
- `change002` — `spec_*`：定义数据契约、隐私规则和验收标准（task001）
- `change003` — `plan_*`：建立 monorepo、Worker、Hugo 发布与验证里程碑（task001）
- `change004` — `tech-refer_*`：记录 Worker 直写私人 Issue 的架构决策（task001）
- `change005` — `task_*`：拆分 v1 实现与验证任务（task001）
- `change006` — `package*.json`：建立兼容主题根目录的 npm workspaces 与统一测试入口（task002）
- `change007` — `apps/worker/src/index.js`：实现 Cloudflare 匿名私人投递入口（task003）
- `change008` — `apps/worker/test/handler.test.js`：锁定 Worker 边界与单次 Turnstile 重试行为（task004）
- `change009` — `packages/hugo-publisher`：生成不含邮箱的确定性 Hugo front matter（task005）
- `change010` — `templates/inbox-workflow`：交付固定发布器 SHA 的私人审核发布模板（task005）
- `change011` — `layouts/guestbook`、`guestbook-form.html`：加入 Hugo 留言列表、详情与可选表单（task007）
- `change012` — `static/js/guestbook.js`、`static/css/main.css`：加入原生表单交互与信纸样式（task007）
- `change013` — `sidebar.html`、`single.html`：将留言页从文章归档和上下篇导航隔离（task006）
- `change014` — `test/guestbook-flow.test.mjs`、`ci.yml`：增加跨包契约与只读 CI（task009）
- `change015` — `exampleSite/content/guestbook`：增加不执行匿名 HTML/Markdown 的示例（task006）
- `change016` — `README.md`、`docs/guestbook.md`：补齐部署、审核、排错和回滚说明（task008）
- `change017` — `.omx/state/guestbook/ralph-progress.json`：记录 visual-verdict 93 分通过证据（task009）
- `change018` — `task_*`：回写 task002-task009 完成状态（task009）
- `change019` — `apps/worker/wrangler.toml`：锁定正式 Worker 的来源、Turnstile 与私人 inbox 配置（task010）
- `change020` — `task_*`：记录正式 Worker 与 GitHub Pages 部署验证结果（task010）
- `change021` — `plan_*`、`task_*`：补充文章留言入口与桌面表单布局验收任务（task011）
- `change022` — `baseof.html`、`single.html`、`main.css`：增加文章留言入口并修复桌面信纸与表单间距（task011）
- `change023` — `package.json`、`ralph-progress.json`、`task_*`：加入产物断言并记录视觉验收通过（task011）

## phase-dappled-light-20260402
- `change001` — `assets/css/main.css`：新增斑驳树影变量、桌面环境光与纸面光影伪元素（task001）
- `change002` — `static/css/main.css`：同步静态分发 CSS（task001）
- `change003` — `assets/css/main.css`：补充移动端与 `prefers-reduced-motion` 降级（task003）
- `change004` — `layouts/_default/baseof.html`：输出 `data-dappled` 开关属性（task002）
- `change005` — `exampleSite/hugo.toml`：示例站增加 `dappledLight` 配置（task002）
- `change006` — `README.md`：补充能力说明、配置入口和降级策略（task004）

## phase-sunlit-paper-20260402
- `change001` — `layouts/_default/baseof.html`：新增 sunlight-scene 与 paper-light 分层 DOM（task001）
- `change002` — `assets/js/main.js`：新增纯 JS 投影场景生成器（task001）
- `change003` — `assets/css/main.css`：重写分层投影、progressive blur 与 grain 样式（task001）
- `change004` — `static/js/main.js`：同步静态分发 JS（task001）
- `change005` — `static/css/main.css`：同步静态分发 CSS（task001）
- `change006` — `README.md`：更新纯 JS + CSS 分层投影说明（task005）
- `change007` — `assets/js/main.js, assets/css/main.css`：扩大投影覆盖范围，修正影子只停在右上角的问题（task001）
- `change008` — `assets/css/main.css`：将叶影从圆斑改为更像叶片的多边形轮廓（task001）
- `change009` — `layouts/_default/baseof.html, assets/js/main.js, assets/css/main.css`：新增 `window / blinds / canopy` 三种光影预设（task002）
- `change010` — `README.md`：补充 `shadow_style` 配置和 preset 说明（task005）
- `change011` — `assets/css/main.css, assets/js/main.js`：加深阴影对比，作为结构排查的临时探针（task001）

## phase-unified-dappled-layer-20260402
- `change001` — `spec_*`：更新 fixed overlay、body data 状态源与统一光影目标（task005）
- `change002` — `plan_*`：调整为 theme-switch 架构 + CSS-Tricks 效果的实现路径（task005）
- `change003` — `task_*`：更新任务口径与当前进展说明（task005）
- `change004` — `tech-refer_*`：明确 theme-switch 负责架构、CSS-Tricks 负责效果（task005）
- `change005` — `layouts/_default/baseof.html`：改为单一 `dappled-layer` overlay（task001）
- `change006` — `assets/js/main.js`：移除复杂投影生成器，回退为基础交互脚本（task001）
- `change007` — `assets/css/main.css`：新增 unified dappled layer 覆盖样式（task001）
- `change008` — `static/js/main.js`, `static/css/main.css`：同步静态资源（task001）
- `change009` — `README.md`：更新 unified dappled layer 文档（task005）
- `change010` — `layouts/partials/title-text.html`, `layouts/_default/list.html`, `layouts/_default/single.html`：给标题中的连续拉丁字母包独立 span（task006）
- `change011` — `layouts/partials/head.html`：引入 `Cormorant Garamond` 作为标题英文字体（task006）
- `change012` — `assets/css/main.css`：新增 `title-latin` 混排样式（task006）
- `change013` — `static/css/main.css`：同步标题混排样式到静态分发文件（task006）
- `change014` — `exampleSite/content/posts/waiting-for-ai.md`：新增 AI 混排标题示例文章（task006）
- `change015` — `layouts/_default/list.html`, `layouts/_default/single.html`, `layouts/partials/head.html`, `assets/css/main.css`, `static/css/main.css`：撤回标题拆 span 的方案，恢复原始文本渲染（task006）
- `change016` — `assets/css/main.css`, `static/css/main.css`：将标题字体栈的英文 fallback 调整为 `LXGW WenKai Mono Screen`（task006）
- `change017` — `assets/css/main.css`, `static/css/main.css`：将标题整行字体切换为 `LXGW WenKai Mono Screen`（task006）
- `change018` — `assets/css/main.css`, `static/css/main.css`：将标题和签名字号各下调一档（task006）

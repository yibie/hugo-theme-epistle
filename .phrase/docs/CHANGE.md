# Change Index

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

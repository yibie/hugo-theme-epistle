# Change Log — Phase: unified-dappled-layer-20260402

change023 日期:2026-08-02 | 文件:.phrase/docs/ISSUES.md,.phrase/phases/phase-unified-dappled-layer-20260402,.omx/state/typography/ralph-progress.json | 操作:Modify | 影响:task008 与 issue002 验收记录 | 说明:记录字体 CDN 404 根因、系统字体取舍、构建与 94 分视觉验收结果 | 关联:task008
change022 日期:2026-08-02 | 文件:static/css/main.css | 操作:Modify | 影响:正文、标题与落款字体栈 | 说明:让系统西文衬线字体与系统中文宋体分工混排，并将标题和落款收敛为系统楷体回退 | 关联:task008
change021 日期:2026-08-02 | 文件:layouts/partials/head.html | 操作:Modify | 影响:主题默认字体资源加载 | 说明:删除三条已失效的中文字体 CDN 引用，保留站点显式配置外部字体的兼容入口 | 关联:task008
change020 日期:2026-08-02 | 文件:/Users/chenyibin/Documents/blog/.github/workflows/deploy.yml | 操作:Modify | 影响:生产博客主题固定版本 | 说明:将生产部署固定到主题修复提交 2d8aa2c，博客提交 34df588 的 Actions 构建和线上 CDP 验证通过 | 关联:task007
change019 日期:2026-08-02 | 文件:static/css/main.css | 操作:Modify | 影响:统一光影颗粒层 | 说明:删除覆盖全 viewport 的 dappledNoise 离散位移动画及其废弃 keyframes，保留静态纸纹和连续树影动画 | 关联:task007
change001 日期:2026-04-02 | 文件:.phrase/phases/phase-unified-dappled-layer-20260402/spec_unified-dappled-layer_20260402.md | 操作:Modify | 影响:阶段目标与验收口径 | 说明:根据 CSS-Tricks 与 theme-switch 的最新结论，补充 fixed overlay、body data 状态源和 unified layer 目标 | 关联:task005
change002 日期:2026-04-02 | 文件:.phrase/phases/phase-unified-dappled-layer-20260402/plan_unified-dappled-layer_20260402.md | 操作:Modify | 影响:实施路径 | 说明:将阶段计划调整为先收敛架构，再实现 unified layer，并尽量移除非必要 JS | 关联:task005
change003 日期:2026-04-02 | 文件:.phrase/phases/phase-unified-dappled-layer-20260402/task_unified-dappled-layer_20260402.md | 操作:Modify | 影响:任务口径 | 说明:更新任务表述以反映 body data 驱动、参考来源分工和当前进展说明 | 关联:task005
change004 日期:2026-04-02 | 文件:.phrase/phases/phase-unified-dappled-layer-20260402/tech-refer_unified-dappled-layer_20260402.md | 操作:Modify | 影响:技术取舍 | 说明:明确 CSS-Tricks 负责效果方法、theme-switch 负责架构方法，并弱化多 preset 路线 | 关联:task005
change005 日期:2026-04-02 | 文件:layouts/_default/baseof.html | 操作:Modify | 影响:统一光影层 DOM | 说明:移除 sunlight scene 与 debug/shadow-style 结构，改为单一 dappled-layer fixed overlay | 关联:task001
change006 日期:2026-04-02 | 文件:assets/js/main.js | 操作:Modify | 影响:前端交互脚本 | 说明:删除复杂投影生成器并回退为仅保留侧边栏与归档交互，收敛实现复杂度 | 关联:task001
change007 日期:2026-04-02 | 文件:assets/css/main.css | 操作:Modify | 影响:统一光影样式系统 | 说明:新增 unified dappled layer 覆盖样式，用少量大 shape、单层 overlay 和半透明纸面替代双系统实现 | 关联:task001
change008 日期:2026-04-02 | 文件:static/js/main.js,static/css/main.css | 操作:Modify | 影响:发布用静态资源 | 说明:同步 unified dappled layer 的 JS/CSS 到静态分发文件 | 关联:task001
change009 日期:2026-04-02 | 文件:README.md | 操作:Modify | 影响:Dappled Light 文档 | 说明:移除 shadow_style/preset 叙述，更新为单一 unified dappled layer 与最新分层说明 | 关联:task005
change010 日期:2026-04-06 | 文件:layouts/partials/title-text.html,layouts/_default/list.html,layouts/_default/single.html | 操作:Add | 影响:标题渲染 | 说明:为中文标题中的连续拉丁字母输出独立 span，供英文标题片段单独使用字体 | 关联:task006
change011 日期:2026-04-06 | 文件:layouts/partials/head.html | 操作:Modify | 影响:字体资源加载 | 说明:引入 Cormorant Garamond 作为标题中的英文字体 | 关联:task006
change012 日期:2026-04-06 | 文件:assets/css/main.css | 操作:Modify | 影响:标题与导航标题样式 | 说明:新增 title-latin 字体变量与混排样式，压低英文片段的体量和字距 | 关联:task006
change013 日期:2026-04-06 | 文件:static/css/main.css | 操作:Modify | 影响:静态分发样式 | 说明:同步标题混排的 CSS 到静态分发文件 | 关联:task006
change014 日期:2026-04-06 | 文件:exampleSite/content/posts/waiting-for-ai.md | 操作:Add | 影响:示例站内容 | 说明:新增含 AI 混排标题的示例文章用于构建验证 | 关联:task006
change015 日期:2026-04-06 | 文件:layouts/_default/list.html,layouts/_default/single.html,layouts/partials/head.html,assets/css/main.css,static/css/main.css | 操作:Modify | 影响:标题渲染与字体加载 | 说明:移除标题中英文拆 span 的方案，回退为原始文本渲染并删除对应字体与样式 | 关联:task006
change016 日期:2026-04-06 | 文件:assets/css/main.css,static/css/main.css | 操作:Modify | 影响:标题字体栈 | 说明:将标题字体的拉丁 fallback 调整为 LXGW WenKai Mono Screen，避免英文回落到不协调的默认西文字体 | 关联:task006
change017 日期:2026-04-06 | 文件:assets/css/main.css,static/css/main.css | 操作:Modify | 影响:标题字体 | 说明:将标题整行字体切换为 LXGW WenKai Mono Screen，避免特殊标题字形在中英混排时失衡 | 关联:task006
change018 日期:2026-04-06 | 文件:assets/css/main.css,static/css/main.css | 操作:Modify | 影响:标题与签名字号 | 说明:将标题和署名字号各下调一档，使页面更收敛 | 关联:task006

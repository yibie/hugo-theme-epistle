# Task List — Phase: unified-dappled-layer-20260402

task001 [ ] 场景:访客打开首页时看到背景与信纸共享同一片斑驳光影 | Given:站点启用 unified dappled layer | When:打开首页 | Then:背景与信纸上的投影方向、形状和气质一致+不再像两套不同特效 | 验证:exampleSite 首页手动检查 + 构建验证

task002 [ ] 场景:访客阅读文章时信纸自然承接同源光影 | Given:文章页启用了 unified dappled layer 且使用 body `data-*` 驱动主题 token | When:打开 warm/spring/night 文章页 | Then:信纸上的影子看起来是背景投影透过纸面材质后的延续+正文仍然清晰 | 验证:手动比对至少 3 篇示例文章

task003 [x] 场景:维护者关闭 dappledLight 时页面回退正常 | Given:`params.dappledLight = false` | When:构建或访问页面 | Then:统一光影层完全关闭+页面恢复普通信纸 | 验证:切换配置后构建结果检查

task004 [ ] 场景:低动效或低能力环境下统一光影仍可接受 | Given:系统命中 `prefers-reduced-motion` 或某些混合/模糊能力不足 | When:打开页面 | Then:统一光影层被弱化或静态化+不会严重破坏阅读体验 | 验证:浏览器模拟 + 手动检查

task005 [x] 场景:主题维护者理解 unified dappled layer 的原理与边界 | Given:维护者阅读 README 或 phase 文档 | When:查看实现说明 | Then:能理解为何要统一为单层、CSS-Tricks 提供了什么效果方法、theme-switch 提供了什么架构方法、如何关闭和验证 | 验证:文档审阅
task006 [x] 场景:读者阅读含 AI 等英文片段的中文标题时不再感到字形脱节 | Given:文章标题同时包含中文与连续拉丁字母 | When:打开首页、文章页或上一封下一封导航 | Then:英文片段使用单独的 serif 字体并与中文标题保持更平顺的视觉关系 | 验证:exampleSite 构建输出检查 + 手动检查

> 当前进展（2026-04-06）：已将当前阶段文档更新为“theme-switch 架构 + CSS-Tricks 效果”的最新结论；代码已收敛为单一 `dappled-layer` fixed overlay，移除 `paper-light` 与 `shadow_style` 路线，`assets/js/main.js` 回退为仅保留基础交互逻辑。`hugo --source exampleSite --themesDir ../.. --destination /tmp/epistle_build` 构建通过，并已验证 `dappledLight = false` 时输出 `data-dappled="off"`。另外，标题中的连续拉丁字母现已通过 `title-text` partial 包装为独立 span，并在 CSS 中使用单独的 `Cormorant Garamond` 字体栈处理。task001 / task002 / task004 待人工视觉验收后勾选。

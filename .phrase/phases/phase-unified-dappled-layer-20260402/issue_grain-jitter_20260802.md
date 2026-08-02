# issue001：全屏颗粒层离散位移造成页面周期性视觉抖动

## 环境与复现

- 线上页面：`https://www.gtdstudy.com/`
- 桌面 Chrome，1200 × 800 viewport
- 打开首页并静置观察，背景会周期性出现整页“抖一下”的错觉。

## 根因

`.dappled-layer__grain` 覆盖整个 fixed viewport，并运行 `dappledNoise 2.2s steps(2) infinite`。离散 timing function 让纹理在多个 `translate3d` 位置间突跳；实测 3 秒内变化 15 次，最大相邻位移约 31.5px。正文、信纸、viewport 宽度保持稳定，Performance Trace CLS 为 0.00，因此不是字体、Turnstile 或真实布局偏移。

## 修复

将颗粒层保持静态，删除其动画；保留 `dappledDrift`、树影和垂枝的连续动画。删除不再使用的 `dappledNoise` keyframes，避免死代码重新被误用。

## 验证

- 临时浏览器覆盖已由用户确认视觉可接受。
- 源码 visual-verdict：99/100，信纸、排版、颜色、树影与光线保持不变。
- 主题 18 项测试、示例站和真实博客 Hugo 0.164.0 构建通过。
- 线上 `main.css?v=1785675629` 不含 `dappledNoise` 或 `steps(2)`；颗粒层 `animation-name: none`、`transform: none`、CLS 维持 0.00，连续树影动画仍运行。
- 主题修复提交 `2d8aa2c`；博客部署提交 `34df588`；GitHub Actions run `30749009343` 成功。

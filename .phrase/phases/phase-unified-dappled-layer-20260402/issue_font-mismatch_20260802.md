# issue002：中文字体 CDN 失效导致正文中英文混排失衡

## 环境与复现

- 真实博客文章包含“30 WPM”“60 WPM”等中英文混排正文。
- 中文笔画偏轻，拉丁字母和数字更黑、更紧，混排时字形不属于同一套视觉系统。

## 已知证据

- 正文声明 `Source Han Serif CN VF`，但主题默认加载的三条 `chinese-fonts-cdn.deno.dev` 样式请求均返回 404。
- 浏览器因此回退到设备字体，不同操作系统会得到不同的中英文字形组合。

## 修复方向

删除主题默认的中文字体 CDN 引用。正文显式采用系统西文衬线字体到系统中文宋体的回退顺序；标题和落款使用系统楷体回退，不新增字体文件或第三方依赖。

## 验证

- `npm test`：18 项测试通过。
- `npm run test:hugo`：示例站构建与产物断言通过。
- Hugo 0.164.0 真实博客构建通过；产物不含 `chinese-fonts-cdn`、`SourceHanSerifCN` 或 `LXGWWenKaiMonoScreen`。
- 浏览器最终正文栈以 `Iowan Old Style`、`Palatino Linotype` 开始并回退到系统宋体；重载后的请求中没有中文字体 CDN。
- 前后截图 visual-verdict：94/100，通过。

# 赫蹏 (Heti) 中文排版深度指南

> 赫蹏（hè tí），古代称用以书写的小幅绢帛。后亦以借指纸。

Epistle 主题集成了 [赫蹏 CSS](https://sivan.github.io/heti/)，这是一套专为中文网页设计的排版样式增强库。

---

## 当前已启用

### 基础排版
- `heti heti--serif` - 宋体/衬线排版（正文区域）
- `heti-addon.min.js` - 自动中西文混排空格 + 标点挤压

---

## 可增强的排版特性

### 1. 古文版式 `heti--ancient`

适合古典散文、笔记、书信。

**使用方法：**
```markdown
---
letter_style: "warm"
heti_class: "heti--ancient"
---

正文内容...
```

**效果特点：**
- 首行缩进两格
- 段间距加大
- 更符合古籍阅读习惯

---

### 2. 诗词版式 `heti--poetry`

适合诗歌、词曲排版。

**使用方法：**
```markdown
---
letter_style: "sky"
heti_class: "heti--poetry"
---

## 静夜思<span class="heti-meta heti-small">[唐]李白</span>

<p class="heti-x-large">
床前明月光<span class="heti-hang">，</span><br>
疑是地上霜<span class="heti-hang">。</span><br>
举头望明月<span class="heti-hang">，</span><br>
低头思故乡<span class="heti-hang">。</span>
</p>
```

**关键类名：**
| 类名 | 作用 |
|------|------|
| `heti-meta` | 元信息（作者、朝代） |
| `heti-small` | 小字 |
| `heti-hang` | 标点悬挂（逗号、句号悬于行外） |
| `heti-x-large` | 加大字号 |

---

### 3. 行间注 `heti--annotation`

适合注音、训诂、双行小字注释。

**使用方法：**
```markdown
---
heti_class: "heti--annotation"
---

<p>吾生也有涯，而知也无涯。<ruby>缘督<rt>yuan du</rt></ruby>以为经。</p>
```

**HTML 标签：**
```html
<ruby>汉字<rt>zhu yin</rt></ruby>
```

---

### 4. 竖排排版 `heti--vertical`

传统直排，从右至左阅读。

**使用方法：**
```markdown
---
letter_style: "warm"
heti_class: "heti--vertical"
---
```

**效果：**
- 文字纵向排列
- 行从右向左推进
- 适合古诗词、书法作品

---

### 5. 多栏排版

适合短文、语录、金句集。

**类名：**
| 类名 | 说明 |
|------|------|
| `heti--columns-2` | 双栏 |
| `heti--columns-3` | 三栏 |
| `heti--columns-4` | 四栏 |
| `heti--columns-24em` | 每栏24字符宽 |

**使用：**
```markdown
<div class="heti heti--columns-2">

第一栏内容...

第二栏内容...

</div>
```

---

### 6. 字体族切换

| 类名 | 字体风格 | 适用场景 |
|------|----------|----------|
| `heti--sans` | 黑体（无衬线） | 现代、科技、资讯 |
| `heti--serif` | 宋体（衬线） | 正文、小说、散文 |
| `heti--classic` | 传统（楷体标题） | 古籍、文化、历史 |

---

## 内联文本增强

### 着重号
```markdown
我们<span class="heti-em">必将</span>战胜困难。
```
效果：我们**必将**战胜困难。（下加点）

### 专名号
```markdown
<u title="位于山东省">景阳冈</u>的<u>武松</u>
```
效果：景阳冈的武松（下划线）

### 文本标记
```markdown
这道题<mark>必考</mark>，你们爱记不记。
```
效果：这道题==必考==，你们爱记不记。

### 引号
赫蹏默认使用直角引号（「」），符合中文排版习惯：
```markdown
他说：<q>打工是不可能打工的。</q>
```
效果：他说：「打工是不可能打工的。」

---

## 在 Epistle 中启用

### 方案一：Front Matter 指定

修改 `layouts/_default/single.html`，读取 front matter 中的 `heti_class`：

```html
<article class="letter heti {{ .Params.heti_class | default "heti--serif" }}" id="top">
```

然后在文章中指定：
```yaml
---
heti_class: "heti--ancient"
---
```

### 方案二：按文章类型自动切换

```html
{{ if eq .Params.type "poetry" }}
  <article class="letter heti heti--poetry">
{{ else if eq .Params.type "ancient" }}
  <article class="letter heti heti--ancient">
{{ else }}
  <article class="letter heti heti--serif">
{{ end }}
```

### 方案三：短代码（Shortcode）

创建 `layouts/shortcodes/poem.html`：
```html
<div class="heti heti--poetry">
  {{ .Inner }}
</div>
```

使用：
```markdown
{{< poem >}}
## 春晓<span class="heti-meta heti-small">[唐]孟浩然</span>

春眠不觉晓...
{{< /poem >}}
```

---

## 进阶：结合信纸主题

不同信纸风格配合不同赫蹏版式：

| 信纸主题 | 推荐赫蹏版式 | 氛围 |
|----------|--------------|------|
| `default`（白纸蓝墨） | `heti--serif` | 正式书信 |
| `warm`（暖笺） | `heti--classic` | 传统手札 |
| `sky`（晴空） | `heti--poetry` | 诗意信笺 |
| `night`（夜信） | `heti--ancient` | 深夜随笔 |
| `spring`（春笺） | `heti--poetry` | 春意盎然 |

---

## 参考

- [赫蹏官方文档](https://sivan.github.io/heti/)
- [中文排版需求 (W3C)](https://www.w3.org/TR/clreq/)
- 《GB/T 15834-2011 标点符号用法》

---
title: "赫蹏排版示范"
date: 2026-03-05T14:00:00+08:00
draft: false
letter_style: "default"
salutation: "亲爱的排版爱好者："
postscript: "以上展示了赫蹏的部分排版能力，更多用法请参考文档。"
heti_class: "heti--serif"
---

这封信展示赫蹏（Heti）CSS 的中文排版增强能力。

## 着重号

在正文中，我们可以使用<mark>标记</mark>来高亮重要内容，或者使用<span class="heti-em">着重号</span>（下加点）来表示特别强调。

## 专名标注

比如<u title="中华人民共和国首都">北京</u>的<u>故宫</u>，使用专名号表示特定名称。

## 引号

赫蹏会自动将半角引号转换为直角引号：「今天天气真好！」

## 中西文混排

中英文混排时，不需要手动敲空格：Hugo是最流行的静态网站生成器之一，它使用Go语言编写，速度极快。Hello World程序是每个人的编程入门第一课。

---

## 诗词排版

使用 `heti--poetry` 类实现诗词居中排版：

<div class="heti--poetry">

<h3>赠汪伦<span class="heti-meta heti-small">[唐]李白</span></h3>

<p class="heti-x-large">
李白乘舟将欲行<span class="heti-hang">，</span><br>
忽闻岸上踏歌声<span class="heti-hang">。</span><br>
桃花潭水深千尺<span class="heti-hang">，</span><br>
不及汪伦送我情<span class="heti-hang">。</span>
</p>

</div>

**诗词排版说明：**
- 使用 `heti-x-large` 加大字号
- 使用 `heti-hang` 实现标点悬挂（逗号、句号悬于行末外侧）
- 使用 `heti-meta` + `heti-small` 标注作者信息
- 使用 `heti--poetry` 类使内容居中

---

## 行间注（注音）

在 `heti--annotation` 容器中，使用 `<ruby>` 标签实现行间注：

<div class="heti--annotation">

<p>大学之道，在明明德，在<ruby>亲民<rt>xīn mín</rt></ruby>，在止于至善。</p>

<p>知<ruby>止<rt>zhǐ</rt></ruby>而后有定，定而后能静，静而后能安。</p>

</div>

---

## 古文版式

使用 `heti--ancient` 类实现古籍排版效果，首行缩进两格，更符合传统阅读习惯：

<div class="heti--ancient">

<p>先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。然侍卫之臣不懈于内，忠志之士忘身于外者，盖追先帝之殊遇，欲报之于陛下也。</p>

<p>诚宜开张圣听，以光先帝遗德，恢弘志士之气，不宜妄自菲薄，引喻失义，以塞忠谏之路也。</p>

</div>

---

## 技术术语

HTML中的<dfn>ruby</dfn>元素可以用来标注注音或注释。<abbr title="Cascading Style Sheets">CSS</abbr>则负责样式呈现。

行内代码如<code>hugo server -D</code>也会自动美化。

文本更新示例：因为谁也不认识，所以最后我们决定念<del>dí</del><ins>tí</ins>。

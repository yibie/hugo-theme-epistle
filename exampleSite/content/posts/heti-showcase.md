---
title: "Heti 排版功能展示"
date: 2026-02-01T10:00:00+08:00
draft: false
letter_style: "default"
salutation: "亲爱的读者，"
postscript: "以上便是 Heti 在行文中的主要用法，希望对你有所帮助。"
---

这篇文章展示在普通书信行文中如何调用 Heti 的排版能力。Heti 的大部分增强是**自动生效**的，无需任何标记——中西文混排间距、标点挤压、网格对齐，都由 JS 和 CSS 在后台处理。

需要主动标记的，只有下面几类场景。

<!--more-->

---

## 一、自动生效的能力（无需任何操作）

写作时正常书写即可，以下效果自动触发：

- **中英混排间距**：文字中夹杂English单词时，Heti 自动在中英之间插入¼字宽间距
- **标点挤压**：连续标点「，」「。」「、」自动压缩为正常视觉间距
- **网格对齐**：所有文字贴合字体基线网格排列
- **全角引号**：中文语境下自动使用「直角引号」

---

## 二、行内元信息（来源、注释）

引用他人文字时，用 `meta` shortcode 标注出处：

> 花自飘零水自流，一种相思，两处闲愁。{{< meta >}}[宋]李清照《一剪梅》{{< /meta >}}

也可以直接写原生 HTML：

这是一段引用。<span class="heti-meta heti-small">——出自某处</span>

---

## 三、文字大小调节

行文中偶尔需要强调某个词，可用 `size` shortcode：

这句话里有{{< size "large" >}}需要强调{{< /size >}}的部分，也有{{< size "small" >}}补充说明的小字{{< /size >}}。

字号可选值：`x-large`、`large`（默认）、`small`、`x-small`。

---

## 四、嵌入诗词块

信中引用诗词，用 `verse` shortcode 创建居中的诗词版式：

{{< verse title="九月九日忆山东兄弟" author="王维" dynasty="唐" >}}
独在异乡为异客{{< hang >}}，{{< /hang >}}
每逢佳节倍思亲{{< hang >}}。{{< /hang >}}
遥知兄弟登高处{{< hang >}}，{{< /hang >}}
遍插茱萸少一人{{< hang >}}。{{< /hang >}}
{{< /verse >}}

`heti-hang` 使末尾标点悬挂于行外，避免右侧视觉不齐整。

---

## 五、嵌入古文块

引用文言文段落，用 `ancient` shortcode：

{{< ancient title="岳阳楼记（节选）" author="范仲淹" >}}
庆历四年春，滕子京谪守巴陵郡。越明年，政通人和，百废具兴，乃重修岳阳楼，增其旧制，刻唐贤今人诗赋于其上，属予作文以记之。
{{< /ancient >}}

---

## 六、嵌入注音块

需要为生僻字或专有名词注音时，用 `ruby` shortcode（行内使用）：

「{{< ruby text="赫蹏" ruby="hètí" >}}」是这个主题 CSS 库的名字，取自汉代典籍。

也可以在 `annotation` 块里集中处理含注音的段落：

{{< annotation >}}
<p>春眠不觉晓，<ruby>处<rp>（</rp><rt>chù</rt><rp>）</rp></ruby>处闻啼鸟。</p>
{{< /annotation >}}

---

## 七、多栏排版

适合较长的列举或并列内容：

{{< columns n="2" >}}
**左栏内容**

这里是第一栏的文字，适合两个对比主题并排展示。

**右栏内容**

这里是第二栏的文字，读者可以左右对照阅读。
{{< /columns >}}

---

## 八、跳过 Heti 处理

某些代码、外文段落不需要 Heti 干预，用 `heti-skip` 类：

<p class="heti-skip">This paragraph contains English-only content that should not be processed by Heti's CJK spacing rules.</p>

---

## 九、Markdown 块级属性（直接附加类名）

开启 `markup.goldmark.parser.attribute.block = true` 后，可直接在 Markdown 块后附加类：

这是一段需要放大显示的重要话语。
{.heti-x-large}

> 引用块可以这样加元信息样式。
{.heti-meta}

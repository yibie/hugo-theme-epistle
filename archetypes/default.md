---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: false
letter_style: ""     # default | warm | sky | night | spring
salutation: ""       # 称谓，如「亲爱的读者，」，留空则不显示
postscript: ""       # P.S. 附言，留空则不显示
heti_font: ""        # 字体预设：serif（默认）| sans（黑体）| traditional（楷体）
heti_mode: ""        # 排版模式：留空（普通）| ancient（古文）| poetry（诗词）| annotation（行间注）| vertical（竖排）| columns-2（双栏）| columns-3（三栏）
---

<!--more-->

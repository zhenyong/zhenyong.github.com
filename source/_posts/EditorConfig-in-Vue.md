---
title: EditorConfig in Vue
date: 2016-07-03 17:23:26
thumbnail: http://editorconfig.org/logo.png
categories: tech
tags: [vue]
---

> EditorConfig 可以帮助开发者在不同的编辑器和IDE之间定义和维护一致的代码风格

<!--more-->

某些编辑器使用 EditorConfig 则需要安装对应的插件，Sublime Text 的话就安装 EditorConfig 

源码中的配置文件 `.editorconfig`

```
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

解释一下这份配置的意思:

- `root = true`

当打开一个文件时，EditorConfig 插件在文件的目录和其每一级父目录查找 .editorconfig 文件，直到有一个配置文件包含 root = true

EditorConfig 配置文件从上往下读取，并且路径最近的文件最后被读取，匹配到的配置按照读取顺序应用在代码上，最接近代码文件的属性优先级最高

- `[*]`
表示对所有文件文件使用 editorconfig，也可以指定某种文件格式

- `charset = utf-8`

设置文件编码格式为 utf-8

- `indent_style = space`

所有的缩进使用空格，包括 tab 键产生的空白

- `indent_size = 2`

设置整数表示规定每级缩进的列数

- `end_of_line = lf`

统一设置换行符，不同操作系统默认使用不同的换行符

windows 是 crlf，即 `\r\n`

unix 则是 lf ，即 `\n`

- `insert_final_newline = true`

文件都以一个空白行结尾

- `trim_trailing_whitespace = true`

除去换行行首的任意空白字符

---
参考：

- [官网](http://editorconfig.org/)
- [EditorConfig介绍（译）](http://www.alloyteam.com/2014/12/editor-config/)



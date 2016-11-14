---
title: 开始折腾 Atom
date: 2016-08-03 13:05:49
tags:
	- Atom
---

> Atom 是 Github 出品，基于 Electron 开发的跨平台编辑器。

之前是 Sublime 重度使用者，因为 React Native 出了个只支持 Atom 的插件，于是开始折腾 Atom，以前没用是因为它太慢了，一个月卸三次装三次，目前 1.9 版本性能提升了好多，插件都是基于 JS，目前插件数量跟 Sublime 的差不多，毕竟是基于浏览器，使用的技术都是前端熟悉的。

那么，从更换主题开始吧...

<!--more-->

## 更换主题

下面是原来 Sublime 使用的界面主题和语法颜色，很高大上：

```
"theme": "Material-Theme.sublime-theme",
"color_scheme": "Packages/User/SublimeLinter/Oceanic Next (SL).tmTheme"
```

在 Atom 中安装界面主题 [material-ui](https://atom.io/themes/material-ui) 和语法颜色 [oceanic-next](https://atom.io/themes/oceanic-next)，文档说的很详细

## 修改主题

使用了上面的主题和颜色后，发现编辑区的背景颜色跟 sublime 用的不一样，因为 Atom 本质上是个 Chrome 浏览，第一个想法就是调出控制台 (alt+cmd+i)，查看这个节点 `atom-text-editor` 的样式 ，接着按照 [material-ui](https://atom.io/themes/material-ui) 的文档修改主题：

```
// styles/editor.less
atom-text-editor {
	// 注释掉这行就好了
  // background: @level-3-color;

  ...
}
```

如果擅长前端的童鞋用 Atom 上手会很高效，这玩意就是个浏览器，^_^ ！

## 插件们

- [EditorConfig](https://github.com/sindresorhus/atom-editorconfig)

	Atom 内置 `whitespace` 插件会『覆盖』掉 EditorConfig 配置，导致 `trim_trailing_whitespace` 和 `insert_final_newline` 在 `.editorconfig` 中无效，参考 [github issue](https://github.com/sindresorhus/atom-editorconfig/issues/3)
	(##2016-08-03##)

- Markdown

	+ [`markdown-previwe`](https://github.com/atom/markdown-preview)

	内置的 `markdown-previwe` 很好用，（shift+ctrl+m）打开实时预览，还能设置 github 的样式，很酷

	+ [`markdown-scroll-sync`](https://github.com/mark-hahn/markdown-scroll-sync)

	让预览视图随着编辑光标位置滚动，滚的很准！

- [Linter](https://atom.io/packages/linter)

	错误提示的 UI 做的真好

	+ [linter-eslint](https://atom.io/packages/linter-eslint)

	+ [linter-flow](https://atom.io/packages/linter-flow)

		如果安装了 `nuclide` 会引发配置错误提示，参考[这里](https://github.com/facebook/nuclide/issues/387)
		问题不大，但是每次出现很烦，所以 Disable `linter-flow`，反正 `nuclide` 本身有 `nuclide-flow` 支持 Flow 检测

- [hyperclick](https://atom.io/packages/hyperclick)

	点击文本跳转的基础，支持各类扩展跳转，如安装 `js-hyperclick` 插件支持变量定义跳转等

	+ [js-hyperclick](https://atom.io/packages/js-hyperclick)

	JS 点击变量跳转到定义处...强大到远超我想像

- [atom-ternjs](https://atom.io/packages/atom-ternjs)

	代码智能提示，还支持 ES6，它是会扫描代码作分析的，快赶上 IDE了。

- [highlight-selected](https://atom.io/packages/highlight-selected)

	选中文本后，高亮其他相同文本，双击变量最实用

- [autocomplete-paths](https://atom.io/packages/autocomplete-paths)

	require、src 等路径提示

- [docblockr](https://atom.io/packages/docblockr)

	愉快的写注释文档，包括方法等...

- [regex-railroad-diagram](https://atom.io/packages/regex-railroad-diagram)

	选中正则之后，展示可视化的匹配路径，酷~

- [file-icons](https://link.zhihu.com/?target=https%3A//atom.io/packages/file-icons)

	导航区文件图标，图标齐全好看

- [emmet](https://atom.io/packages/emmet)

	手写 HTML 的神器，有个快捷键会跟 markdown preview 冲突，参考[这里](https://discuss.atom.io/t/keyboard-shortcut-overriding-emmet-and-markdown-preview/14113/7)

- [local-history](https://atom.io/packages/local-history)

	本地记录文件历史

- [pigments](https://atom.io/packages/pigments)

	颜色相关工具，包括：把`rgb(x,x,x)`背景色变成相应颜色，选色...牛

- [atom-beautify](https://atom.io/packages/atom-beautify)

	代码格式化，支持巨多语言

- [auto-update-packages](https://atom.io/packages/auto-update-packages)

	自动更新插件，虽然设置里面点一下就可以，但是自动不更好吗

- [git-projects](https://atom.io/packages/git-projects)

	快速打开本地 git 项目，省得切换一次命令行

- [minimap](https://atom.io/packages/minimap)

	像 Sublime 那样在右侧有个全景代码小图，支持很多扩展

- [language-babel](https://atom.io/packages/language-babel)

	语法支持 ES6、JSX、Flow ...，还支持预览 babel 或 react 编译结果

- (nuclide)[https://atom.io/packages/nuclide]

	帮助开发 ReactNative、Flow 相关项目，装完感觉更像 IDE

	nuclide 的 tree-view 覆盖原来的，所有原来 tree-view 上 git 状态颜色就看不到，参考[这里](https://github.com/facebook/nuclide/issues/260)，不用 nuclide 的 tree-view，
	同时也失去它的 remote file sync 等功能

- (open-recent)[https://atom.io/packages/open-recent]

	像 Sublime 的 File -> Open Recent，搞不懂为啥不内置

- (react)[https://atom.io/packages/react]

	JSX 语法高亮、格式化...最喜欢的事 HTML->JSX

- (term3)[https://atom.io/packages/term3]

	终端

- (todo-show)[https://atom.io/packages/todo-show]

	找出所有 `// TODO`

- (tool-bar)[https://atom.io/packages/tool-bar]

	让 Atom 支持 toolbar，需要安装其他扩展插件

- (Advanced Open File)[https://atom.io/packages/advanced-open-file]

	快速打开硬盘上某个文件，如果不存在则创建，支持相对项目路径，创建多个文件，真方便

- (keybinding-resolver)[https://atom.io/packages/keybinding-resolver]

	查看快捷键对应哪些命令，命令冲突时最好用了

- Git

	+ (git-plus)[https://atom.io/packages/git-plus]

	便捷 git 操作

	+ (merge-conflicts)[https://atom.io/packages/merge-conflicts]

	merge 冲突的时候，用上它方便逐个修改冲突

- (source-preview)[https://atom.io/packages/source-preview]

	转化后的代码预览，是一个基础插件，需要配合其他 provider 插件

## 疑难杂症

- 安装插件速度慢

	在 `~/.atom/.apmrc` 配置 npm 镜像

	```
	registry = https://registry.npm.taobao.org
	```

	或者命令行

	```
	apm config set registry https://registry.npm.taobao.org
	```

---
title: Flow in Vue
date: 2016-07-06 13:07:31
tags:
---

> Facebook 出品的 JS 静态类型检查器

JS 相关的静态检测，一般人都会想到 Typescript， 配合微软的 Code 编辑器，杠杠的，为何 vue 选用 Flow 呢，作者在知乎作了 [回答](http://www.zhihu.com/question/46397274)

[Flow 官网](https://flowtype.org/)

<!--more-->

## Flow 简单体验

### 安装

mac 用户：

```
brew install flow
```

然后命令行敲 flow，如果没有反应大概是 brew link 失败了，重新 link 一次就好了

linux 用户通过 npm 安装 `flow-bin` （全局方便点）

windows 用户目前要使用非官方 build 的版本，[这里](http://www.ocamlpro.com/pub/ocpwin/flow-builds/)

### 配置

在项目根目录创建 `.flowconfig` 空白文件，让 flow 知道这个目录下的文件可以用 flow 检测，当然还可以通过这个文件配置一些规则

### 运行

创建一个 `hello.js`，第一行 `/* @flow */` 表明这个文件需要检测

```
/* @flow */

function foo(x) {
  return x * 10;
}

foo("Hello, world!")
```

在跟目录下，执行命令

```
flow check
```

控制台输出

```
7: foo("Hello, world!")
     ^^^^^^^^^^^^^^^^^^^^ function call
  4:   return x * 10;
              ^ string. This type is incompatible with
  4:   return x * 10;
              ^^^^^^ number
```

这里检测到 `foo` 方法的参数 `x` 应该是数字类型，代码中使用了字符串 `"Hello, world!"` 作为参数就会报错

### 更多

基本上 Typescript 你能用到的 Flow 都有，例如指定变量类型、函数返回值类型、自定义对象元类型... 参考 [官方文档](https://flowtype.org/docs/getting-started.html#_)

## 编辑器实时检测

通常都不会手动执行命令，结合编辑器实时监测，跟之前介绍的 `eslint` linter 差不多，sublime 安装

- `SublimeLinter` [安装指南](http://sublimelinter.readthedocs.org/en/latest/installation.html)
- `SublimeLinter-flow`[安装指南](https://github.com/SublimeLinter/SublimeLinter-flow)

效果：

![](http://ww1.sinaimg.cn/mw690/68ef88dajw1f5nvq1917aj20bc04a0t0.jpg)

## Flow in Vue

// TODO

---
title: Flow in Vue
date: 2016-07-06 13:07:31
tags:
  - flow
---

> Facebook 出品的 JS 静态类型检查器

JS 相关的静态检测，一般人都会想到 Typescript， 配合微软的 Code 编辑器，杠杠的，为何 vue 选用 Flow 呢，作者在知乎作了 [回答](http://www.zhihu.com/question/46397274)

[Flow 官网](https://flowtype.org/)

[Flow 官网](http://zhenyong.site/flowtype)（中文）

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

### .flowconfig 配置文件

```
[ignore]
.*/node_modules/.*
.*/test/.*
.*/build/.*
.*/examples/.*
.*/benchmarks/.*

[include]

[libs]
flow

[options]
module.name_mapper='^compiler/\(.*\)$' -> '<PROJECT_ROOT>/src/compiler/\1'
module.name_mapper='^core/\(.*\)$' -> '<PROJECT_ROOT>/src/core/\1'
module.name_mapper='^shared/\(.*\)$' -> '<PROJECT_ROOT>/src/shared/\1'
module.name_mapper='^web/\(.*\)$' -> '<PROJECT_ROOT>/src/platforms/web/\1'
module.name_mapper='^server/\(.*\)$' -> '<PROJECT_ROOT>/src/server/\1'
module.name_mapper='^entries/\(.*\)$' -> '<PROJECT_ROOT>/src/entries/\1'
module.name_mapper='^sfc/\(.*\)$' -> '<PROJECT_ROOT>/src/sfc/\1'
```

解释下各个配置意思

- `ignore`：表示该以下匹配到的文件夹都不需要检测
- `include`：这里是空白，默认所有文件，如果检测项目根目录以外就要罗列在这里
- `libs`: 表示使用目录 /flow 下的接口定义文件
- `options`: 第一行配置的效果是，当`require('compiler/xx/yy')` 时把加载路径重定向到 `项目路径/src/compiler/xx/yy`

### 接口类型文件

回一下 Java 或者其它强类型 OO 语言，当你调用类中没定义的方法时，或者调用方法的参数个数不对时，IDE就会提醒，那么接口类型文件就有点这个意思，让你的类也有这么一个规则文件可以用来校验开发者的代码，举个例子：

```
// /flow/component.js

declare interface Component {
  // constructor information
  static cid: number
	...省略...
  $data: Object;
  $options: ComponentOptions;
...省略...
	}
```

`Component` 是 vue 内部一个类，通过这个接口类型文件表明组件类有哪些成员，哪些静态属性等等，特别要看到 `ComponentOptions `，这对应到另一个接口类型。

通过这种接口类型，某种意义上，你就有了强类型 OO 语言写代码的一些优点。

当然 vue 的类型文件远不止这用到这点点，更多细节就不一一介绍

语法部分请参照[Flow 官网](https://flowtype.org/)或者我翻译的[中文网站](http://zhenyong.site/flowtype)

至于 vue 为什么选用 flow 而不用相对流行的 TypeScript，参考他的知乎回答 [Vue 2.0 为什么选用 Flow 进行静态代码检查而不是直接使用 TypeScript?](http://www.zhihu.com/question/46397274)。

而我个人也觉得 Flow 有些很实用的场景，例如你无需学习成本，就能用上他的智能检测，解决 null 相关的潜在问题。
---
title: Babel in Vue
date: 2016-07-04 10:36:26
thumbnail: https://babeljs.io/images/logo.svg
categories: "tech"
tags: [vue]
---

> Babel 是一个 JavaScript 编译器

Vue 的所有模块代码都是用了 ES6 的语法，可是大多数浏览器对 ES6 支持不够，所以需要先把源码（ES6）转化为浏览器能够识别执行的代码（ES5），而这个过程就需要用到 `Babel` 这个工具

<!--more-->

## 简单例子

对照 Babel 的 [官网](https://babeljs.io/)  首页的指南简单玩一下：

- 安装

安装 babel 命令行工具 （官网是在项目下安装，这里全局安装）

```
npm install -g babel-cli
```

这样就能在命令行下启动 babel
	
另外，我们还要告诉 babel 使用哪种转码规则，这里使用 [ES2015 preset](http://babeljs.io/docs/plugins/preset-es2015/)。在项目下创建 `.babelrc` 文件

```json
{
  "presets": ["es2015"]
}
```
然后还要安装对应转码规则包

```
npm install --save-dev babel-preset-es2015
```

- 测试

创建 js 代码文件 `test.js`：

```javascript
var hello = () => {
  let name = 'peter'
  console.log('hello ' + name)
}

hello()
```

转换：

```
babel test.js --out-file test.compiled.js
```

生成 `test.compiled.js`

```
'use strict';

var hello = function hello() {
  var name = 'peter';
  console.log('hello ' + name);
};

hello();
```

现在就可以在浏览器运行这段代码了

更多关于 babel 或者 es6 的知识可以参考官网，或者还有下面中文网站：

- [InfoQ 专栏 - 深入浅出 ES6](http://www.infoq.com/cn/es6-in-depth/)
- [阮一峰 - ECMAScript 6 入门](http://es6.ruanyifeng.com/)

## vue 中使用

vue 中在构建代码的时候结合 webpack 和 babel 相关插件使用，。。。

//TODO 在 webpack 部分一起写







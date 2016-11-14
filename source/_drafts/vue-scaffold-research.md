---
title: 详解 Vue 脚手架
date: 2016-08-02 15:36:31
categories: "tech"
tags:
	- vue
	- vue-cli
---

研究 [`vue-cli`](https://github.com/vuejs/vue-cli) 生成的 [基于 webpack 的脚手架](https://github.com/vuejs-templates/webpack) 源码。

## 依赖库

看一下所有依赖库都有啥用


- "vue": "^1.0.21"

	使用的 vue 1.x 版本，要用 2.x 的话考虑使用这个脚手架 [webpack-simple-2.0](https://github.com/vuejs-templates/webpack-simple-2.0)

- babel-runtime": "^6.0.0"

	babel 相关，用于模拟 ES6 执行环境，但是不会污染宿主环境，结合 `babel-plugin-transform-runtime` 使用

- "babel-core": "^6.0.0"

	Babel 编译器，转换代码的入口

- "babel-eslint": "^6.1.2"

	ESLint 使用 Babel 作为解析器

- "babel-loader": "^6.0.0"

	用于 Webpack 转换 babel 代码

- "babel-plugin-transform-runtime": "^6.0.0"

	配合 `babel-runtime` 使用，可以理解成 `babel-runtime` 就是代码库，`babel-plugin-transform-runtime` 就是把 ES6 代码转换和引用 `babel-runtime`

- "babel-preset-es2015": "^6.0.0"

	ES6 转码规则

- "babel-preset-stage-2": "^6.0.0"

	stage-2 新特性转码规则，如 `async`

- "babel-register": "^6.0.0"

	绑定 Node 的 require 方法，自动编译加载的内容

- "connect-history-api-fallback": "^1.1.0"

	默认把路径访问指向到其下的 `index.html`，可以按照匹配规则改写 url

- "css-loader": "^0.23.0"

	Webpack 用来处理 css 文件，管理静态资源路径，处理引用图片等

- "eslint": "^2.10.2"

	代码检测

- "eslint-friendly-formatter": "^2.0.5"

	格式化 eslint 在命令行终端输出，支持某些终端直接点击错误，打开错误文件

- "eslint-loader": "^1.3.0"

	Webpack 工作流中检测代码

- "eslint-plugin-html": "^1.3.0"

	Eslint 检测 html

- "eslint-config-airbnb-base": "^3.0.1"

	Eslint 的配置模板，airbnb 提供的

- "eslint-plugin-import": "^1.8.1"

	Eslint 能够支持 ES6 的 import/export 语法

- "eventsource-polyfill": "^0.9.6"

	Server-Sent Events 是服务端发消息给浏览器，浏览器前端需要使用 EventSource，IE 浏览器不支持，需要 polyfill

- "express": "^4.13.3"

	web 框架

- "extract-text-webpack-plugin": "^1.0.1"

	webpack 打包后会把 css 代码放到 js 文件，有了这个插件可以抽出 css 单独文件

- "file-loader": "^0.8.4"

	Webpack 处理文件 require，例如图片，可以配置输出的文佳名等

- "function-bind": "^1.0.2"

	```
	Function.prototype.bind = require("function-bind")
	```

- "html-webpack-plugin": "^2.8.1"

	为你生成入口 html 文件，包含打包生成的 js，...

- "http-proxy-middleware": "^0.12.0"

	Node 后台 http 代理

- "json-loader": "^0.5.4"

	Webapck require json 文件

- "karma": "^0.13.15"

	测试任务调度执行器

- "karma-coverage": "^0.5.5"

	给出 karma 单元测试的覆盖率

- "karma-mocha": "^0.2.2"

	支持 karma 使用 mocha 作测试框架

- "karma-phantomjs-launcher": "^1.0.0"

	karma 启动 phantomjs

- "karma-sinon-chai": "^1.2.0"

	让 karma 支持 sinon-chai

- "karma-sourcemap-loader": "^0.3.7"

	karma 查找加载 sourcemap

- "karma-spec-reporter": "0.0.24"

	控制台输出测试报告

- "karma-webpack": "^1.7.0"

	让 webpack 支持 karma 启动

- "lolex": "^1.4.0"

	从 Sinon.JS 提取有关 timer 的 API，如 setTimeout

- "mocha": "^2.4.5"

	JS 测试框架

- "chai": "^3.5.0"

	断言库

- "sinon": "^1.17.3"

	好用的 spies, stubs 和 mock

- "sinon-chai": "^2.8.0"

	在 sinon 更好的使用 chai

- "inject-loader": "^2.0.1"

	测试用的，可以根据需要构建模块，重写某些方法，相当于模拟一个模块，便于单元测试

- "isparta-loader": "^2.0.0"

	要统计单元测试覆盖率就要在源代码添加一些统计用的代码，所以使用 `isparta` 库来修改源代码，`isparta-loader` 就是 webpack 中用来处理源代码的插件

- "phantomjs-prebuilt": "^2.1.3"

	编译好能用的 PhantomJS

- "chromedriver": "^2.21.2"

	chrome 驱动，需要驱动是因为作 e2e 测试（或自动化测试）需要调用浏览器的 API

- "cross-spawn": "^2.1.5"

	执行命令行的命令

- "nightwatch": "^0.8.18"

	e2e 测试框架，基于 Selenium server

- "selenium-server": "2.53.0"

	nightwatch --发命令--> selenium-server --通过 driver 操作--> 浏览器

- "ora": "^0.2.0"

	终端（命令行）的菊花

- "shelljs": "^0.6.0"

	Node 实现 Unix shell 命令

- "url-loader": "^0.5.7"

	把url引用的资源（如图片）变成 base64 Data Url

- "vue-hot-reload-api": "^1.2.0"

	vue 组件热加载

- "vue-html-loader": "^1.0.0"

	webpack 处理 html 文件，比 `html-loader` 多了处理 Vue 模板的逻辑

- "vue-loader": "^8.3.0"

	webpack 处理 `*.vue` 文件

- "vue-style-loader": "^1.0.0"

	webpack 处理 css 文件

- "webpack": "^1.12.2"

	工作流神器

- "webpack-dev-middleware": "^1.4.0"

	webpack 中间件，让后台服务支持 webpack（dev-server） 相关资源访问

- "webpack-hot-middleware": "^2.6.0"

	配合 `webpack-dev-middleware` 的 实现 webpack hot reload

- "webpack-merge": "^0.8.3"

	merge webpack 配置使用

## 安装依赖问题

如果 PhantomJS、chromedriver 等下载源可能被墙，则设置镜像路径

```
export PHANTOMJS_CDNURL=http://npm.taobao.org/mirrors/phantomjs
export CHROMEDRIVER_CDNURL=http://npm.taobao.org/mirrors/chromedriver
export SELENIUM_CDNURL=http://npm.taobao.org/mirrorss/selenium
```

如果安装 chromedriver 还出错，可以试试

```bash
npm install chromedriver  --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
```

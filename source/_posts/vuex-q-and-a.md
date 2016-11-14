---
title: Vuex 笔记之 Q & A
date: 2016-07-30 15:16:51
categories: "tech"
tags:
	- vue
	- vuex
---

> [Vuex](https://github.com/vuejs/vuex) 借鉴 Flux 开发思想，帮助你用更好的程序架构开发 Vue.js 应用，主要体现在帮你更好地管理状态。

通过『提问』和『回答』的方式记录 [文档](http://vuex.vuejs.org/en/index.html) 笔记：

<!--more-->

### 数据存储在哪里？

整个应用的状态数据存储在一个单例 store 中

### 组件怎么获取状态？

组件要使用状态（getter of state）则在组件引入 vuex 配置，为每个coputed 变量指定一个 getter 方法，方法的第一个参数总是 state，然后返回你要的

### 怎么修改状态？

谨记组件的状态 getter 不要做任何直接修改状态的事情，或者是触发其他有副作用的事件等。想管理状态则触发 mutation，真正给 state 动刀的是在 vuex。
每当你需要管理状态时，每个改变都可以定义成一个『命令』，叫 Mutation，通过在 store 中定义『命令』和执行器，要改变状态就通过 sotre 发出这个命令。
Mutation 强调同步操作，至于你要对管理状态作出异步的操作就得看看 Action

### 如何异步修改状态?

在组件中 vex 配置相关 action，然后该方法就直接在 vm 下可以访问，方法的实现通常是在异步操作中组合一些 mutation，当然，如果 Action 用在同步场景，你可以把 Actions 理解成用于组合 Mutation 的大 Mutation，另外，action 方法的第一个参数总是 store

### 简单同步操作用 Mutation 还是 Action？

从语法来说，你喜欢哪个都行，不过统一开发思路，在组件内，只跟 action 打交道，然后action 里面再去转发 mutation，这样开发体验统一，你也无须访问 store，好维护。官方制定的规则也是只用 action。

### 怎么处理多模块？

如果应用简单，mutation、action、state 各自定义一个总文件，如果多模块，那么在每个模块定义各自的 这三个部分，借助 vuex store 的 modules 配置，子模块内开发体验跟原来的没差，也不需要关注它是否为一个子模块。

### 我想要一些回调的钩子啥的，拦截一些state的处理作分析，有吗？

store 有 middlewares 配置，让你可以拦截所有 mutation，在开发环境可以使用内置的 logger 中间件，打印 mutation ，而且能获得前后的 state 快照。

### 如果我不遵循潜规则，然后在vuex 以外修改状态，你管得着吗？

确实管不着，不过开发阶段可以开启 strict 模式，在 mutation 以外地方修改 state 会报错。

### 我也想遵循潜规则，但是在表单 input 中用 v-model，双向绑定呀，会在 mutation 以外修改 state 呀，怎么办？

提供三个思路：

1. 不要用 v-model，改用 value 绑定显示，注册 input 事件，手动调用 action 更新
2. 如果小 case，就不要让 veux 跟踪，弄个组件自己状态，继续愉快 v-model，vuex 管不到你的状态
3. 保持 v-model，又让 vuex 管，那你定义一个 computed 的值，getter 你懂的，至于 setter 就调用 action

### 我怎么测试 mutation 和 action ?

mutation 比较好测试，就是同步函数，当做工具方法测呗，自己模拟state开测。至于 action 呢，如果依赖了外部 api 会比较麻烦，借助 web pack 的 inject-loader 对每个依赖的外部方法手动 mock（包括请求的数据），是有点麻烦。

### 还有什么碉堡的要告诉我？

mutation 和 action 支持热重载。[用 vue 可以当上 CTO](http://daily.zhihu.com/story/7277143)。












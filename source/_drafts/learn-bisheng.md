---
title: learn-bisheng
tags:
  - bisheng
  - ant-design
---

## start

### 获取生成 config

```js
{ source: './posts',
  output: './_site',
  entry: {
    index: {
      theme: './_theme',
      htmlTemplate: '/Users/zhenyong/codes/bisheng/lib/template.html'
    }
  },
  port: 8000,
  root: '/bisheng-theme-one/',
  plugins:
   [
     // bisheng-plugin-highlight 是自带
      '/Users/zhenyong/codes/bisheng/lib/bisheng-plugin-highlight',
     'bisheng-plugin-description',// 外部
     'bisheng-plugin-react?lang=jsx' // 外部],
  doraConfig: {},
  webpackConfig: [Function: webpackConfig],
  lazyLoad: true,
  pick: { posts: [Function: posts] }
}
```

### 遍历入口配置 `entry` 生成各入口页

#### html

以 `htmlTemplate` 为模板生成 html

核心部分：

```html
<link rel="stylesheet" type="text/css" href="{{ root }}index.css"/>
<body>
<div id="react-content"></div>
</body>
<script src="{{ root }}common.js"></script>
<script src="{{ root }}index.js"></script>
```

#### JS

以 entry.numjuck.js 为模板生成 /tmp/entry.{key}.js

+ 提供工具方法 utils = {get, toReactComponent}
+ 把插件的 utils copy 到 全局 utils
+ 加载 _theme 下的 index.js (类似静态博客的 config)
	
	```js
	module.exports = {
	    home: '/',
	    sitename: 'One',
	    ...
	    routes: [{
	      path: '/',
	      component: './template/Archive',
	    }, {
	      path: '/posts/:post',
	      component: './template/Post',
	    }...
	    ],
	  };
	```

+ convert routes

	主要目的就是把 component 变成 getComponent 动态获取

	```js
	// 每个 route 配置变成这样
	{
	  onEnter: () => NProgress.start(),
	  component: undefined,
	  getComponent: templateWrapper(route.component, route.dataPath || route.path),
	  indexRoute: route.indexRoute && Object.assign({}, route.indexRoute, {
	    component: undefined,
	    getComponent: templateWrapper(
	      route.indexRoute.component,
	      route.indexRoute.dataPath || route.indexRoute.path
	    ),
	  }),
	  childRoutes: route.childRoutes && route.childRoutes.map(processRoutes)
	}
	```

  ```js
  // 动态获取 component
  function templateWrapper(template, dataPath = '') {
    // template 就是路由的 component 配置
    // 通常就是文件路径了
    const Template = require('{{ themePath }}/template'
    + template.replace(/^\.\/template/, ''));

    return (nextState, callback) => {
      // page/a <=  dataPath: /page/:id  +  params={id:a}
      const propsPath = calcPropsPath(dataPath, nextState.params);
      // md 文件的最终的路由路径默认是文件路径
      // data.markdown 是所有 md 文件解析后的 ast 数据
      const pageData = exist.get(data.markdown, propsPath.replace(/^\//, '').split('/'));
      // 给对应 *.jsx 一个 convert nextPops 的机会
      const collect = Template.collect || defaultCollect;
      collect(Object.assign({}, nextState, {
        data: data.markdown,
        picked: data.picked,
        pageData,
        utils,
      }), (err, nextProps) => {
        // 不带参数的路由 or 有 markdown 元数据 的页面才能渲染
        // 否则都是 notfound
        const Comp = !hasParams(dataPath) || pageData ?
                Template.default || Template : NotFound;
        // 换句话说， getComponent 的意图就是让你增加 prop
        // 这些 prop 可能是解析文件分析获得的
        Comp.dynamicProps = nextProps;
        callback(err, Comp);
      });
    };
  }
  ```

+ 渲染 router 到模板默认的容器 div#react-content

	```js
	function createElement(Component, props) {
	  NProgress.done();
	  return React.createElement(Component, Object.assign({}, props, Component.dynamicProps));
	}
	const router = React.createElement(ReactRouter.Router, {
	  history: ReactRouter.useRouterHistory(history.createHistory)({
	    basename: '{{ root }}{{ entryName }}',
	  }),
	  routes: processedRoutes,
	  createElement,
	});
	ReactDOM.render(
	  router,
	  document.getElementById('react-content')
	);
	```
// TODO data 具体长什么样 data.markdown 呢

### 运行 dora

默认三插件
`dora-plugin-webpack`
_`dora-plugin-bisheng`_
`dora-plugin-browser-history`

用户配置的 `config.doraConfig.plugins`

通过 --liveload 可选的 `dora-plugin-livereload`

## dora

## build

### 构建 md 源文件树

对 `config.source`(./posts) 目录下文件 markdown 文件生成文件树

假设目录:

```
/posts/
	|- good-bye.md
	|- hello-world.md
```

`markdown-data.js` 的

```js
// generate 方法 返回：
{ 
	posts: {
		'hello-world': 'posts/hello-world.md' 
 		'good-bye': 'posts/good-bye.md' 
 	} 
 }
```

### 生成各入口页

遍历 `config.entry<key, {}>`

假设路由有
```
{
	path: '/posts/:post',
	component: './template/Post'
}
```

- 入口js entry.{key}.js
- generateFilesPath
	
	按照配置的路由，从 `md` 文件树中拿出相应的路径信息
	
	```
	[...
  '/posts/good-bye.html',
  '/posts/hello-world.html',
  '/404.html']
  	```
- 渲染 entry 下的 config.htmlTemplate 模板，对数组的每一个路径都写一份（内容一样）

### webpack 构建

- 通过 `atool-build/lib/getWebpackCommonConfig` 获取公共配置
- 借助 `atool-build/lib/getWebpackCommonConfig` 把自定义的 webpack 配置融入

	对 `**/lib/utils/data.js` 使用自己的 `bisheng-data-loader`
	
	对 `*.md` 使用自己的 `markdown-loader`
	
	遍历 plugins 对 webpack 配置扩展
	
	`config.webpackConfig` 扩展 webpack 配置
	
	把之前生成的 `entry.{key}.js` 配置到 webpack 的 entry 中
	

!!!! 我只要改写 ```jxs 相关逻辑（bisheng 的 react 插件换成 vue 就行了）
 


## 依赖包

### commander

>[tj/commander.js](https://github.com/tj/commander.js/)
>用来打印命令行帮助信息，以及解析命令参数

--config 指定配置文件路径

### 'bisheng-plugin-highlight' // TODO

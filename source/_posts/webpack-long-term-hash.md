---
title: 你用 webpack 1.x 输出的 hash 靠谱不？
date: 2016-10-27 19:05:08
tags:
  - webpack
categories: tech
---

> 使用 webpack 构建输出文件时，通常会给文件名加上 hash，该 hash 值根据文件内容计算得到，只要文件内容不变，hash 就不变，于是就可以利用浏览器缓存来节省下载流量。可是 webpack 提供的 hash 似乎不那么靠谱...

<!-- more  -->

本文只围绕如何保证 webpack 1.x 在 **生产发布阶段** 输出稳定的 hash 值展开讨论，如果对 webpack 还没了解的，可以戳 [webpack](http://webpack.github.io/docs/)。


本文 基于 webpack 1.x 的背景展开讨论，毕竟有些问题在 webpack 2 已经得到解决。为了方便描述问题，文中展示的代码、配置可能很挫，也许不是工程最佳实践，请轻拍。

懒得看文章的可以考虑直接读插件源码 [zhenyong/webpack-stable-module-id-and-hash](https://github.com/zhenyong/webpack-stable-module-id-and-hash)

## 目标

除了 html 文件以外，其他静态资源文件名都带上哈希值，根据文件本身的内容计算得到，保证文件没变化，则构建后的文件名跟上次一样。


## webpack 提供的 hash

### [hash]

假设**文件目录**长这样：

```
/src
  |- pageA.js (入口1)
  |- pageB.js (入口2)
```

使用 **webpack 配置**:
```javascript
entry: {
    pageA: './src/pageA.js',
    pageB: './src/pageB.js',
},
output: {
    path: __dirname + '/build',
    // [hash:4] 表示截取 [hash] 前四位
    filename: '[name].[hash:4].js'
},
```

**首次**构建输出:

```
pageA.c56c.js  1.47 kB       0  [emitted]  pageA
pageB.c56c.js  1.47 kB       1  [emitted]  pageB
```

**再次**构建输出：
```
pageA.c56c.js  1.47 kB       0  [emitted]  pageA
pageB.c56c.js  1.47 kB       1  [emitted]  pageB
```

hash 值是稳定的呀，是不是就可以了呢？且慢！

根据 [Configuration · webpack/docs Wiki](https://github.com/webpack/docs/wiki/Configuration#outputfilename) ：

> [hash] is replaced by the hash of the compilation.

意译：

> [hash] 是根据一个 compilation 对象计算得出的哈希值，如果 compilation 对象的信息不变，则 [hash] 不变

结合 [how to write a plugin](http://webpack.github.io/docs/how-to-write-a-plugin.html#compiler-and-compilation) 提到：

> A `compilation` object represents a single build of versioned assets. While running Webpack development middleware, a new compilation will be created each time a file change is detected, thus generating a new set of compiled assets. A compilation surfaces information about the present state of module resources, compiled assets, changed files, and watched dependencies.

意译：

> `compilation` 对象代表对某个版本进行一次编译构建的过程，如果在开发模式下（例如用 --watch 检测变化，实时编译），则每次内容变化时会新建一个 complidation，包含了构建所需的上下文信息（构建器配置、文件、文件依赖）。

我们来动一下 `pageA.js`，再次构建：

```
pageA.e6a9.js  1.48 kB       0  [emitted]  pageA
pageB.e6a9.js  1.47 kB       1  [emitted]  pageB
```

发现 hash 变了，并且所有文件的 hash 值总是一样，这似乎就跟文档描述的一致，只要构建过程依赖的任何资源（代码）发生变化，`compilation` 的信息就会跟上一次不一样了。

那是不是肯定说，源码不变的话，hash 值就一定稳定呢？也不是的，我们改一下 webpack 配置：

```javascript
entry: {
    pageA: './src/pageA.js',
    // 不再构建入口 pageB
    // pageB: './src/pageB.js',
},
```

再次构建：
```
pageA.1f01.js  1.48 kB       0  [emitted]  pageA
```

`compilation` 的信息还包括构建上下文，所以，移除入口或者换个loader 都会引起 hash 改变。

`[hash]` 的缺点很明显，不是根据内容来计算哈希，但是 hash 值是"稳定的"，用这种方案能保证『每次上线，浏览器访问到的静态资源都是新的（url 变了）』

你接受用 `[hash]` 吗，我是接受不了？于是我们看 webpack 提供的另一种根据内容计算 hash 的配置。




### [chunkhash]

> [chunkhash] is replaced by the hash of the chunk.

意译：

> [chunkhash] 根据 chunk 的内容计算得到。（chunk 可以理解成一个输出文件，其中可能包含多个 js 模块）

我们改下配置：

```
entry: {
    pageA: './src/pageA.js',
    pageB: './src/pageB.js',
},
output: {
    path: __dirname + '/build',
    filename: '[name].[chunkhash:4].js',
},
```

构建试试：

```
pageA.f308.js  1.48 kB       0  [emitted]  pageA
pageB.53a9.js  1.47 kB       1  [emitted]  pageB
```

动下 `pageA.js` 再构建：

```
pageA.16d6.js  1.48 kB       0  [emitted]  pageA
pageB.53a9.js  1.47 kB       1  [emitted]  pageB
```

发现只有 pageA 的 hash 变了，似乎 [chunkhash] 就能解决问题了？且慢！

我们目前的代码没涉及到 css，先加点 css 文件依赖：

```
/src
  |- pageA.js
  |- pageA.css

//pageA.js
require('./a.css');

```

给 webpack 配置 css 文件的 loader，并且抽取所有样式输出到一个文件
```
module: {
    loaders: [{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    }],
},
plugins: [
    // 这里的 contenthash 是 ExtractTextPlugin 根据抽取输出的文件内容计算得到
    new ExtractTextPlugin('[name].[contenthash:4].css')
],
```

构建：

```
pageA.ab4b.js    1.6 kB       0  [emitted]  pageA
pageA.b9bc.css  36 bytes       0  [emitted]  pageA
```

改一下样式，那么样式的 hash 肯定会变的，那 pageA.js 的 hash 变不变呢?

答案是『变了』：

```
pageA.0482.js    1.6 kB       0  [emitted]  pageA
pageA.c61a.css  31 bytes       0  [emitted]  pageA
```

记得之前说 webpack 的 `[chunkhash]` 是根据 chunk 的内容计算的，而 pageA.js 这个 chunk 的输出在 webpack 看来是包括 css 文件的，只不过被你抽取出来罢了，所以你改 css 也就改了这个 chunk 的内容，这体验很不好吧，怎么让 css 不影响 js 的 hash 呢？

## 自定义 chunkhash

源码 [webpack/Compilation.js](https://github.com/webpack/webpack/blob/75caa169bcf63c66ab069c38c73c3ab0e873cdc2/lib/Compilation.js#L915,L928)：

```
...
this.applyPlugins("chunk-hash", chunk, chunkHash);
chunk.hash = chunkHash.digest(hashDigest);
...
```

通过这段代码可以发现，通过在 'chunk-hash' "钩子" 中替换掉 chunk 的 digest 方法，就可以自定义 `chunk.hash` 了。

查看文档 [how to write a plugin](http://webpack.github.io/docs/how-to-write-a-plugin.html#accessing-the-compilation) 了解怎么写插件来注册一个钩子方法：

```javascript
plugins: [
        ...
        new ContentHashPlugin() // 添加插件（生产发布阶段使用）
    ],
};

// 插件函数
function ContentHashPlugin() {}
// webpack 会执行插件函数的 apply 方法
ContentHashPlugin.prototype.apply = function(compiler) {
    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('chunk-hash', function(chunk, chunkHash) {
            // 这里注册了之前说到的 'chunk-hash' 钩子
            chunk.digest = function () {
            	return '这就是自定义的 hash 值';
            }
        });
    });
};
```
那么这个 hash 值如何计算好呢？

可以将 chunk 所依赖的各个模块 (单个源码文件) 的内容拼接后计算一个 md5 作为 hash 值，当然需要对所有文件排序后再拼接：

```javascript
var crypto = require('crypto');

var md5Cache = {}

function md5(content) {
    if (!md5Cache[content]) {
        md5Cache[content] = crypto.createHash('md5') //
            .update(content, 'utf-8').digest('hex')
    }
    return md5Cache[content];
}

function ContentHashPlugin() {}

ContentHashPlugin.prototype.apply = function(compiler) {
    var context = compiler.options.context;

    function getModFilePath(mod) {
    	// 获取形如 './src/pageA.css' 这样的路径
    	// libIdent 方法会处理好不同平台的路径分隔符问题
        return mod.libIdent({
            context: context
        });
    }

	// 根据模块对应的文件路径排序
	//（可以根据模块ID，但是暂时不靠谱，后面会讲）
    function compareMod(modA, modB) {
        var modAPath = getModFilePath(modA);
        var modBPath = getModFilePath(modB);
        return modAPath > modBPath ? 1 : modAPath < modBPath ? -1 : 0;
    }

	// 获取模块源码，开发阶段别用
    function getModSrc(mod) {
        return mod._source && mod._source._value || '';
    }

    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("chunk-hash", function(chunk, chunkHash) {
            var source = chunk.modules.sort(compareMod).map(getModSrc).join('');
            chunkHash.digest = function() {
                return md5(source);
            };
        });
    });
};

module.exports = ContentHashPlugin;
```

此时，pageA.css 修改之后，再也不会影响 pageA.js 的 hash 值。

另外要注意，ExtractTextPlugin 会把 pageA.css 的内容抽取之后，替换该模块的内容 `mod._source._value` 为：

```
// removed by extract-text-webpack-plugin
```

由于每一个 css 模块都对应这段内容，所以不会影响效果。

[erm0l0v/webpack-md5-hash](https://github.com/erm0l0v/webpack-md5-hash) 插件也是为了解决类似问题，但是它其中的『排序』算法是基于模块的 id，而模块的 id 理论上是不稳定的，接下来我们就讨论不稳定的模块 ID 带来的坑。

## 模块 ID 的坑

我们简单的把每个文件理解为一个模块（module），在 webpack 处理模块依赖关系时，会给每个模块定义一个 ID，查看 [webpack/Compilation.js ](https://github.com/webpack/webpack/blob/75caa169bcf63c66ab069c38c73c3ab0e873cdc2/lib/Compilation.js#L748) 发现，webpack 根据收集 module 的顺序给每个模块分配递增数字作为 ID，至于『收集的 module 顺序』，在你开发生涯里，这玩意绝对是不稳定！不稳定的！

### Module ID 不稳定怎么了

我们的**文件结构**现在长这样：

```
/src
	|- pageA.js
	|- pageB.js
	|- a.js
	|- b.js
	|- c.js
```

pageA.js

```javascript
require('./a.js') // a.js
require('./b.js') // b.js
var a = 'this is pageA';
```

pageB.js

```javascript
require('./b.js') //  b.js'
require('./c.js') // c.js
var b = 'this is pageB';
```

更新配置，把引用达到 2 次的模块抽取出来：

```javascript
  output: {
        chunkFilename: "[id].[chunkhash:4].bundle.js",
	...
plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: "commons",
        minChunks: 2,
        chunks: ["pageA", "pageB"],
    }),
    ...
```

build build build:

```
  pageA.1cda.js  262 bytes       0  [emitted]  pageA
  pageB.0752.js  280 bytes       1  [emitted]  pageB
commons.14bf.js    3.64 kB       2  [emitted]  commons
```

观察 pageB.0752.js，有一段:

```javascript
__webpack_require__(2) //  b.js'
__webpack_require__(3) // c.js
var b = 'this is pageB';
```

从上面看出，webpack 构建时给 `b.js` 的模块 ID 为 **2**

这时，我们改一下 **pageA.js**：

```
// 移除对 a.js 的依赖
// require('./a.js') // a.js
require('./b.js') // b.js
var a = 'this is pageA';
```

build build build ：

```
  pageA.a945.js  200 bytes       0  [emitted]  pageA
  pageB.0752.js  271 bytes       1  [emitted]  pageB
commons.14bf.js    3.65 kB       2  [emitted]  commons
```

嗯! 只有 pageA.js 的 hash 变了，挺合理合理，我们进去 pageB.0752.js 看看

```javascript
	__webpack_require__(1) //  b.js'
	__webpack_require__(2) // c.js
	var b = 'this is pageB';
```

看出来了没！这次构建，webpack 给 `b.js` 的 ID 是 **1**。

我们 pageB.js 的 hash 没变，因为背后依赖的模块内容 (b.js、c.js) 没有变呀，但是此时 pageB.0752.js 的内容确实变了，如果你用 CDN 上传这个文件，**也许**会传不上去，因为文件大小和名称一模一样，就是这个不稳定的模块 ID 给坑的！

怎么解决呢？

第一念头：把原来计算 hash 的方式改一下，就那构建输出后的文件内容来计算？

细想: 不要，明明 pageB 这一次就不用重新上传的，浪费。

比较优雅的思路就是：让模块 ID 给我稳定下来！！！

### 给我稳定的 Module ID

#### webpack 1 的官方方案

webpack 文档提供了几种方案

- [OccurrenceOrderPlugin](http://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin)	

	这个插件根据 module 被引用的次数（被 entry 引用、被 chunk 引用）来排序分配 ID，如果你的整个应用的文件依赖是没太多变化，那么模块 ID 就稳定，但是谁能保证呢？

- [`recordsPath 配置`](http://webpack.github.io/docs/configuration.html#recordspath-recordsinputpath-recordsoutputpath)

	>Store/Load compiler state from/to a json file. This will result in persistent ids of modules and chunks.

	会记录每一次打包的模块的"文件处理路径"使用的 ID，下次打包同样的模块直接使用记录中的 ID:
	
	```
      "node_modules/style-loader/index.js!node_modules/css-loader/index.js!src/b.css": 9,
	```
	
	
	这就要求每个人都得提交这份文件了，港真，我觉得体验很差咯。
	
	另外一旦你修改文件名，或者是增减 loader，原来的路径就无效了，从而再次入坑！
	
- [DllPlugin 和 DllReferencePlugin](http://webpack.github.io/docs/list-of-plugins.html#dllplugin)

	原理就是在你打包源码前，你得新建一个构建配置用 [DllPlugin](https://github.com/webpack/webpack/tree/master/examples/dll) 单独打包生成一份模块文件路径对应的 ID 记录，然后在你的原来配置使用 [DllReferencePlugin](https://github.com/webpack/webpack/tree/master/examples/dll-user) 引用这份记录，跟 recordsPath 大同小异，但是更高效和稳定，但是这个额外的构建，我觉得不够优雅，至于能快多少呢，我目前还不在意这个速度，另外还是得提交多一份记录文件。
	
#### webpack 2 的思路

- [webpack/HashedModuleIdsPlugin.js at master · webpack/webpack](https://github.com/webpack/webpack/blob/master/lib/HashedModuleIdsPlugin.js)

- [webpack/NamedModulesPlugin.js at master · webpack/webpack](https://github.com/webpack/webpack/blob/master/lib/NamedModulesPlugin.js)

以上两个插件的思路都是用模块对应的文件路径直接作为模块 ID，而不是 webpack 1 中的默认使用数字，另外 webpack 1 不接受非数字作为 模块 ID。

#### 我们的思路

把模块对应的文件路径通过一个哈希计算映射为数字，用这个全局唯一的数字作为 ID 就解决了，妥妥的！

参考：

- [webpack/Compilation.js 中暴露的 before-module-ids 钩子](https://github.com/webpack/webpack/blob/75caa169bcf63c66ab069c38c73c3ab0e873cdc2/lib/Compilation.js#L569,L571) 
- [webpack/HashedModuleIdsPlugin.js](https://github.com/webpack/webpack/blob/54aa3cd0d6167943713491fd5e1110b777336be6/lib/HashedModuleIdsPlugin.js) 

给出 webpack 1.x 中的解决方案：

```
...

xx.prototype.apply = function(compiler) {

  function hexToNum(str) {
    str = str.toUpperCase();
    var code = ''
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i) + '';
      if ((c + '').length < 2) {
        c = '0' + c
      }
      code += c
    }
    return parseInt(code, 10);
  }

  var usedIds = {};

  function genModuleId(module) {
    var modulePath = module.libIdent({
      context: compiler.options.context
    });
    var id = md5(modulePath);
    var len = 4;
    while (usedIds[id.substr(0, len)]) {
      len++;
    }
    id = id.substr(0, len);
    return hexToNum(id)
  }

  compiler.plugin("compilation", function(compilation) {
    compilation.plugin("before-module-ids", function(modules) {
      modules.forEach(function(module) {
        if (module.libIdent && module.id === null) {
          module.id = genModuleId(module);
          usedIds[module.id] = true;
        }
      });
    });
  });
};
...
```

注册钩子的思路跟之前的 content hash 插件差不多，获取到模块文件路径后，通过 md5 计算输出 16 进制的字符串（[0-9A-E]），再把字符串的字符逐个转为 ascii 形式的整数，由于 16 进制字符串只会包含 `[0-9A-E]`，所以保证单个字符转化的整数是两位就能保证这个算法是有效的。

举例:

```
path = '/node_module/xxx'
md5Hash = md5(path) // => A3E...
nul = hexToNum(md5Hash) // => 650369 
```

这个方案还有些小缺点，就是用模块文件路径作为哈希输入还不是百分百完美，如果文件名改了，那么模块 ID 就 "不稳定了"。其实，可以用模块文件内容作为哈希输入，考虑到效率问题，权衡之下还是用路径好了。

## 总结

为了保证 webpack 1.x 生产阶段的文件 hash 值能够完美跟文件内容一一映射，查阅了大量信息，根据目前 github 上讨论的解决方案算是大体解决了问题，但是还不够优雅和完美，于是借鉴 webpack 2 的思路加上一点小技巧，比较优雅地解决了这个问题。

插件放在 Github: [zhenyong/webpack-stable-module-id-and-hash](https://github.com/zhenyong/webpack-stable-module-id-and-hash)

## 参考资料

- [Vendor chunkhash changes when app code changes · Issue #1315 · webpack/webpack](https://github.com/webpack/webpack/issues/1315)
- [Vendor chunkhash changes when app code changes · Issue #1315 · webpack/webpack](https://github.com/webpack/webpack/issues/1315)
- [Webpack中hash与chunkhash的区别，以及js与css的hash指纹解耦方案 - zhoujunpeng - 博客园](http://www.cnblogs.com/ihardcoder/p/5623411.html)
- [webpack使用优化 | Web前端 腾讯AlloyTeam Blog | 愿景: 成为地球卓越的Web团队！](http://www.alloyteam.com/2016/01/webpack-use-optimization/)

	
	
	
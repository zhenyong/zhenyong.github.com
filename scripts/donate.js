/*
hexo 默认的 md 渲染引擎不把 <style>xx</style> 当 html 代码看
我们就先插入占位符，render 完之后在替换
 */

var fs = require('fs')
var donateInterceptor = '<!--donate' + Date.now() + '-->';

// for donate
hexo.extend.filter.register('after_post_render', function(data) {
    data.content = data.content.replace(donateInterceptor, fs.readFileSync('donate.html').toString());
    return data;
});

// for donate
hexo.extend.filter.register('before_post_render', function(data) {
    if (data && data.content) {
        data.content += donateInterceptor
    }
    return data
});
var gulp = require('gulp')
var tap = require('gulp-tap')
var rimraf = require('rimraf')
var debug = require('gulp-debug')

var path = require('path')

var rootName = 'react'

var config = {
    website: {
        src: '/Users/zhenyong/codes/react-website-cn/docs-cn/react/**',
        dest: './source/' + rootName + '/'
    }
}

var regScriptOrHref = /(\s*(?:src|href)\s*=["'])(\/)/g
// var regScriptOrHref = /(\s*(?:src|href)\s*=["'])(\/assets\/[^"']+["'])/g
var regUrl = /(\s*(?:url\s*\()\s*["'])(\/)/g
// var regUrl = /(\s*(?:url\s*\()\s*["'])(\/assets\/[^"']+["'])/g
var regConfig = /(:\s*["'])(\/assets\/?["'])/g

function changeBasepath(str) {
    [].slice.call(arguments, 1).forEach(function(reg) {
        str = str.replace(reg, function(match, pre, post) {
            return pre + '/' + rootName + post
        })
    })
    return str
}

function shouldReplace(file) {
    if (!file.contents) return false
    var ext = path.extname(file.path)
    return ['.html', '.css', '.js'].indexOf(ext) !== -1
}

gulp.task('default', function() {
    var str
    rimraf.sync(config.website.dest)

    gulp.src(config.website.src)
        .pipe(gulp.dest(config.website.dest))
})

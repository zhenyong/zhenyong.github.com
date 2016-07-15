var gulp = require('gulp')
var tap = require('gulp-tap')
var rimraf = require('rimraf')
var debug = require('gulp-debug')

var path = require('path')

var rootName = 'flowtype'

var config = {
    website: {
        src: '/Users/zhenyong/codes/flow/website-cn/_site/**',
        dest: './source/' + rootName + '/'
    }
}

var regScriptOrHref = /(\s*(?:src|href)\s*=["'])(\/assets\/[^"']+["'])/g
var regUrl = /(\s*(?:url\s*\()\s*["'])(\/assets\/[^"']+["'])/g
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
        .pipe(tap(function(file, t) {
            if (shouldReplace(file)) {
                str = changeBasepath(file.contents.toString(),
                    regScriptOrHref, regConfig, regUrl)
                file.contents = new Buffer(str)
            }
        }))
        .pipe(gulp.dest(config.website.dest))
})
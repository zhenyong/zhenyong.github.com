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

gulp.task('default', function() {
    var str
    rimraf.sync(config.website.dest)

    gulp.src(config.website.src)
        .pipe(gulp.dest(config.website.dest))
})

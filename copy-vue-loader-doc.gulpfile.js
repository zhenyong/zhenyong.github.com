var gulp = require('gulp')
var tap = require('gulp-tap')
var rimraf = require('rimraf')
var debug = require('gulp-debug')

var path = require('path')

var rootName = 'vue-loader'

var config = {
    website: {
        src: '/Users/zhenyong/codes/vue-loader/docs/zh-cn/_book/**',
        dest: './source/' + rootName + '/'
    }
}

gulp.task('default', function() {
    var str
    rimraf.sync(config.website.dest)

    gulp.src(config.website.src)
        .pipe(gulp.dest(config.website.dest))
})

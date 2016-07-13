var Promise = require('bluebird')
var fs = require('fs')
var path = require('path')

var _map = Object.create(null)
var _postCache = Object.create(null)

var _postNames = []

hexo.extend.filter.register('after_init', function() {
    try {
        _postNames = fs.readdirSync(path.join(this.source_dir, '_posts'))
    } catch (e) {
        //TODO throw error
    }
})

hexo.extend.tag.register('linkpost', function(args) {
    var name, data
    name = args[0]

    if (!checkName(name)) {
        throw new Error('linkpost 标签：不存在 ' + name + '.md')
    }

    data = _postCache[name]

    if (data) {
        return buildLinkTag(data, args)
    } else {
        return new Promise(function(resolve, reject) {
            watch(args, resolve, reject)
        })
    }
}, {
    async: true
})


hexo.extend.filter.register('after_post_render', function(data) {
    var name, tasks, i, task

    //TODO warning if duplicate

    name = getFileName(data)
    tasks = _map[name]


    if (tasks) {
        i = tasks.length
        while (i--) {
            task = tasks[i]
            tasks.splice(i, 1)
            task.resolve(buildLinkTag(data, task.args))
        }
    }

    _postCache[name] = data


})

function checkName(name) {
    return _postNames.indexOf(name + '.md') !== -1
}

function buildLinkTag(data, args) {
    return [ //
        '<a href="', data.permalink, '" target="_blank" >', //
        getTitleFromArgs(args) || data.title,
        '</a>'
    ].join('')
}

function getTitleFromArgs(args) {
    return args[1]
}

function getNameFromArgs(args) {
    return args[0]
}

function watch(args, resolve, reject) {
    var name = getNameFromArgs(args)
    var tasks = _map[name] || (_map[name] = [])
    tasks.push({
        args: args,
        resolve: resolve,
        reject: reject
    })
}

function getFileName(data) {
    var match
    var assetDir = data.asset_dir

    if (assetDir) {
        match = assetDir.match(/.*\/(.+)[\/$]/)
    }

    return match ? match[1] : null
}
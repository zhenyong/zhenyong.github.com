var exec = require('child_process').exec

// auto open macdown editor after creating new page
hexo.on('new', function(data) {
    // exec('open -a "/Applications/MacDown.app" ' + data.path);
    exec('atom ' + data.path);
});

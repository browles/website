var path = require('path');
var fs = require('fs');

function generatePages() {
    console.log('generate.js');
    var template = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));
    var dirs = ['fan', 'gestures', 'ribbon', 'scroll', 'toss'];

    dirs.forEach(function(name) {
        console.log('generated:', path.join('public', 'labs', name, 'index.html'));
        fs.writeFile(path.join(__dirname, 'public', 'labs', name, 'index.html'), template);
    });
}

generatePages();
if (process.env.NODE_WATCH_INDEX) fs.watch(path.join(__dirname, 'public', 'index.html'), function(event, filename) {
    if (filename === 'index.html') generatePages();
});

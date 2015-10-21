import 'babel/polyfill';
import _ from 'lodash';
import {
    rainbow,
    cubehelix
} from './color';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var w, h, squareWidth, invSquareWidth, numX, numY, scale;

var scales = [2.5, 3.5, 7.5, 10];

var numColors = 800;
var colors = cubehelix(1.3, 10, 0.6, 1000)
    .slice(75,75+numColors)
    .reverse()
    .map(function(rgb) {
        var r = rgb.r.toString(16);
        var g = rgb.g.toString(16);
        var b = rgb.b.toString(16);
        if (r.length === 1) r = '0' + r;
        if (g.length === 1) g = '0' + g;
        if (b.length === 1) b = '0' + b;

        rgb.hex = '#' + r + g + b;

        return rgb;
    });

function colorMaze(distances, t) {
    var s = 1.1 + 0.5 * Math.cos(t / 9000) + 0.3 * Math.sin(t / 13000);
    s *= scale;
    var k = 0;
    for (var j = 0; j < numY; j++) {
        var y = j * squareWidth;
        var row = j * numX;
        for (var i = 0; i < numX; i++) {
            var x = i * squareWidth;
            var d = distances[i + row];
            d = d == null ? Infinity : d;
            d = s * Math.abs(d);
            var c;
            if (Math.random > 0.95) console.log(d)
            if (Number.isFinite(d)) c = colors[Math.min(Math.max(d | 0, 0), numColors - 1)].hex;
            else c = '#323232';

            // ctx.fillStyle = c;
            // ctx.fillRect(x, y, squareWidth-1, squareWidth-1);
            ctx.lineWidth = 1;
            ctx.strokeStyle = c;
            ctx.strokeRect(x, y, squareWidth - 1, squareWidth - 1);
        }
    }
}

var worker = new Worker('worker.bundle.js');
function getNextDistances(steps) {
    return new Promise(function(resolve, reject) {
        worker.postMessage({command: 'fill', steps});
        worker.onmessage = function(e) {
            resolve(e.data);
        };
    });
}

var mazeInit = false;
function updateWorkerMaze(maze) {
    mazeInit = false;
    worker.postMessage({command: 'maze', maze});
    worker.onmessage = function(e) {
        console.log(e)
        mazeInit = true;
    };
}

function updateColorGenerator(pathStart) {
    worker.postMessage({command: 'generator', pathStart});
}


var _distances = new Array();
var distances = _distances;

var lastClick = 0;
var clicks = 0;
var down= _.throttle(function(e) {
    e = e.touches ? e.touches[0] : e;
    var x = e.clientX * invSquareWidth | 0;
    var y = e.clientY * invSquareWidth | 0;

    var source = x + numX * y;

    var time = Date.now();
    if (time - lastClick < 250) clicks++;
    else clicks = 1;
    lastClick = time;

    // if (clicks === 2) {
        distances = _distances;
        updateColorGenerator(source);
    // }
}, 1000, {trailing: false});

canvas.addEventListener('mousedown', down);
canvas.addEventListener('touchstart', down);

var fill = _.throttle(function (t) {
    ctx.clearRect(0, 0, w, h);
    colorMaze(distances, t);
}, 50);

var loopId;
function drawFrame(t) {
    if (mazeInit) getNextDistances(numX * numY / 200 | 0).then(function(result) {
        if (result) [distances, ] = result;
    });

    fill(t);

    loopId = requestAnimationFrame(drawFrame);
}

window.onresize = _.debounce(function() {
    cancelAnimationFrame(loopId);
    init();
}, 200);


function init() {
    w = window.innerWidth;
    h = window.innerHeight;

    squareWidth = Math.max(w, h) / 60 | 0;
    invSquareWidth = 1 / squareWidth;

    numX = Math.ceil(w * invSquareWidth);
    numY = Math.ceil(h * invSquareWidth);

    var index = Math.random() * 4 | 0;

    scale = scales[index] * 1 / numX * numY;

    canvas.width = w;
    canvas.height = h;

    updateWorkerMaze({index, numX, numY});
    updateColorGenerator(Math.random() * numX * numY | 0);

    drawFrame(0);
}

init();

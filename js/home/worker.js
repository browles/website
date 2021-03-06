import 'babel/polyfill';
import {
    backtracker,
    greedyBacktracker,
    kruskal,
    binaryTree,
    gen_dijkstra
} from './maze';

var maze = null;
var generator = null;
var result = null;

var methods = [backtracker, greedyBacktracker, kruskal, binaryTree];

self.addEventListener('message', function(e) {
    var d = e.data;
    switch(d.command) {
        case 'maze':
            maze = methods[d.maze.index](d.maze.numX, d.maze.numY);
            self.postMessage(true);
            break;
        case 'generator':
            generator = gen_dijkstra(maze, d.pathStart);
            break;
        case 'fill':
            var i = d.steps;
            var next;
            var update = false;
            if (i === 0) {
                next = generator.next();
                while (!next.done) {
                    result = next.value;
                    next = generator.next();
                    update = true;
                }
            }
            else {
                while (i--) {
                    next = generator.next();
                    if (!next.done) {
                        result = next.value;
                        update = true;
                    }
                }
            }
            if (update) self.postMessage(result);
            break;
    }
});
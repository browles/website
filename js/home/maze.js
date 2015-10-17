import {Heap, Tree} from './ds';

var N = 1;
var E = 1<<1;
var S = 1<<2;
var W = 1<<3;

var cardinalOpposites = {};
cardinalOpposites[N] = S;
cardinalOpposites[E] = W;
cardinalOpposites[S] = N;
cardinalOpposites[W] = E;

export function binaryTree(numX, numY) {
    var offsets = {};
    offsets[N] = -numX;
    offsets[E] = 1;
    offsets[S] = numX;
    offsets[W] = -1;

    var edgeSet = new Array(numX * numY);
    for (var j = 0; j < numY; j++) {
        for (var i = 0; i < numX; i++) {
            var current = i + numX * j;
            edgeSet[current] = edgeSet[current] || 0;
            var d;
            if (j === numY - 1) d = E;
            else if (i === numX - 1) d = S;
            else d = Math.random() > 0.5 ? S : E;
            var neighbor = current + offsets[d];
            edgeSet[neighbor] = edgeSet[neighbor] || 0;

            edgeSet[current] |= d;
            edgeSet[neighbor] |= cardinalOpposites[d];
        }
    }
    return {numX, numY, edgeSet};
}

export function* gen_binaryTree(numX, numY) {
    var offsets = {};
    offsets[N] = -numX;
    offsets[E] = 1;
    offsets[S] = numX;
    offsets[W] = -1;

    var edgeSet = new Array(numX * numY);
    for (var j = 0; j < numY; j++) {
        for (var i = 0; i < numX; i++) {
            var current = i + numX * j;
            edgeSet[current] = edgeSet[current] || 0;
            var d;
            if (j === numY - 1) d = E;
            else if (i === numX - 1) d = S;
            else d = Math.random() > 0.5 ? S : E;
            var neighbor = current + offsets[d];
            edgeSet[neighbor] = edgeSet[neighbor] || 0;

            edgeSet[current] |= d;
            edgeSet[neighbor] |= cardinalOpposites[d];
            yield {numX, numY, edgeSet};
        }
    }
    return {numX, numY, edgeSet};
}

function shuffle(arr) {
    var n = arr.length;
    while (n--) {
        var i = Math.random() * n | 0;
        var t = arr[n];
        arr[n] = arr[i];
        arr[i] = t;
    }
    return arr;
}

export function backtracker(numX, numY) {
    var offsets = {};
    offsets[N] = -numX;
    offsets[E] = 1;
    offsets[S] = numX;
    offsets[W] = -1;

    var cardinals = [N, E, S, W];

    var edgeSet = new Array(numX * numY);

    var n = numX * numY;
    var frontier = [];

    var st = Math.random() * n | 0;
    frontier.push(st);

    while (frontier.length) {
        shuffle(cardinals);

        var current = frontier[frontier.length - 1];
        var col = current % numX;
        var row = current / numX | 0;

        edgeSet[current] = edgeSet[current] || 0;

        var done = true;
        for (var i = 0; i < 4; i++) {
            var d = cardinals[i];
            if (d === N && row === 0) continue;
            else if (d === E && col === numX - 1) continue;
            else if (d === S && row === numY - 1) continue;
            else if (d === W && col === 0) continue;
            var neighbor = current + offsets[d];
            edgeSet[neighbor] = edgeSet[neighbor] || 0;
            if (edgeSet[neighbor] === 0) {
                done = false;
                edgeSet[current] |= d;
                edgeSet[neighbor] |= cardinalOpposites[d];
                frontier.push(neighbor);
                break;
            }
        }
        if (done) frontier.pop();
    }
    return {numX, numY, edgeSet};
}


export function* gen_backtracker(numX, numY, start) {
    var offsets = {};
    offsets[N] = -numX;
    offsets[E] = 1;
    offsets[S] = numX;
    offsets[W] = -1;

    var cardinals = [N, E, S, W];

    var edgeSet = new Array(numX * numY);

    var n = numX * numY;
    var frontier = [];

    frontier.push(start);

    while (frontier.length) {
        shuffle(cardinals);

        var current = frontier[frontier.length - 1];
        var col = current % numX;
        var row = current / numX | 0;

        edgeSet[current] = edgeSet[current] || 0;

        var done = true;
        for (var i = 0; i < 4; i++) {
            var d = cardinals[i];
            if (d === N && row === 0) continue;
            else if (d === E && col === numX - 1) continue;
            else if (d === S && row === numY - 1) continue;
            else if (d === W && col === 0) continue;
            var neighbor = current + offsets[d];
            edgeSet[neighbor] = edgeSet[neighbor] || 0;
            if (edgeSet[neighbor] === 0) {
                done = false;
                edgeSet[current] |= d;
                edgeSet[neighbor] |= cardinalOpposites[d];
                frontier.push(neighbor);
                yield {numX, numY, edgeSet};
                break;
            }
        }
        if (done) frontier.pop();
    }
    return {numX, numY, edgeSet};
}

export function greedyBacktracker(numX, numY) {
    var offsets = {};
    offsets[N] = -numX;
    offsets[E] = 1;
    offsets[S] = numX;
    offsets[W] = -1;

    var cardinals = [N, E, S, W];

    var edgeSet = new Array(numX * numY);

    var n = numX * numY;
    var frontier = [];

    var st = Math.random() * n | 0;
    frontier.push(st);

    while (frontier.length) {
        shuffle(cardinals);

        var current = frontier.pop();
        var col = current % numX;
        var row = current / numX | 0;

        edgeSet[current] = edgeSet[current] || 0;

        for (var i = 0; i < 4; i++) {
            var d = cardinals[i];
            if (d === N && row === 0) continue;
            else if (d === E && col === numX - 1) continue;
            else if (d === S && row === numY - 1) continue;
            else if (d === W && col === 0) continue;
            var neighbor = current + offsets[d];
            edgeSet[neighbor] = edgeSet[neighbor] || 0;
            if (edgeSet[neighbor] === 0) {
                edgeSet[current] |= d;
                edgeSet[neighbor] |= cardinalOpposites[d];
                frontier.push(neighbor);
            }
        }
    }
    return {numX, numY, edgeSet};
}

export function kruskal(numX, numY) {
    var offsets = {};
    offsets[N] = -numX;
    offsets[E] = 1;
    offsets[S] = numX;
    offsets[W] = -1;

    var num = numX * numY;
    var edgeSet = new Array(num);

    var pool = [];
    var trees = new Array(num);
    for (var i = 0; i < num; i++) {
        trees[i] = new Tree();

        var col = i % numX;
        var row = i / numX | 0;

        if (row !== 0) pool.push({i:i, d: N});
        if (col !== numX - 1) pool.push({i:i, d: E});
        if (row !== numY - 1) pool.push({i:i, d: S});
        if (col !== 0) pool.push({i:i, d: W});
    }

    shuffle(pool);
    while(pool.length) {
        var edge = pool.pop();
        var current = edge.i;
        var d = edge.d;

        edgeSet[current] = edgeSet[current] || 0;

        var neighbor = current + offsets[d];
        edgeSet[neighbor] = edgeSet[neighbor] || 0;
        if (trees[current].isConnectedTo(trees[neighbor])) continue;
        else {
            trees[current].splice(trees[neighbor]);
            edgeSet[current] |= d;
            edgeSet[neighbor] |= cardinalOpposites[d];
        }
    }

    return {numX, numY, edgeSet};
};

export function* gen_kruskal(numX, numY) {
    var offsets = {};
    offsets[N] = -numX;
    offsets[E] = 1;
    offsets[S] = numX;
    offsets[W] = -1;

    var num = numX * numY;
    var edgeSet = new Array(num);

    var pool = [];
    var trees = new Array(num);
    for (var i = 0; i < num; i++) {
        trees[i] = new Tree();

        var col = i % numX;
        var row = i / numX | 0;

        if (row !== 0) pool.push({i:i, d: N});
        if (col !== numX - 1) pool.push({i:i, d: E});
        if (row !== numY - 1) pool.push({i:i, d: S});
        if (col !== 0) pool.push({i:i, d: W});
    }

    shuffle(pool);
    while(pool.length) {
        var edge = pool.pop();
        var current = edge.i;
        var d = edge.d;

        edgeSet[current] = edgeSet[current] || 0;

        var neighbor = current + offsets[d];
        edgeSet[neighbor] = edgeSet[neighbor] || 0;
        if (trees[current].isConnectedTo(trees[neighbor])) continue;
        else {
            trees[current].splice(trees[neighbor]);
            edgeSet[current] |= d;
            edgeSet[neighbor] |= cardinalOpposites[d];
            yield {numX, numY, edgeSet};
        }
    }

    return {numX, numY, edgeSet};
};

export function dijkstra(maze, source=0) {
    var {numX, numY, edgeSet} = maze;

    var offsets = {};
    offsets[N] = -numX;
    offsets[E] = 1;
    offsets[S] = numX;
    offsets[W] = -1;

    var distances = new Array(numX * numY);
    var paths = new Array(numX * numY);
    var unvisited = new Heap((a,b) => distances[b] - distances[a]);

    distances[source] = 0;
    for (var i = 0; i < distances.length; i++)  {
        if (i !== source) distances[i] = Infinity;
        paths[i] = -1;
        unvisited.add(i);
    }

    var neighbors = [];
    while (unvisited.size > 0) {
        var min = unvisited.remove();

        if (edgeSet[min] & W) neighbors.push(min + offsets[W]);
        if (edgeSet[min] & E) neighbors.push(min + offsets[E]);
        if (edgeSet[min] & N) neighbors.push(min + offsets[N]);
        if (edgeSet[min] & S) neighbors.push(min + offsets[S]);

        var dist = distances[min] + 1;
        while (neighbors.length > 0) {
            var n = neighbors.pop();
            if (dist < distances[n]) {
                distances[n] = dist;
                unvisited.heapify(n);
                paths[n] = min;
            }
        }
    }

    return [distances, paths];
}

export function* gen_dijkstra(maze, source=0) {
    var {numX, numY, edgeSet} = maze;

    var offsets = {};
    offsets[N] = -numX;
    offsets[E] = 1;
    offsets[S] = numX;
    offsets[W] = -1;

    var distances = new Array(numX * numY);
    var paths = new Array(numX * numY);
    var unvisited = new Heap((a,b) => distances[b] - distances[a]);

    distances[source] = 0;
    for (var i = 0; i < distances.length; i++)  {
        if (i !== source) distances[i] = Infinity;
        paths[i] = -1;
        unvisited.add(i);
    }

    var neighbors = [];
    while (unvisited.size > 0) {
        var min = unvisited.remove();

        if (edgeSet[min] & W) neighbors.push(min + offsets[W]);
        if (edgeSet[min] & E) neighbors.push(min + offsets[E]);
        if (edgeSet[min] & N) neighbors.push(min + offsets[N]);
        if (edgeSet[min] & S) neighbors.push(min + offsets[S]);

        var dist = distances[min] + 1;
        while (neighbors.length > 0) {
            var n = neighbors.pop();
            if (dist < distances[n]) {
                distances[n] = dist;
                unvisited.heapify(n);
                paths[n] = min;
                yield [distances, paths];
            }
        }
    }

    return [distances, paths];
}

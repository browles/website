export class Heap {
    constructor(comparator) {
        this.comparator = comparator;
        this.map = new Map();
        this.data = [null];
        this.size = 0;
    }

    add(item) {
        this.size++;
        this.data.push(item);
        this.map.set(item, this.size);

        this.heapify(item);
    }

    remove() {
        if (this.size < 1) return;
        this.size--;
        if (this.size < 1) return this.data.pop();

        var result = this.data[1];
        var i = 1;
        var l = 2 * i;
        var r = l + 1;
        this.data[1] = this.data.pop();

        while (true) {
            var parent = this.data[i];
            var left = this.data[l];
            var right = this.data[r];
            var s;
            if (left != null && right != null) {
                s = this.comparator(left, right) > 0 ? l : r;
                if (this.comparator(parent, this.data[s]) > 0) break;
            }
            else if (left != null && this.comparator(left, parent) > 0) s = l;
            else if (right != null && this.comparator(right, parent) > 0) s = r;
            else break;

            this._swap(i, s);
            i = s;
            l = 2 * i;
            r = l + 1;
        }

        this.map.delete(result);

        return result;
    }

    heapify(item) {
        var i = this.map.get(item);
        if (i == null) return;
        var p = i * 0.5 | 0;
        while (i > 1 && this.comparator(this.data[i], this.data[p]) > 0) {
            this._swap(i, p);
            i = p;
            p = i * 0.5 | 0;
        }
    }

    _swap(a,b) {
        this.map.set(this.data[a], b);
        this.map.set(this.data[b], a);
        var temp = this.data[a];
        this.data[a] = this.data[b];
        this.data[b] = temp;
    }
}

export class Tree {
    constructor() {
        this.parent = null;
    }

    root() {
        var current = this;
        while (current.parent) current = current.parent;
        return current;
    }

    splice(tree) {
        tree.root().parent = this.root();
    }

    isConnectedTo(tree) {
        return this.root() === tree.root();
    }
}

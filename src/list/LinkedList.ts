import { AbstractCollection } from "../collection/AbstractCollection.js";
import { Collection } from "../collection/Collection.js";
import { IntRange } from "../iterables/IntRange.js";
import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";
import { Utils } from "../utils/Utils.js";
import { List, MutableList } from "./List.js";

export class Node<T> {
    public item: T;
    public next: Node<T> | null;
    public prev: Node<T> | null;
    constructor(
        prev: Node<T> | null,
        item: T,
        next: Node<T> | null
    ) {
        this.item = item;
        this.next = next;
        this.prev = prev;
    }
}

export class LinkedList<T> extends AbstractCollection<T> implements MutableList<T> {
    private _size: number = 0;

    private head: Node<T> | null = null;
    private tail: Node<T> | null = null;

    private constructor(elements?: Iterable<T>) {
        super();
        if (elements) this.addAll(elements);
    }

    public static of<T>(...elements: T[]): LinkedList<T> {
        return new LinkedList<T>(elements);
    }

    public static from<T>(iterable: Iterable<T>): LinkedList<T> {
        return new LinkedList<T>(iterable);
    }

    // private insertion and deletion helpers

    private linkFirst(element: T): void {
        const head = this.head;
        const node = new Node(null, element, head);
        this.head = node;
        if (head === null)
            this.tail = node;
        else
            head.prev = node;
        this._size++;
    }

    private linkLast(element: T): void {
        const tail = this.tail;
        const node = new Node(tail, element, null);
        this.tail = node;
        if (tail === null)
            this.head = node;
        else
            tail.next = node;
        this._size++;
    }

    private linkBefore(index: number, element: T): void {
        const successor   = this.node(index);
        const predecessor = successor.prev;
        const node = new Node(predecessor, element, successor);
        if (predecessor === null)
            this.head = node;
        else
            predecessor.next = node;
        this._size++;
    }

    private unlinkFirst(): T | null {
        if (this.head?.next == null) {
            this.clear();
            return null;
        }
        const head = this.head;
        this.head = this.head.next;
        this.head.prev = null;
        this._size--;
        return head.item;
    }

    private unlinkLast(): T | null {
        if (this.tail?.prev == null) {
            this.clear();
            return null;
        }
        const tail = this.tail;
        this.tail = this.tail.prev;
        this.tail.next = null;
        this._size--;
        return tail.item;
    }

    private unlink(node: Node<T>): T | null {
        const { item, next, prev } = node;

        if (prev === null)
            this.head = next;
        else {
            prev.next = next;
            node.prev = null;
        }

        if (next === null)
            this.tail = prev;
        else {
            next.prev = prev;
            node.next = null;
        }

        this._size--;
        return item;
    }

    private traverse(index: number): Node<T> | null {
        let count = 0;
        let node  = this.head;
        while (index !== count) {
            if (node)
                node = node.next;
            count++;
        }
        return node;
    }

    private traverseRight(index: number): Node<T> | null {
        let count = this.lastIndex() - index;
        let node  = this.tail;
        while (count !== 0) {
            if (node)
                node = node.prev;
            count--;
        }
        return node;
    }

    public node(index: number): Node<T> {
        ensurePositiveSize(index = index | 0);
        ensureWithinBounds(this.size(), index);

        if (index < this._size / 2) {
            const found = this.traverse(index);
            if (found === null)
                throw new Utils.NoSuchElementError();
            return found;
        } else {
            const found = this.traverseRight(index);
            if (found === null)
                throw new Utils.NoSuchElementError();
            return found;
        }
    }

    // Implement AbstractCollection

    public filter(predicate: (element: T) => boolean): LinkedList<T>;
    public filter<S extends T>(predicate: (element: T) => boolean): LinkedList<S>;
    public filter(predicate: (element: T) => boolean): LinkedList<T> {
        const list = new LinkedList<T>();
        for (const item of this)
            if (predicate(item))
                list.add(item);
        return list;
    }

    public filterIndexed(predicate: (each: { element: T; index: number; }) => boolean): LinkedList<T>;
    public filterIndexed<S extends T>(predicate: (each: { element: T; index: number; }) => boolean): LinkedList<S>;
    public filterIndexed(predicate: (each: { element: T; index: number; }) => boolean): LinkedList<T> {
        let index = 0;
        const list = new LinkedList<T>();
        for (const item of this)
            if (predicate({ element: item, index: index++ }))
                list.add(item);
        return list;
    }

    public flatMap<U>(transform: (element: T) => LinkedList<U>): LinkedList<U> {
        const list = new LinkedList<U>();
        for (const item of this)
            list.addAll(transform(item));
        return list;
    }

    public flatMapIndexed<U>(transform: (each: { element: T; index: number; }) => LinkedList<U>): LinkedList<U> {
        let index = 0;
        const list = new LinkedList<U>();
        for (const item of this)
            list.addAll(transform({ element: item, index: index++ }));
        return list;
    }

    public flatten(this: Collection<Collection<T>>): LinkedList<T> {
        const list = new LinkedList<T>();
        for (const item of this)
            list.addAll(item);
        return list;
    }

    public iterator(): IterableIterator<T> {
        return this[Symbol.iterator]();
    }

    public map<R>(transform: (element: T) => R): LinkedList<R> {
        const list = new LinkedList<R>();
        for (const item of this)
            list.add(transform(item));
        return list;
    }

    public mapIndexed<R>(transform: (each: { element: T; index: number; }) => R): LinkedList<R> {
        let index = 0;
        const list = new LinkedList<R>();
        for (const item of this)
            list.add(transform({ element: item, index: index++ }));
        return list;
    }

    public onEach(consumer: (element: T) => void): Collection<T> {
        for (const item of this)
            consumer(item);
        return this;
    }

    public onEachIndexed(consumer: (each: { element: T; index: number; }) => void): Collection<T> {
        let index = 0;
        for (const item of this)
            consumer({ element: item, index: index++ });
        return this;
    }

    public size(): number {
        return this._size;
    }

    public unzip<R>(this: LinkedList<[T, R]>): [LinkedList<T>, LinkedList<R>] {
        const first = new LinkedList<T>(),
             second = new LinkedList<R>();
        for (const item of this) {
            first.add(item[0]);
            second.add(item[1]);
        }
        return [first, second];
    }

    public zip<R>(other: Iterable<R>): LinkedList<[T, R]>;
    public zip<R, V>(other: Iterable<R>, transform: (each: { a: T; b: R; }) => V): LinkedList<V>;
    public zip<R, V>(other: Iterable<R>, transform?: (each: { a: T; b: R; }) => V): LinkedList<[T, R]> | LinkedList<V> {
        if (!transform)
            return this.zip<R, [T, R]>(other, ({ a, b }) => [a, b]);

        const list = new LinkedList<V>();
        const selfIt   = this.iterator(), otherIt   = other[Symbol.iterator]();
        let   selfNext = selfIt.next(),   otherNext = otherIt.next();
        while (!selfNext.done && !otherNext.done) {
            list.add(transform({ a: selfNext.value, b: otherNext.value }));
            selfNext  = selfIt.next();
            otherNext = otherIt.next();
        }
        return list;
    }

    // Implement List

    public append(element: T): LinkedList<T> {
        const newList = LinkedList.from(this);
        newList.add(element);
        return newList;
    }

    public appendAll(elements: Iterable<T>): LinkedList<T> {
        const newList = LinkedList.from(this);
        newList.addAll(elements);
        return newList;
    }

    public backwardsIterator(): IterableIterator<T> {
        let node = this.tail;
        return {
            [Symbol.iterator]() { return this; },
            next() {
                if (node === null)
                    return { value: undefined as any, done: true };
                const result = node.item;
                node = node.prev;
                return { value: result, done: false };
            }
        }
    }

    public chunked(size: number): LinkedList<List<T>> {
        ensurePositiveSize(size = size | 0);
        const list = new LinkedList<List<T>>();
        for (let i = 0; i < this.size(); i += size)
            list.add(this.slice(new IntRange(i, i + size - 1)) as any);
        return list;
    }

    public distinct(): LinkedList<T> {
        const observed = new Set<T>();
        const list = new LinkedList<T>();
        for (const item of this)
            if (!observed.has(item)) {
                observed.add(item);
                list.add(item);
            }
        return list;
    }

    public drop(n: number): LinkedList<T> {
        ensurePositiveSize(n = n | 0);
        if (n > this.size())
            return this.takeLast(0);
        return this.takeLast(this.size() - n);
    }

    public dropLast(n: number): LinkedList<T> {
        ensurePositiveSize(n = n | 0);
        if (n > this.size())
            return this.take(0);
        return this.take(this.size() - n);
    }

    public dropLastWhile(predicate: (element: T) => boolean): LinkedList<T> {
        let index = this.lastIndex();
        for (const item of this.backwardsIterator()) {
            if (!predicate(item))
                return this.take(index + 1);
            index--;
        }
        return new LinkedList<T>();
    }

    public dropWhile(predicate: (element: T) => boolean): LinkedList<T> {
        let yielding = false;
        const list = new LinkedList<T>();
        for (const item of this)
            if (yielding)
                list.add(item);
            else if (!predicate(item)) {
                list.add(item);
                yielding = true;
            }
        return list;
    }

    public foldRight<R>(initial: R, operation: (each: { element: T; acc: R; }) => R): R {
        let result = initial;
        for (const item of this.backwardsIterator())
            result = operation({ element: item, acc: result });
        return result;
    }

    public foldRightIndexed<R>(initial: R, operation: (each: { element: T; acc: R; index: number; }) => R): R {
        let index = 0;
        let result = initial;
        for (const item of this.backwardsIterator())
            result = operation({ element: item, acc: result, index: index++ });
        return result;
    }

    public lastIndex(): number {
        return this._size - 1;
    }

    public minus(element: T): LinkedList<T> {
        const list = LinkedList.from(this);
        list.remove(element);
        return list;
    }

    public minusAll(elements: Iterable<T>): LinkedList<T> {
        const list = LinkedList.from(this);
        list.removeAll(element);
        return list;
    }

    public reduceRight<S extends T>(operation: (each: { element: T; acc: S; }) => S): S | null {
        if (this.isEmpty())
            return null;
        
        const iterator = this.backwardsIterator();
        let result = iterator.next().value as S;
        for (const item of iterator)
            result = operation({ element: item, acc: result });
        return result;
    }

    public reduceRightIndexed<S extends T>(operation: (each: { element: T; acc: S; index: number; }) => S): S | null {
        if (this.isEmpty())
            return null;
        
        let index = 0;
        const iterator = this.backwardsIterator();
        let result = iterator.next().value as S;
        for (const item of iterator)
            result = operation({ element: item, acc: result, index: index++ });
        return result;
    }

    public reversed(): LinkedList<T> {
        const list = LinkedList.from(this);
        if (list.size() === 1) return list;
        list.reverse();
        return list;
    }

    public slice(indices: IntRange | Iterable<number>): LinkedList<T> {
        const list = new LinkedList<T>();
        if (this.isEmpty())
            return list;
        for (const index of indices) {
            ensureWithinBounds(this.size(), index | 0);
            list.add(this.elementAt(index | 0) as T);
        }
        return list;
    }

    public sorted<T extends Comparable<T>>(this: LinkedList<T>): LinkedList<T> {
        const list = LinkedList.from(this);
        list.sort();
        return list;
    }

    public sortedDescending<T extends Comparable<T>>(this: LinkedList<T>): LinkedList<T> {
        const list = LinkedList.from(this);
        list.sortDescending();
        return list;
    }

    public sortedBy<R extends Comparable<R>>(selector: (element: T) => R): LinkedList<T> {
        const list = LinkedList.from(this);
        list.sortBy(selector);
        return list;
    }

    public sortedByDescending<R extends Comparable<R>>(selector: (element: T) => R): LinkedList<T> {
        const list = LinkedList.from(this);
        list.sortByDescending(selector);
        return list;
    }

    public sortedWith(comparator: Comparator<T>): LinkedList<T> {
        const list = LinkedList.from(this);
        list.sortWith(comparator);
        return list;
    }

    public sortedWithDescending(comparator: Comparator<T>): LinkedList<T> {
        const list = LinkedList.from(this);
        list.sortWithDescending(comparator);
        return list;
    }

    public take(n: number): LinkedList<T> {
        ensurePositiveSize(n = n | 0);
        if (n === 0)
            return new LinkedList<T>();
        if (n >= this.size())
            return LinkedList.from(this);
        if (n === 1)
            return LinkedList.of(this.first() as T);
        let count = 0;
        const list = new LinkedList<T>();
        for (const item of this) {
            list.add(item);
            if (++count === n)
                break;
        }
        return list;
    }

    public takeLast(n: number): LinkedList<T> {
        ensurePositiveSize(n = n | 0);
        if (n === 0)
            return new LinkedList<T>();
        if (n >= this.size())
            return LinkedList.from(this);
        if (n === 1)
            return LinkedList.of(this.last() as T);
        const list = new LinkedList<T>();
        let node = this.traverseRight(this.size() - n);
        while (node !== null) {
            list.add(node.item);
            node = node.next;
        }
        return list;
    }

    public takeLastWhile(predicate: (element: T) => boolean): LinkedList<T> {
        if (this.isEmpty())
            return new LinkedList<T>();

        let startingIndex = this.lastIndex();
        for (const item of this.backwardsIterator()) {
            if (!predicate(item))
                break;
            startingIndex--;
        }
        return this.takeLast(this.size() - startingIndex);
    }

    public takeWhile(predicate: (element: T) => boolean): LinkedList<T> {
        const list = new LinkedList<T>();
        for (const item of this) {
            if (!predicate(item))
                break;
            list.add(item);
        }
        return list;
    }

    public toArray(): T[] {
        return this.fold<T[]>([], ({ acc, element }) => { acc.push(element); return acc });
    }
    
    // Implement MutableList

    public add(element: T): boolean;
    public add(element: T, index: number): boolean;
    public add(element: T, index?: number): boolean {
        if (typeof index !== "number") {
            this.linkLast(element);
        } else {
            ensurePositiveSize(index = index | 0);
            ensureWithinAddingBounds(this.size(), index);
            this.linkBefore(index, element);
        }
        return true;
    }

    public addAll(elements: Iterable<T>): boolean;
    public addAll(elements: Iterable<T>, index: number): boolean;
    public addAll(elements: Iterable<T>, index?: number): boolean {
        const toAdd = [...elements].length;
        if (toAdd === 0)
            return false;
        if (typeof index !== "number")
            index = this._size;

        ensurePositiveSize(index = index | 0);
        ensureWithinAddingBounds(this.size(), index);

        let predecessor: Node<T> | null,
            successor:   Node<T> | null;
        if (index === this._size) {
            successor   = null;
            predecessor = this.tail;
        } else {
            successor   = this.node(index);
            predecessor = successor.prev;
        }

        for (const element of elements) {
            let node = new Node(predecessor, element, null);
            if (predecessor === null)
                this.head = node;
            else 
                predecessor.next = node;
            predecessor = node;
        }

        if (successor === null)
            this.tail = predecessor;
        else {
            predecessor!.next = successor;
            successor.prev    = predecessor;
        }

        this._size += toAdd;
        return true;
    }

    public clear(): void {
        for (let x = this.head; x !== null; x = x.next) {
            const next = x.next;
            x.next = null;
            x.prev = null;
        }
        this.head = this.tail = null;
        this._size = 0;
    }

    public remove(element: T): boolean {
        for (let node = this.head; node !== null; node = node.next)
            if (node.item === element) {
                this.unlink(node);
                return true;
            }
        return false;
    }

    public removeAll(elements: Iterable<T>): boolean {
        let initialSize = this._size;
        for (const element of elements)
            this.remove(element);
        return initialSize !== this._size;
    }

    public removeAt(index: number): boolean {
        let initialSize = this._size;
        let current = 0;
        for (const item of this)
            if (current++ === index)
                this.remove(item);
        return initialSize !== this._size;
    }

    public reverse(): void {
        let current = this.head;
        let previous: Node<T> | null = null;
        let next:     Node<T> | null = null;
        while (current !== null) {
            // next and previous to current
            next     = current.next;
            previous = current.prev;
            // flip their positions
            current.next = previous;
            current.prev = next;
            // advance them
            previous = current;
            current  = next;
        }
        this.tail = this.head;
        this.head = previous;
    }

    public set(index: number, element: T): T {
        ensurePositiveSize(index = index | 0);
        ensureWithinBounds(this._size, index);
        const node = this.node(index);
        const old  = node.item;
        node.item  = element;
        return old;
    }

    public sort<T extends Comparable<T>>(this: MutableList<T>): void {
        [...this].sort((a, b) => a.compareTo(b))
                 .forEach((value, index) => this.set(index, value));
    }

    public sortDescending<T extends Comparable<T>>(this: MutableList<T>): void {
        [...this].sort((a, b) => b.compareTo(a))
                 .forEach((value, index) => this.set(index, value));
    }

    public sortBy<R extends Comparable<R>>(selector: (element: T) => R): void {
        [...this].sort((a, b) => selector(a).compareTo(selector(b)))
                 .forEach((value, index) => this.set(index, value));
    }

    public sortByDescending<R extends Comparable<R>>(selector: (element: T) => R): void {
        [...this].sort((a, b) => selector(b).compareTo(selector(a)))
                 .forEach((value, index) => this.set(index, value));
    }

    public sortWith(comparator: Comparator<T>): void {
        [...this].sort((a, b) => comparator.compare(a, b))
                 .forEach((value, index) => this.set(index, value));
    }

    public sortWithDescending(comparator: Comparator<T>): void {
        [...this].sort((a, b) => comparator.compare(b, a))
                 .forEach((value, index) => this.set(index, value));
    }

    public [Symbol.iterator](): IterableIterator<T> {
        let node = this.head;
        return {
            [Symbol.iterator]() { return this; },
            next() {
                if (node === null)
                    return { value: undefined as any, done: true };
                const result = node.item;
                node = node.prev;
                return { value: result, done: false };
            }
        }
    }
}

function ensureWithinBounds(size: number, index: number): void {
    if (index < 0 && index >= size)
        throw new Utils.IndexOutOfBoundsError();
}

function ensureWithinAddingBounds(size: number, index: number): void {
    ensureWithinBounds(size + 1, index);
}

function ensurePositiveSize(n: number): void {
    if (n < 0)
        throw new TypeError(`n must be positive. received: ${n}`);
}
import { AbstractCollection } from "../collection/AbstractCollection.js";
import { Collection } from "../collection/Collection.js";
import { ArrayList } from "../list/ArrayList.js";
import { List, MutableList } from "../list/List.js";
import { Sequence } from "../sequence/Sequence.js";
import { Stream } from "../sequence/Stream.js";
import { Utils } from "../utils/Utils.js";

export class IntRange extends AbstractCollection<number> {
    public readonly _first: number;
    public readonly _last: number;
    public readonly step: number;

    constructor(start: number, endInclusive: number, step: number = 1) {
        super();
        if (step === 0) { throw new TypeError("Step can't be zero."); }
        Utils.ensurePositiveSize(step = step | 0);
        Utils.ensurePositiveSize(start = start | 0);
        Utils.ensurePositiveSize(endInclusive = endInclusive | 0);
        this._first = start;
        this._last  = getProgressionLastElement(start, endInclusive, step)
        this.step  = step;
    }

    public override isEmpty(): boolean {
        return this.step > 0 ? this._first > this._last : this._first < this._last;
    }

    public override toString(): string {
        return this.step > 0 
            ? `${this._first}..${this._last} step ${this.step}`
            : `${this._first} down to ${this._last} ' step ' ${-this.step | 0}`;
    }

    // Implement AbstractCollection

    public iterator(): IterableIterator<number> {
        return this[Symbol.iterator]();
    }

    public filter(predicate: (element: number) => boolean): Sequence<number>;
    public filter<S extends number>(predicate: (element: number) => boolean): Sequence<number>;
    public filter(predicate: (element: number) => boolean): Sequence<number> {
        return this.toSequence().filter(predicate);
    }

    public filterIndexed(predicate: (each: { element: number; index: number; }) => boolean): Sequence<number>;
    public filterIndexed<S extends number>(predicate: (each: { element: number; index: number; }) => boolean): Sequence<number>;
    public filterIndexed(predicate: (each: { element: number; index: number; }) => boolean): Sequence<number> {
        return this.toSequence().filterIndexed(predicate);
    }

    public flatMap<U>(transform: (element: number) => Iterable<U>): Sequence<U> {
        return this.toSequence().flatMap(transform);
    }

    public flatMapIndexed<U>(transform: (each: { element: number; index: number; }) => Iterable<U>): Sequence<U> {
        return this.toSequence().flatMapIndexed(transform);
    }

    public flatten(this: Collection<Collection<number>>): never {
        throw new Utils.IllegalStateError(
            "There is literally no way in this world you have an IntRange of IntRanges.");
    }

    public map<R>(transform: (element: number) => R): Sequence<R> {
        return this.toSequence().map(transform);
    }

    public mapIndexed<R>(transform: (each: { element: number; index: number; }) => R): Sequence<R> {
        return this.toSequence().mapIndexed(transform);
    }

    public onEach(consumer: (element: number) => void): IntRange {
        for (const num of this)
            consumer(num);
        return this;
    }

    public onEachIndexed(consumer: (each: { element: number; index: number; }) => void): IntRange {
        let index = 0;
        for (const num of this)
            consumer({ element: num, index: index++ });
        return this;
    }

    public size(): number {
        return ((Math.abs(this._last) - Math.abs(this._first)) | 0);
    }

    public toList(): List<number> {
        return ArrayList.from(this);
    }

    public toMutableList(): MutableList<number> {
        return ArrayList.from(this);
    }

    public toSequence(): Sequence<number> {
        return Stream.from(this);
    }

    public unzip<R>(this: Collection<[number, R]>): never {
        throw new Utils.IllegalStateError(
            "There is literally no way in this world you have an IntRange of [number, R] pairs.");
    }

    public zip<R>(other: Iterable<R>): Sequence<[number, R]>;
    public zip<R, V>(other: Iterable<R>, transform: (each: { a: number; b: R; }) => V): Sequence<V>;
    public zip<R, V>(other: Iterable<R>, transform?: (each: { a: number; b: R; }) => V): Sequence<[number, R]> | Sequence<V> {
        if (!transform)
            return this.zip<R, [number, R]>(other, ({ a, b }) => [a, b]);
        
        return this.toSequence().zip(other, transform);
    }

    public [Symbol.iterator](): IterableIterator<number> {
        const self = this;
        let hasNext = this.step > 0 ? this._first <= this._last : this._first >= this._last;
        let next = hasNext ? this._first : this._last;
        return {
            [Symbol.iterator]() { return this; },
            next() {
                let value = next;
                if ((self.step < 0 && value === self._last) 
                 || (self.step > 0 && value >   self._last)) {
                    if (!hasNext)
                        return { value: undefined as any, done: true }
                    hasNext = false;
                } else
                    next = next + self.step | 0;
                return { value, done: !hasNext };
            }
        }
    }
}

function getProgressionLastElement(start: number, end: number, step: number) {
         if (step > 0) { return start >= end ? end : end - differenceModulo(end, start, step) | 0; }
    else if (step < 0) { return start <= end ? end : end + differenceModulo(start, end, -step | 0) | 0; }
    else               { throw new TypeError('Step is zero.'); }
}

function differenceModulo(a: number, b: number, c: number) {
    return ((a % c) - (b % c) | 0) % c;
}
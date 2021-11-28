import { ArrayList } from "../list/ArrayList.js";
import { List } from "../list/List.js";

export class IntRange implements Iterable<number> {
    public readonly first: number;
    public readonly last: number;
    public readonly step: number;

    constructor(start: number, endInclusive: number, step: number = 1) {
        if (step === 0) { throw new TypeError("Step can't be zero."); }
        this.first = start;
        this.last  = getProgressionLastElement(start, endInclusive, step)
        this.step  = step;
    }

    public forEach(action: (n: number) => void): void {
        for (const number of this) {
            action(number);
        }
    }

    public isEmpty(): boolean {
        return this.step > 0 ? this.first > this.last : this.first < this.last;
    }

    public iterator(): IntRangeIterator {
        return this[Symbol.iterator]();
    }

    public asList(): List<number> {
        return ArrayList.from(this);
    }

    public toString(): string {
        return this.step > 0 
            ? `${this.first}..${this.last} step ${this.step}`
            : `${this.first} down to ${this.last} ' step ' ${-this.step | 0}`;
    }

    [Symbol.iterator](): IntRangeIterator {
        return new IntRangeIterator(this.first, this.last, this.step);
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

export default class IntRangeIterator implements IterableIterator<number> {
    private _hasNext: boolean;
    private _next: number;
    private last: number;
    private step: number;
    constructor(first: number, last: number, step: number) {
        this.last = last;
        this.step = step;
        this._hasNext = this.step > 0 ? first <= last : first >= last;
        this._next = this._hasNext ? first : this.last;
    }

    public next() {
        let value = this._next;
        if ((this.step < 0 && value === this.last) || (this.step > 0 && value > this.last)) {
            if (!this._hasNext) {
                return { value: undefined as any, done: true }
            }
            this._hasNext = false;
        } else { 
            this._next = this._next + this.step | 0;
        }
        return { value, done: !this._hasNext };
    }

    [Symbol.iterator]() { return this; }
}
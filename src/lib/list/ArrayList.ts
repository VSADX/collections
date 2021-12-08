import { AbstractCollection } from "../collection/AbstractCollection.js";
import { Collection } from "../collection/Collection.js";
import { IntRange } from "../iterables/IntRange.js";
import { Sequence } from "../sequence/Sequence.js";
import { Stream } from "../sequence/Stream.js";
import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";
import { Utils } from "../utils/Utils.js";
import { List, MutableList } from "./List.js";

export class ArrayList<T> extends AbstractCollection<T> implements MutableList<T> {
    private _values: T[];

    private constructor(values: T[] = []) {
        super();
        this._values = values;
    }

    public static of<T>(...elements: T[]): ArrayList<T> {
        return new ArrayList(elements);
    }

    public static from<T>(iterable: Iterable<T>): ArrayList<T> {
        const list = new ArrayList<T>();
        for (const element of iterable)
            list.add(element);
        return list;
    }

    public static empty<T>(): ArrayList<T> {
        return new ArrayList<T>();
    }

    // Random Access optimizations

    public override count(): number;
    public override count(predicate: (element: T) => boolean): number;
    public override count(predicate?: (element: T) => boolean): number {
        let count = 0;
        if (!predicate)
            return this.size();
        else {
            for (const item of this)
                if (predicate(item)) 
                    count++;
        }
        return count;
    }

    public override elementAt(index: number): T | undefined {
        Utils.ensurePositiveSize(index = index | 0);
        Utils.ensureWithinBounds(this._values.length, index);
        return this._values[index];
    }

    public override first(): T | undefined {
        return this._values[0];
    }

    public override last(): T | undefined {
        return this._values[this.lastIndex()];
    }

    // Backwards Iteration optimizations

    public override findLast(predicate: (element: T) => boolean): T | undefined {
        for (const item of this.backwardsIterator())
            if (predicate(item))
                return item;
        return undefined;
    }

    public override findLastIndex(predicate: (element: T) => boolean): number {
        let index = this.lastIndex();
        for (const item of this.backwardsIterator()) {
            if (predicate(item))
                return index;
            index--;
        }
        return -1;
    }

    public override lastIndexOf(element: T): number {
        let index = this.lastIndex();
        for (const item of this.backwardsIterator()) {
            if (item === element)
                return index;
            index--;
        }
        return -1;
    }

    // Implement AbstractCollection

    public filter(predicate: (element: T) => boolean): ArrayList<T>;
    public filter<S extends T>(predicate: (element: T) => boolean): ArrayList<S>;
    public filter(predicate: (element: T) => boolean): ArrayList<T> {
        const list = new ArrayList<T>();
        for (const item of this)
            if (predicate(item))
                list.add(item);
        return list;
    }

    public filterIndexed(predicate: (each: { element: T; index: number; }) => boolean): ArrayList<T>;
    public filterIndexed<S extends T>(predicate: (each: { element: T; index: number; }) => boolean): ArrayList<S>;
    public filterIndexed(predicate: (each: { element: T; index: number; }) => boolean): ArrayList<T> {
        let index = 0;
        const list = new ArrayList<T>();
        for (const item of this)
            if (predicate({ element: item, index: index++ }))
                list.add(item);
        return list;
    }

    public flatMap<U>(transform: (element: T) => ArrayList<U>): ArrayList<U> {
        const list = new ArrayList<U>();
        for (const item of this)
            list.addAll(transform(item));
        return list;
    }

    public flatMapIndexed<U>(transform: (each: { element: T; index: number; }) => ArrayList<U>): ArrayList<U> {
        let index = 0;
        const list = new ArrayList<U>();
        for (const item of this)
            list.addAll(transform({ element: item, index: index++ }));
        return list;
    }

    public flatten(this: Collection<Collection<T>>): ArrayList<T> {
        const list = new ArrayList<T>();
        for (const item of this)
            list.addAll(item);
        return list;
    }

    public iterator(): IterableIterator<T> {
        return this[Symbol.iterator]();
    }

    public map<R>(transform: (element: T) => R): ArrayList<R> {
        const list = new ArrayList<R>();
        for (const item of this)
            list.add(transform(item));
        return list;
    }

    public mapIndexed<R>(transform: (each: { element: T; index: number; }) => R): ArrayList<R> {
        let index = 0;
        const list = new ArrayList<R>();
        for (const item of this)
            list.add(transform({ element: item, index: index++ }));
        return list;
    }

    public onEach(consumer: (element: T) => void): ArrayList<T> {
        for (const item of this)
            consumer(item);
        return this;
    }

    public onEachIndexed(consumer: (each: { element: T; index: number; }) => void): ArrayList<T> {
        let index = 0;
        for (const item of this)
            consumer({ element: item, index: index++ });
        return this;
    }

    public size(): number {
        return this._values.length;
    }

    public toList(): List<T> {
        return this;
    }

    public toMutableList(): MutableList<T> {
        return this;
    }

    public toSequence(): Sequence<T> {
        return Stream.from(this);
    }

    public unzip<R>(this: ArrayList<[T, R]>): [ArrayList<T>, ArrayList<R>] {
        const first = new ArrayList<T>(),
             second = new ArrayList<R>();
        for (const item of this) {
            first.add(item[0]);
            second.add(item[1]);
        }
        return [first, second];
    }

    public zip<R>(other: Iterable<R>): ArrayList<[T, R]>;
    public zip<R, V>(other: Iterable<R>, transform: (each: { a: T; b: R; }) => V): ArrayList<V>;
    public zip<R, V>(other: Iterable<R>, transform?: (each: { a: T; b: R; }) => V): ArrayList<[T, R]> | ArrayList<V> {
        if (!transform)
            return this.zip<R, [T, R]>(other, ({ a, b }) => [a, b]);
        
        const list = new ArrayList<V>();
        const selfIt   = this.iterator(), otherIt   = other[Symbol.iterator]();
        let   selfNext = selfIt.next()  , otherNext = otherIt.next();
        while (!selfNext.done && !otherNext.done) {
            list.add(transform({ a: selfNext.value, b: otherNext.value }));
            selfNext  = selfIt.next();
            otherNext = otherIt.next();
        }
        return list;
    }

    // Implement List

    public append(element: T): ArrayList<T> {
        const newList = ArrayList.from(this);
        newList.add(element);
        return newList;
    }

    public appendAll(elements: Iterable<T>): ArrayList<T> {
        const newList = ArrayList.from(this);
        newList.addAll(elements);
        return newList;
    }

    public backwardsIterator(): IterableIterator<T> {
        const self = this;
        let index  = this.lastIndex();
        return {
            [Symbol.iterator]() { return this; },
            next() {
                if (index < 0) {
                    return { value: undefined as any, done: true };
                }
                else return { value: self.elementAt(index--) as T, done: false };
            }
        }
    }

    public chunked(size: number): ArrayList<List<T>> {
        Utils.ensurePositiveSize(size = size | 0);
        const list = new ArrayList<List<T>>();
        for (let i = 0; i < this.size(); i += size)
            list.add(this.slice(new IntRange(i, i + size - 1)));
        return list;
    }

    public distinct(): ArrayList<T> {
        const observed = new Set<T>();
        const list = new ArrayList<T>();
        for (const item of this)
            if (!observed.has(item)) {
                observed.add(item);
                list.add(item);
            }
        return list;
    }

    public distinctBy<K>(selector: (element: T) => K): ArrayList<T> {
        const observed = new Set<K>();
        const list = new ArrayList<T>();
        for (const item of this) {
            const key = selector(item);
            if (!observed.has(key)) {
                observed.add(key);
                list.add(item);
            }
        }
        return list;
    }

    public drop(n: number): ArrayList<T> {
        Utils.ensurePositiveSize(n = n | 0);
        if (n > this.size()) 
            return this.takeLast(0);
        return this.takeLast(this.size() - n);
    }
    
    public dropLast(n: number): ArrayList<T> {
        Utils.ensurePositiveSize(n = n | 0);
        if (n > this.size())
            return this.take(0);
        return this.take(this.size() - n);
    }
    
    public dropLastWhile(predicate: (element: T) => boolean): ArrayList<T> {
        let index = this.lastIndex();
        while (index > -1) {
            if (!predicate(this.elementAt(index) as T))
                return this.take(index + 1);
            index--;
        }
        return new ArrayList<T>();
    }

    public dropWhile(predicate: (element: T) => boolean): ArrayList<T> {
        let yielding = false;
        const list = new ArrayList<T>();
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
        return this._values.length - 1;
    }

    public minus(element: T): ArrayList<T> {
        const list = ArrayList.from(this);
        list.remove(element);
        return list;
    }

    public minusAll(elements: Iterable<T>): ArrayList<T> {
        const list = ArrayList.from(this);
        list.removeAll(elements);
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

    public reversed(): ArrayList<T> {
        const list = ArrayList.from(this);
        if (list.size() === 1) return list;
        list.reverse();
        return list;
    }

    public slice(indices: Iterable<number> | IntRange): ArrayList<T> {
        const list = new ArrayList<T>();
        if (this.isEmpty())
            return list;
        for (const index of indices) {
            const element = this.elementAt(index | 0);
            if (element !== undefined) list.add(element);
        }
        return list;
    }

    public sorted<T extends Comparable<T>>(this: ArrayList<T>): ArrayList<T> {
        const list = ArrayList.from(this);
        list.sort();
        return list;
    }

    public sortedDescending<T extends Comparable<T>>(this: ArrayList<T>): ArrayList<T> {
        const list = ArrayList.from(this);
        list.sortDescending();
        return list;
    }

    public sortedBy<R extends Comparable<R>>(selector: (element: T) => R): ArrayList<T> {
        const list = ArrayList.from(this);
        list.sortBy(selector);
        return list;
    }

    public sortedByDescending<R extends Comparable<R>>(selector: (element: T) => R): ArrayList<T> {
        const list = ArrayList.from(this);
        list.sortByDescending(selector);
        return list;
    }

    public sortedWith(comparator: Comparator<T>): ArrayList<T> {
        const list = ArrayList.from(this);
        list.sortWith(comparator);
        return list;
    }

    public sortedWithDescending(comparator: Comparator<T>): ArrayList<T> {
        const list = ArrayList.from(this);
        list.sortWithDescending(comparator);
        return list;
    }

    public take(n: number): ArrayList<T> {
        Utils.ensurePositiveSize(n = n | 0);
        if (n === 0)
            return new ArrayList<T>();
        if (n >= this.size())
            return ArrayList.from(this);
        if (n === 1)
            return ArrayList.of(this.first() as T);
        let count = 0;
        const list = new ArrayList<T>();
        for (const item of this) {
            list.add(item);
            if (++count === n)
                break;
        }
        return list;
    }

    public takeLast(n: number): ArrayList<T> {
        Utils.ensurePositiveSize(n = n | 0);
        if (n === 0) 
            return new ArrayList<T>();
        if (n >= this.size())
            return ArrayList.from(this);
        if (n === 1)
            return ArrayList.of(this.last() as T);
        const list = new ArrayList<T>();
        for (let i = this.size() - n; i < this.size(); i++)
            list.add(this.elementAt(i) as T);
        return list;
    }

    public takeLastWhile(predicate: (element: T) => boolean): ArrayList<T> {
        if (this.isEmpty())
            return new ArrayList<T>();

        let startingIndex = this.lastIndex();
        for (const item of this.backwardsIterator()) {
            if (!predicate(item))
                break;
            startingIndex--;
        }
        return this.takeLast(this.size() - startingIndex);
    }
    
    public takeWhile(predicate: (element: T) => boolean): ArrayList<T> {
        const list = new ArrayList<T>();
        for (const item of this) {
            if (!predicate(item))
                break;
            list.add(item);
        }
        return list;
    }

    // Implement MutableList

    public add(element: T): boolean;
    public add(element: T, index: number): boolean;
    public add(element: T, index?: number): boolean {
        if (typeof index !== "number")
            return this.add(element, this.size());

        Utils.ensurePositiveSize(index = index | 0);
        Utils.ensureWithinAddingBounds(this._values.length, index);
        this._values.splice(index, 0, element);
        return true;
    }

    public addAll(elements: Iterable<T>): boolean
    public addAll(elements: Iterable<T>, index: number): boolean
    public addAll(elements: Iterable<T>, index?: number): boolean {
        if (typeof index !== "number")
            return this.addAll(elements, this.size());

        Utils.ensurePositiveSize(index = index | 0);
        Utils.ensureWithinAddingBounds(this._values.length, index);
        this._values.splice(index, 0, ...elements);
        return true;
    }

    public clear(): void {
        this._values = [];
    }

    public remove(element: T): boolean {
        const index = this.indexOf(element);
        if (index < 0) 
            return false;

        this._values.splice(index, 1);
        return true;
    }

    public removeAll(elements: Iterable<T>): boolean {
        let atLeastOneRemoved = false;
        for (const element of elements) {
            const index = this.indexOf(element);
            if (index >= 0) {
                this._values.splice(index, 1);
                atLeastOneRemoved = true;
            }
        }
        return atLeastOneRemoved;
    }

    public removeAt(index: number): boolean {
        Utils.ensurePositiveSize(index = index | 0);
        Utils.ensureWithinBounds(this._values.length, index);
        return this._values.splice(index, 1).length > 0;
    }

    public reverse(): void {
        let left = 0;
        let right = this.lastIndex();

        while (left < right) {
            let temp = this._values[left]!;
            this._values[left] = this._values[right]!;
            this._values[right] = temp;

            left++;
            right--;
        }
    }

    public set(index: number, element: T): T {
        Utils.ensurePositiveSize(index = index | 0);
        Utils.ensureWithinAddingBounds(this._values.length, index);
        return this._values.splice(index, 1, element)[0] as T;
    }

    public sort<T extends Comparable<T>>(this: ArrayList<T>): void {
        this._values.sort((a, b) => a.compareTo(b));
    }

    public sortDescending<T extends Comparable<T>>(this: ArrayList<T>): void {
        this._values.sort((a, b) => b.compareTo(a));
    }

    public sortBy<R extends Comparable<R>>(selector: (element: T) => R): void {
        this._values.sort((a, b) => selector(a).compareTo(selector(b)));
    }

    public sortByDescending<R extends Comparable<R>>(selector: (element: T) => R): void {
        this._values.sort((a, b) => selector(b).compareTo(selector(a)));
    }

    public sortWith(comparator: Comparator<T>): void {
        this._values.sort((a, b) => comparator.compare(a, b));
    }

    public sortWithDescending(comparator: Comparator<T>): void {
        this._values.sort((a, b) => comparator.compare(b, a));
    }

    public [Symbol.iterator](): IterableIterator<T> {
        const self = this;
        let index  = 0;
        return {
            [Symbol.iterator]() { return this; },
            next() {
                if (index >= self.size()) {
                    return { value: undefined as any, done: true };
                }
                else return { value: self.elementAt(index++) as T, done: false };
            }
        }
    }
}
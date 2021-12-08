import { AbstractCollection } from "../collection/AbstractCollection.js";
import { Collection } from "../collection/Collection.js";
import { IntRange } from "../iterables/IntRange.js";
import { ArrayList } from "../list/ArrayList.js";
import { List, MutableList } from "../list/List.js";
import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";
import { Utils } from "../utils/Utils.js";
import { Sequence } from "./Sequence.js";

export declare class Stream<T>
        extends AbstractCollection<T>
        implements Sequence<T> {
    
    protected readonly _values: Iterable<T>;
    protected readonly _size: number;

    protected constructor(iterable: Iterable<T>, size?: number);

    public static of<T>(...elements: T[]): Stream<T>;
    public static from<T>(iterable: Iterable<T>): Stream<T>;
    public static empty<T>(): Stream<T>;
    public static generate<T>(initial: T, nextValue: (current: T) => T | null): Stream<T>;
    public static continually<T>(continuous: T | (() => T)): Stream<T>;

    public append(element: T): Stream<T>;
    public appendAll(elements: Iterable<T>): Stream<T>;
    public chunked(size: number): Stream<Sequence<T>>;
    public constrainedOnce(): Stream<T>;
    public distinct(): Stream<T>;
    public distinctBy<K>(selector: (item: T) => K): Stream<T>;
    public drop(n: number): Stream<T>;
    public dropWhile(predicate: (element: T) => boolean): Stream<T>;
    public portion(start: number, endExclusive: number): Stream<T>;
    public slice(indices: Iterable<number> | IntRange): Stream<T>;
    public sorted<T extends Comparable<T>>(this: Sequence<T>): Stream<T>;
    public sortedDescending<T extends Comparable<T>>(this: Sequence<T>): Stream<T>;
    public sortedBy<R extends Comparable<R>>(selector: (element: T) => R): Stream<T>;
    public sortedByDescending<R extends Comparable<R>>(selector: (element: T) => R): Stream<T>;
    public sortedWith(comparator: Comparator<T>): Stream<T>;
    public sortedWithDescending(comparator: Comparator<T>): Stream<T>;
    public take(n: number): Stream<T>;
    public takeWhile(predicate: (element: T) => boolean): Stream<T>;

    public filter(predicate: (element: T) => boolean): Stream<T>;
    public filter<S extends T>(predicate: (element: T) => boolean): Stream<S>;
    public filterIndexed(predicate: (each: { element: T; index: number; }) => boolean): Stream<T>;
    public filterIndexed<S extends T>(predicate: (each: { element: T; index: number; }) => boolean): Stream<S>;
    public flatMap<U>(transform: (element: T) => Iterable<U>): Stream<U>;
    public flatMapIndexed<U>(transform: (each: { element: T; index: number; }) => Iterable<U>): Stream<U>;
    public flatten(this: Sequence<Collection<T>>): Stream<T>;
    public iterator(): IterableIterator<T>;
    public map<R>(transform: (element: T) => R): Stream<R>;
    public mapIndexed<R>(transform: (each: { element: T; index: number; }) => R): Stream<R>;
    public onEach(consumer: (element: T) => void): Stream<T>;
    public onEachIndexed(consumer: (each: { element: T; index: number; }) => void): Stream<T>;
    public size(): number;
    public toList(): List<T>;
    public toMutableList(): MutableList<T>;
    public toSequence(): Sequence<T>;
    public unzip<R>(this: Stream<[T, R]>): [List<T>, List<R>];
    public zip<R>(other: Iterable<R>): Stream<[T, R]>;
    public zip<R, V>(other: Iterable<R>, transform: (each: { a: T; b: R; }) => V): Stream<V>;
    
    public [Symbol.iterator](): IterableIterator<T>;
}
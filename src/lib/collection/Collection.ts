import { List, MutableList } from "../list/List.js";
import { Sequence } from "../sequence/Sequence.js";
import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";

export interface Collection<T> extends Iterable<T> {
    [Symbol.iterator](): IterableIterator<T>;
    
    allMatch(predicate: (element: T) => boolean): boolean;
    anyMatch(predicate: (element: T) => boolean): boolean;
    associate<K, V>(transform: (element: T) => [K, V]): Map<K, V>;
    associateBy<K>(selector: (element: T) => K): Map<K, T>;
    associateBy<K, V>(keySelector: (element: T) => K, valueTransform: (element: T) => V): Map<K, V>;
    associateWith<V>(valueSelector: (element: T) => V): Map<T, V>;
    contains(element: T): boolean;
    containsAll(elements: Iterable<T>): boolean;
    count(): number;
    count(predicate: (element: T) => boolean): number;
    elementAt(index: number): T | undefined;
    filter(predicate: (element: T) => boolean): Collection<T>;
    filter<S extends T>(predicate: (element: T) => boolean): Collection<S>;
    filterIndexed(predicate: (each: { element: T, index: number }) => boolean): Collection<T>;
    filterIndexed<S extends T>(predicate: (each: { element: T, index: number }) => boolean): Collection<S>;
    //filterNot(predicate: (element: T) => boolean): Collection<T>;
    //filterNotNull(this: Collection<T | null>, predicate: (element: T) => boolean): Collection<T>;
    find(predicate: (element: T) => boolean): T | undefined;
    findIndex(predicate: (element: T) => boolean): number;
    findLast(predicate: (element: T) => boolean): T | undefined;
    findLastIndex(predicate: (element: T) => boolean): number;
    first(): T | undefined;
    flatMap<U>(transform: (element: T) => Iterable<U>): Collection<U>;
    flatMapIndexed<U>(transform: (each: { element: T, index: number}) => Iterable<U>): Collection<U>;
    flatten(this: Collection<Collection<T>>): Collection<T>;
    fold<R>(initial: R, operation: (each: { acc: R, element: T }) => R): R;
    foldIndexed<R>(initial: R, operation: (each: { acc: R, element: T, index: number }) => R): R;
    forEach(consumer: (element: T) => void): void;
    forEachIndexed(consumer: (each: { element: T, index: number }) => void): void;
    //groupBy<K>(selector: (element: T) => K): Map<K, Collection<T>>;
    //groupBy<K, V>(keySelector: (element: T) => K, valueTransform: (element: T) => V): Map<K, Collection<V>>;
    indexOf(element: T): number;
    isEmpty(): boolean;
    isNotEmpty(): boolean;
    iterator(): IterableIterator<T>;
    join(): string;
    join(options: { separator?: string, prefix?: string, postfix?: string, limit?: number, truncated?: string, transform?: (item: T) => string }): string;
    last(): T | undefined;
    lastIndexOf(element: T): number;
    map<R>(transform: (element: T) => R): Collection<R>;
    mapIndexed<R>(transform: (each: { element: T, index: number}) => R): Collection<R>;
    max<T extends Comparable<T>>(this: Collection<T>): T | null;
    maxBy<R extends Comparable<R>>(selector: (element: T) => R): T | null;
    maxOf(selector: (element: T) => number): T | null;
    maxWith(comparator: Comparator<T>): T | null;
    min<T extends Comparable<T>>(this: Collection<T>): T | null;
    minBy<R extends Comparable<R>>(selector: (element: T) => R): T | null;
    minOf(selector: (element: T) => number): T | null;
    minWith(comparator: Comparator<T>): T | null;
    noneMatch(predicate: (element: T) => boolean): boolean;
    onEach(consumer: (element: T) => void): Collection<T>;
    onEachIndexed(consumer: (each: { element: T, index: number }) => void): Collection<T>;
    reduce<S extends T>(operation: (each: { acc: S, element: T }) => S): S | null;
    reduceIndexed<S extends T>(operation: (each: { acc: S, element: T, index: number }) => S): S | null;
    // scan and scanindexed
    // sorted, sortedDescending
    // sortedBy, sortedByDescending
    // sortedWith, sortedWithDescending
    size(): number;
    toArray(): T[];
    toCollection(): Collection<T>;
    toIterable(): Iterable<T>;
    toList(): List<T>;
    toMutableList(): MutableList<T>;
    toSequence(): Sequence<T>;
    unzip<R>(this: Collection<[T, R]>): [Collection<T>, Collection<R>];
    zip<R>(other: Iterable<R>): Collection<[T, R]>
    zip<R, V>(other: Iterable<R>, transform: (each: { a: T, b: R }) => V): Collection<V>;
}
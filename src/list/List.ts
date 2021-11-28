import { Collection } from "../collection/Collection.js";
import { IntRange } from "../iterables/IntRange.js";
import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";

export interface List<T> extends Collection<T> {
    append(element: T): List<T>;
    appendAll(elements: Iterable<T>): List<T>;
    backwardsIterator(): IterableIterator<T>;
    chunked(size: number): List<List<T>>;
    distinct(): List<T>;
    drop(n: number): List<T>;
    dropLast(n: number): List<T>;
    dropLastWhile(predicate: (element: T) => boolean): List<T>;
    dropWhile(predicate: (element: T) => boolean): List<T>;
    foldRight<R>(initial: R, operation: (each: { element: T, acc: R }) => R): R;
    foldRightIndexed<R>(initial: R, operation: (each: { element: T, acc: R, index: number }) => R): R;
    lastIndex(): number;
    minus(element: T): List<T>;
    minusAll(elements: Iterable<T>): List<T>;
    reduceRight<S extends T>(operation: (each: { element: T, acc: S }) => S): S | null;
    reduceRightIndexed<S extends T>(operation: (each: { element: T, acc: S, index: number }) => S): S | null;
    reversed(): List<T>;
    slice(indices: Iterable<number> | IntRange): List<T>;
    sorted<T extends Comparable<T>>(this: Iterable<T>): List<T>;
    sortedDescending<T extends Comparable<T>>(this: Iterable<T>): List<T>;
    sortedBy<R extends Comparable<R>>(selector: (element: T) => R): List<T>;
    sortedByDescending<R extends Comparable<R>>(selector: (element: T) => R): List<T>;
    sortedWith(comparator: Comparator<T>): List<T>;
    sortedWithDescending(comparator: Comparator<T>): List<T>;
    take(n: number): List<T>;
    takeLast(n: number): List<T>;
    takeLastWhile(predicate: (element: T) => boolean): List<T>;
    takeWhile(predicate: (element: T) => boolean): List<T>;
    toArray(): T[];

    // * change return types of Collection-returning methods for List

    filter(predicate: (element: T) => boolean): List<T>;
    filter<S extends T>(predicate: (element: T) => boolean): List<S>;
    filterIndexed(predicate: (each: { element: T, index: number }) => boolean): List<T>;
    filterIndexed<S extends T>(predicate: (each: { element: T, index: number }) => boolean): List<S>;
    //filterNot(predicate: (element: T) => boolean): List<T>;
    //filterNotNull(this: List<T | null>, predicate: (element: T) => boolean): List<T>;
    flatMap<U>(transform: (element: T) => List<U>): List<U>;
    flatMapIndexed<U>(transform: (each: { element: T, index: number}) => List<U>): List<U>;
    flatten(this: Collection<Collection<T>>): List<T>;
    //groupBy<K>(selector: (element: T) => K): Map<K, List<T>>;
    //groupBy<K, V>(keySelector: (element: T) => K, valueTransform: (element: T) => V): Map<K, List<V>>;
    map<R>(transform: (element: T) => R): List<R>;
    mapIndexed<R>(transform: (each: { element: T, index: number}) => R): List<R>;
    onEach(consumer: (element: T) => void): List<T>;
    onEachIndexed(consumer: (each: { element: T, index: number }) => void): List<T>;
    // scan and scanindexed
    unzip<R>(this: List<[T, R]>): [List<T>, List<R>];
    zip<R>(other: Iterable<R>): List<[T, R]>
    zip<R, V>(other: Iterable<R>, transform: (each: { a: T, b: R }) => V): List<V>;
}

export interface MutableList<T> extends List<T> {
    add(element: T): boolean;
    add(element: T, index: number): boolean;
    addAll(elements: Iterable<T>): boolean;
    addAll(elements: Iterable<T>, index: number): boolean;
    clear(): void;
    remove(element: T): boolean;
    removeAll(elements: Iterable<T>): boolean;
    removeAt(index: number): boolean;
    reverse(): void;
    set(index: number, element: T): T;
    sort<T extends Comparable<T>>(this: MutableList<T>): void;
    sortDescending<T extends Comparable<T>>(this: MutableList<T>): void;
    sortBy<R extends Comparable<R>>(selector: (element: T) => R): void;
    sortByDescending<R extends Comparable<R>>(selector: (element: T) => R): void;
    sortWith(comparator: Comparator<T>): void;
    sortWithDescending(comparator: Comparator<T>): void;
}
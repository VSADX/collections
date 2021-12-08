import { Collection } from "../collection/Collection.js";
import { IntRange } from "../iterables/IntRange.js";
import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";

export declare interface List<T> extends Collection<T> {
    append(element: T): List<T>;
    appendAll(elements: Iterable<T>): List<T>;
    backwardsIterator(): IterableIterator<T>;
    chunked(size: number): List<List<T>>;
    distinct(): List<T>;
    distinctBy<K>(selector: (item: T) => K): List<T>;
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
    sorted<T extends Comparable<T>>(this: List<T>): List<T>;
    sortedDescending<T extends Comparable<T>>(this: List<T>): List<T>;
    sortedBy<R extends Comparable<R>>(selector: (element: T) => R): List<T>;
    sortedByDescending<R extends Comparable<R>>(selector: (element: T) => R): List<T>;
    sortedWith(comparator: Comparator<T>): List<T>;
    sortedWithDescending(comparator: Comparator<T>): List<T>;
    take(n: number): List<T>;
    takeLast(n: number): List<T>;
    takeLastWhile(predicate: (element: T) => boolean): List<T>;
    takeWhile(predicate: (element: T) => boolean): List<T>;

    filter(predicate: (element: T) => boolean): List<T>;
    filter<S extends T>(predicate: (element: T) => boolean): List<S>;
    filterIndexed(predicate: (each: { element: T, index: number }) => boolean): List<T>;
    filterIndexed<S extends T>(predicate: (each: { element: T, index: number }) => boolean): List<S>;
    flatMap<U>(transform: (element: T) => Iterable<U>): List<U>;
    flatMapIndexed<U>(transform: (each: { element: T, index: number}) => Iterable<U>): List<U>;
    flatten(this: List<Collection<T>>): List<T>;
    map<R>(transform: (element: T) => R): List<R>;
    mapIndexed<R>(transform: (each: { element: T, index: number}) => R): List<R>;
    onEach(consumer: (element: T) => void): List<T>;
    onEachIndexed(consumer: (each: { element: T, index: number }) => void): List<T>;
    unzip<R>(this: List<[T, R]>): [List<T>, List<R>];
    zip<R>(other: Iterable<R>): List<[T, R]>
    zip<R, V>(other: Iterable<R>, transform: (each: { a: T, b: R }) => V): List<V>;
}

export declare interface MutableList<T> extends List<T> {
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

    filter(predicate: (element: T) => boolean): MutableList<T>;
    filter<S extends T>(predicate: (element: T) => boolean): MutableList<S>;
    filterIndexed(predicate: (each: { element: T, index: number }) => boolean): MutableList<T>;
    filterIndexed<S extends T>(predicate: (each: { element: T, index: number }) => boolean): MutableList<S>;
    flatMap<U>(transform: (element: T) => Iterable<U>): MutableList<U>;
    flatMapIndexed<U>(transform: (each: { element: T, index: number}) => Iterable<U>): MutableList<U>;
    flatten(this: MutableList<Collection<T>>): MutableList<T>;
    map<R>(transform: (element: T) => R): MutableList<R>;
    mapIndexed<R>(transform: (each: { element: T, index: number}) => R): MutableList<R>;
    onEach(consumer: (element: T) => void): MutableList<T>;
    onEachIndexed(consumer: (each: { element: T, index: number }) => void): MutableList<T>;
    unzip<R>(this: MutableList<[T, R]>): [MutableList<T>, MutableList<R>];
    zip<R>(other: Iterable<R>): MutableList<[T, R]>
    zip<R, V>(other: Iterable<R>, transform: (each: { a: T, b: R }) => V): MutableList<V>;
}
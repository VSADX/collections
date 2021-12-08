import { Collection } from "../collection/Collection.js";
import { IntRange } from "../iterables/IntRange.js";
import { List } from "../list/List.js";
import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";

export declare interface Sequence<T> extends Collection<T> {
    append(element: T): Sequence<T>;
    appendAll(elements: Iterable<T>): Sequence<T>;
    chunked(size: number): Sequence<Sequence<T>>;
    constrainedOnce(): Sequence<T>;
    distinct(): Sequence<T>;
    distinctBy<K>(selector: (item: T) => K): Sequence<T>;
    drop(n: number): Sequence<T>;
    dropWhile(predicate: (element: T) => boolean): Sequence<T>;
    portion(start: number, endExclusive: number): Sequence<T>;
    slice(indices: Iterable<number> | IntRange): Sequence<T>;
    sorted<T extends Comparable<T>>(this: Sequence<T>): Sequence<T>;
    sortedDescending<T extends Comparable<T>>(this: Sequence<T>): Sequence<T>;
    sortedBy<R extends Comparable<R>>(selector: (element: T) => R): Sequence<T>;
    sortedByDescending<R extends Comparable<R>>(selector: (element: T) => R): Sequence<T>;
    sortedWith(comparator: Comparator<T>): Sequence<T>;
    sortedWithDescending(comparator: Comparator<T>): Sequence<T>;
    take(n: number): Sequence<T>;
    takeWhile(predicate: (element: T) => boolean): Sequence<T>;

    filter(predicate: (element: T) => boolean): Sequence<T>;
    filter<S extends T>(predicate: (element: T) => boolean): Sequence<S>;
    filterIndexed(predicate: (each: { element: T, index: number }) => boolean): Sequence<T>;
    filterIndexed<S extends T>(predicate: (each: { element: T, index: number }) => boolean): Sequence<S>;
    flatMap<U>(transform: (element: T) => Iterable<U>): Sequence<U>;
    flatMapIndexed<U>(transform: (each: { element: T, index: number}) => Iterable<U>): Sequence<U>;
    flatten(this: Sequence<Collection<T>>): Sequence<T>;
    map<R>(transform: (element: T) => R): Sequence<R>;
    mapIndexed<R>(transform: (each: { element: T, index: number}) => R): Sequence<R>;
    onEach(consumer: (element: T) => void): Sequence<T>;
    onEachIndexed(consumer: (each: { element: T, index: number }) => void): Sequence<T>;
    unzip<R>(this: Sequence<[T, R]>): [List<T>, List<R>];
    zip<R>(other: Iterable<R>): Sequence<[T, R]>
    zip<R, V>(other: Iterable<R>, transform: (each: { a: T, b: R }) => V): Sequence<V>;
}
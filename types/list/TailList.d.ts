import { AbstractCollection } from "../collection/AbstractCollection.js";
import { Collection } from "../collection/Collection.js";
import { IntRange } from "../iterables/IntRange.js";
import { Sequence } from "../sequence/Sequence.js";
import { Stream } from "../sequence/Stream.js";
import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";
import { Utils } from "../utils/Utils.js";
import { ArrayList } from "./ArrayList.js";
import { List, MutableList } from "./List.js";

export declare class TailList<T> extends AbstractCollection<T> implements List<T> {
    private static readonly EMPTY: TailList<unknown> =
        new TailList(null, () => TailList.empty<unknown>());
    public readonly head: T;
    public readonly tail: () => TailList<T>;

    private constructor(head: T, tail: () => TailList<T> = () => TailList.empty());

    public static of<T>(...elements: T[]): TailList<T>;
    public static from<T>(iterable: Iterable<T>): TailList<T>;
    public static empty<T>(): TailList<T>;
    public static concat<T>(first: TailList<T>, second: TailList<T>): TailList<T>;
    public static createFromIterator<T>(iterator: Iterator<T>): TailList<T>;

    public append(element: T): TailList<T>;
    public appendAll(elements: Iterable<T>): TailList<T>;
    public backwardsIterator(): IterableIterator<T>;
    public chunked(size: number): TailList<List<T>>;
    private static appendRawList<T>(list: TailList<List<T>>, other: List<T>): TailList<List<T>>;
    public distinct(): TailList<T>;
    public distinctBy<K>(selector: (element: T) => K): TailList<T>;
    private distinctHelper<K>(observed: Set<K>, selector: (element: T) => K): TailList<T>; 
    public drop(n: number): TailList<T>;
    public dropLast(n: number): TailList<T>;
    public dropLastWhile(predicate: (element: T) => boolean): TailList<T>;
    public dropWhile(predicate: (element: T) => boolean): TailList<T>;
    public foldRight<R>(initial: R, operation: (each: { element: T; acc: R; }) => R): R;
    public foldRightIndexed<R>(initial: R, operation: (each: { element: T; acc: R; index: number; }) => R): R;
    public lastIndex(): number;
    public minus(element: T): TailList<T>;
    public minusAll(elements: Iterable<T>): TailList<T>;
    public reduceRight<S extends T>(operation: (each: { element: T; acc: S; }) => S): S | null;
    public reduceRightIndexed<S extends T>(operation: (each: { element: T; acc: S; index: number; }) => S): S | null;
    public reversed(): TailList<T>;
    public slice(indices: Iterable<number> | IntRange): TailList<T>;
    public sorted<T extends Comparable<T>>(this: TailList<T>): TailList<T>;
    public sortedDescending<T extends Comparable<T>>(this: TailList<T>): TailList<T>;
    public sortedBy<R extends Comparable<R>>(selector: (element: T) => R): TailList<T>;
    public sortedByDescending<R extends Comparable<R>>(selector: (element: T) => R): TailList<T>;
    public sortedWith(comparator: Comparator<T>): TailList<T>;
    public sortedWithDescending(comparator: Comparator<T>): TailList<T>;
    public take(n: number): TailList<T>;
    public takeLast(n: number): TailList<T>;
    public takeLastWhile(predicate: (element: T) => boolean): TailList<T>;
    public takeWhile(predicate: (element: T) => boolean): TailList<T>;

    public filter(predicate: (element: T) => boolean): TailList<T>;
    public filter<S extends T>(predicate: (element: T) => boolean): TailList<S>;
    public filterIndexed(predicate: (each: { element: T; index: number; }) => boolean): TailList<T>;
    public filterIndexed<S extends T>(predicate: (each: { element: T; index: number; }) => boolean): TailList<S>;
    private filterIndexedKeepingCount(predicate: (each: { element: T; index: number; }) => boolean, current: number): TailList<T>;
    public flatMap<U>(transform: (element: T) => TailList<U>): TailList<U>;
    public flatMapIndexed<U>(transform: (each: { element: T; index: number; }) => TailList<U>): TailList<U>;
    private flatMapIndexedKeepingCount<U>(transform: (each: { element: T; index: number }) => List<U>, current: number): TailList<U>;
    public flatten(this: Collection<Collection<T>>): TailList<T>;
    public map<R>(transform: (element: T) => R): TailList<R>;
    public mapIndexed<R>(transform: (each: { element: T; index: number; }) => R): TailList<R>;
    private mapIndexedKeepingCount<R>(transform: (each: { element: T; index: number }) => R, current: number): TailList<R>;
    public onEach(consumer: (element: T) => void): TailList<T>;
    public onEachIndexed(consumer: (each: { element: T; index: number; }) => void): TailList<T>;

    public unzip<R>(this: TailList<[T, R]>): [TailList<T>, TailList<R>];
    public zip<R>(other: Iterable<R>): TailList<[T, R]>;
    public zip<R, V>(other: Iterable<R>, transform: (each: { a: T; b: R; }) => V): TailList<V>;

    public override first(): T | undefined;
    public override forEach(consumer: (element: T) => void): void;
    public override forEachIndexed(consumer: (each: { element: T; index: number; }) => void): void;
    private forEachIndexedKeepingCount(consumer: (each: { element: T; index: number }) => void, current: number): void;
    public override isEmpty(): boolean;
    public override isNotEmpty(): boolean;
    public iterator(): IterableIterator<T>;
    public size(): number;
    public toList(): List<T>;
    public toMutableList(): MutableList<T>;
    public toSequence(): Sequence<T>;
    
    public [Symbol.iterator](): IterableIterator<T>;
}
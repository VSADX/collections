import { AbstractCollection } from "../collection/AbstractCollection.js";
import { Collection } from "../collection/Collection.js";
import { IntRange } from "../iterables/IntRange.js";
import { Sequence } from "../sequence/Sequence.js";
import { Stream } from "../sequence/Stream.js";
import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";
import { Utils } from "../utils/Utils.js";
import { List, MutableList } from "./List.js";

export declare class ArrayList<T> extends AbstractCollection<T> implements MutableList<T> {
    private _values: T[];
    private constructor(values: T[] = []);
    public static of<T>(...elements: T[]): ArrayList<T>;
    public static from<T>(iterable: Iterable<T>): ArrayList<T>;
    public static empty<T>(): ArrayList<T>;
    // Random Access optimizations
    public override count(): number;
    public override count(predicate: (element: T) => boolean): number;
    public override elementAt(index: number): T | undefined;
    public override first(): T | undefined;
    public override last(): T | undefined;
    // Backwards Iteration optimizations
    public override findLast(predicate: (element: T) => boolean): T | undefined;
    public override findLastIndex(predicate: (element: T) => boolean): number;
    public override lastIndexOf(element: T): number;
    // ---------------------------------
    public filter(predicate: (element: T) => boolean): ArrayList<T>;
    public filter<S extends T>(predicate: (element: T) => boolean): ArrayList<S>;
    public filterIndexed(predicate: (each: { element: T; index: number; }) => boolean): ArrayList<T>;
    public filterIndexed<S extends T>(predicate: (each: { element: T; index: number; }) => boolean): ArrayList<S>;
    public flatMap<U>(transform: (element: T) => ArrayList<U>): ArrayList<U>;
    public flatMapIndexed<U>(transform: (each: { element: T; index: number; }) => ArrayList<U>): ArrayList<U>;
    public flatten(this: Collection<Collection<T>>): ArrayList<T>;
    public iterator(): IterableIterator<T>;
    public map<R>(transform: (element: T) => R): ArrayList<R>;
    public mapIndexed<R>(transform: (each: { element: T; index: number; }) => R): ArrayList<R>;
    public onEach(consumer: (element: T) => void): ArrayList<T>;
    public onEachIndexed(consumer: (each: { element: T; index: number; }) => void): ArrayList<T>;
    public size(): number;
    public toList(): List<T>;
    public toMutableList(): MutableList<T>;
    public toSequence(): Sequence<T>;
    public unzip<R>(this: ArrayList<[T, R]>): [ArrayList<T>, ArrayList<R>];
    public zip<R>(other: Iterable<R>): ArrayList<[T, R]>;
    public zip<R, V>(other: Iterable<R>, transform: (each: { a: T; b: R; }) => V): ArrayList<V>;

    public append(element: T): ArrayList<T>;
    public appendAll(elements: Iterable<T>): ArrayList<T>;
    public backwardsIterator(): IterableIterator<T>;
    public chunked(size: number): ArrayList<List<T>>;
    public distinct(): ArrayList<T>;
    public distinctBy<K>(selector: (element: T) => K): ArrayList<T>;
    public drop(n: number): ArrayList<T>;
    public dropLast(n: number): ArrayList<T>;
    public dropLastWhile(predicate: (element: T) => boolean): ArrayList<T>;
    public dropWhile(predicate: (element: T) => boolean): ArrayList<T>;
    public foldRight<R>(initial: R, operation: (each: { element: T; acc: R; }) => R): R;
    public foldRightIndexed<R>(initial: R, operation: (each: { element: T; acc: R; index: number; }) => R): R;
    public lastIndex(): number;
    public minus(element: T): ArrayList<T>;
    public minusAll(elements: Iterable<T>): ArrayList<T>;
    public reduceRight<S extends T>(operation: (each: { element: T; acc: S; }) => S): S | null;
    public reduceRightIndexed<S extends T>(operation: (each: { element: T; acc: S; index: number; }) => S): S | null;
    public reversed(): ArrayList<T>;
    public slice(indices: Iterable<number> | IntRange): ArrayList<T>;
    public sorted<T extends Comparable<T>>(this: ArrayList<T>): ArrayList<T>;
    public sortedDescending<T extends Comparable<T>>(this: ArrayList<T>): ArrayList<T>;
    public sortedBy<R extends Comparable<R>>(selector: (element: T) => R): ArrayList<T>;
    public sortedByDescending<R extends Comparable<R>>(selector: (element: T) => R): ArrayList<T>;
    public sortedWith(comparator: Comparator<T>): ArrayList<T>;
    public sortedWithDescending(comparator: Comparator<T>): ArrayList<T>;
    public take(n: number): ArrayList<T>;
    public takeLast(n: number): ArrayList<T>;
    public takeLastWhile(predicate: (element: T) => boolean): ArrayList<T>;
    public takeWhile(predicate: (element: T) => boolean): ArrayList<T>;

    public add(element: T): boolean;
    public add(element: T, index: number): boolean;
    public addAll(elements: Iterable<T>): boolean
    public addAll(elements: Iterable<T>, index: number): boolean
    public clear(): void;
    public remove(element: T): boolean;
    public removeAll(elements: Iterable<T>): boolean;
    public removeAt(index: number): boolean;
    public reverse(): void;
    public set(index: number, element: T): T;
    public sort<T extends Comparable<T>>(this: ArrayList<T>): void;
    public sortDescending<T extends Comparable<T>>(this: ArrayList<T>): void;
    public sortBy<R extends Comparable<R>>(selector: (element: T) => R): void;
    public sortByDescending<R extends Comparable<R>>(selector: (element: T) => R): void;
    public sortWith(comparator: Comparator<T>): void;
    public sortWithDescending(comparator: Comparator<T>): void;
    
    public [Symbol.iterator](): IterableIterator<T>;
}
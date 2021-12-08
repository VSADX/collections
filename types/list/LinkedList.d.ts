import { AbstractCollection } from "../collection/AbstractCollection.js";
import { Collection } from "../collection/Collection.js";
import { IntRange } from "../iterables/IntRange.js";
import { Sequence } from "../sequence/Sequence.js";
import { Stream } from "../sequence/Stream.js";
import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";
import { Utils } from "../utils/Utils.js";
import { List, MutableList } from "./List.js";

export declare class Node<T> {
    public item: T;
    public next: Node<T> | null;
    public prev: Node<T> | null;
    constructor(
        prev: Node<T> | null,
        item: T,
        next: Node<T> | null
    );
}

export declare class LinkedList<T> extends AbstractCollection<T> implements MutableList<T> {
    private _size: number = 0;
    private head: Node<T> | null = null;
    private tail: Node<T> | null = null;
    private constructor(elements?: Iterable<T>);
    public static of<T>(...elements: T[]): LinkedList<T>;
    public static from<T>(iterable: Iterable<T>): LinkedList<T>;
    private linkFirst(element: T): void;
    private linkLast(element: T): void;
    private linkBefore(index: number, element: T): void;
    private unlinkFirst(): T | null;
    private unlinkLast(): T | null;
    private unlink(node: Node<T>): T | null;
    private traverse(index: number): Node<T> | null;
    private traverseRight(index: number): Node<T> | null;
    public node(index: number): Node<T>;
    // Optimized traversal optimization
    public override elementAt(index: number): T | undefined;
    public override findLast(predicate: (element: T) => boolean): T | undefined;
    public override findLastIndex(predicate: (element: T) => boolean): number;
    public override lastIndexOf(element: T): number;
    // ---------------------------------
    public filter(predicate: (element: T) => boolean): LinkedList<T>;
    public filter<S extends T>(predicate: (element: T) => boolean): LinkedList<S>;
    public filterIndexed(predicate: (each: { element: T; index: number; }) => boolean): LinkedList<T>;
    public filterIndexed<S extends T>(predicate: (each: { element: T; index: number; }) => boolean): LinkedList<S>;
    public flatMap<U>(transform: (element: T) => LinkedList<U>): LinkedList<U>;
    public flatMapIndexed<U>(transform: (each: { element: T; index: number; }) => LinkedList<U>): LinkedList<U>;
    public flatten(this: Collection<Collection<T>>): LinkedList<T>;
    public iterator(): IterableIterator<T>;
    public map<R>(transform: (element: T) => R): LinkedList<R>;
    public mapIndexed<R>(transform: (each: { element: T; index: number; }) => R): LinkedList<R>;
    public onEach(consumer: (element: T) => void): LinkedList<T>;
    public onEachIndexed(consumer: (each: { element: T; index: number; }) => void): LinkedList<T>;
    public size(): number;
    public toList(): List<T>;
    public toMutableList(): MutableList<T>;
    public toSequence(): Sequence<T>;
    public unzip<R>(this: LinkedList<[T, R]>): [LinkedList<T>, LinkedList<R>];
    public zip<R>(other: Iterable<R>): LinkedList<[T, R]>;
    public zip<R, V>(other: Iterable<R>, transform: (each: { a: T; b: R; }) => V): LinkedList<V>;

    public append(element: T): LinkedList<T>;
    public appendAll(elements: Iterable<T>): LinkedList<T>;
    public backwardsIterator(): IterableIterator<T>;
    public chunked(size: number): LinkedList<List<T>>;
    public distinct(): LinkedList<T>;
    public distinctBy<K>(selector: (element: T) => K): LinkedList<T>;
    public drop(n: number): LinkedList<T>;
    public dropLast(n: number): LinkedList<T>;
    public dropLastWhile(predicate: (element: T) => boolean): LinkedList<T>;
    public dropWhile(predicate: (element: T) => boolean): LinkedList<T>;
    public foldRight<R>(initial: R, operation: (each: { element: T; acc: R; }) => R): R;
    public foldRightIndexed<R>(initial: R, operation: (each: { element: T; acc: R; index: number; }) => R): R;
    public lastIndex(): number;
    public minus(element: T): LinkedList<T>;
    public minusAll(elements: Iterable<T>): LinkedList<T>;
    public reduceRight<S extends T>(operation: (each: { element: T; acc: S; }) => S): S | null;
    public reduceRightIndexed<S extends T>(operation: (each: { element: T; acc: S; index: number; }) => S): S | null;
    public reversed(): LinkedList<T>;
    public slice(indices: Iterable<number> | IntRange): LinkedList<T>;
    public sorted<T extends Comparable<T>>(this: LinkedList<T>): LinkedList<T>;
    public sortedDescending<T extends Comparable<T>>(this: LinkedList<T>): LinkedList<T>;
    public sortedBy<R extends Comparable<R>>(selector: (element: T) => R): LinkedList<T>;
    public sortedByDescending<R extends Comparable<R>>(selector: (element: T) => R): LinkedList<T>;
    public sortedWith(comparator: Comparator<T>): LinkedList<T>;
    public sortedWithDescending(comparator: Comparator<T>): LinkedList<T>;
    public take(n: number): LinkedList<T>;
    public takeLast(n: number): LinkedList<T>;
    public takeLastWhile(predicate: (element: T) => boolean): LinkedList<T>;
    public takeWhile(predicate: (element: T) => boolean): LinkedList<T>;

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
    public sort<T extends Comparable<T>>(this: LinkedList<T>): void;
    public sortDescending<T extends Comparable<T>>(this: LinkedList<T>): void;
    public sortBy<R extends Comparable<R>>(selector: (element: T) => R): void;
    public sortByDescending<R extends Comparable<R>>(selector: (element: T) => R): void;
    public sortWith(comparator: Comparator<T>): void;
    public sortWithDescending(comparator: Comparator<T>): void;
    
    public [Symbol.iterator](): IterableIterator<T>;
}
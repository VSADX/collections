import { AbstractCollection } from "../collection/AbstractCollection.js";
import { Collection } from "../collection/Collection.js";
import { ArrayList } from "../list/ArrayList.js";
import { List, MutableList } from "../list/List.js";
import { Sequence } from "../sequence/Sequence.js";
import { Stream } from "../sequence/Stream.js";
import { Utils } from "../utils/Utils.js";

export declare class IntRange extends AbstractCollection<number> {
    public readonly _first: number;
    public readonly _last: number;
    public readonly step: number;

    constructor(start: number, endInclusive: number, step: number = 1);

    public override isEmpty(): boolean;
    public override toString(): string;

    public iterator(): IterableIterator<number>;
    public filter(predicate: (element: number) => boolean): Sequence<number>;
    public filter<S extends number>(predicate: (element: number) => boolean): Sequence<S>;
    public filterIndexed(predicate: (each: { element: number; index: number; }) => boolean): Sequence<number>;
    public filterIndexed<S extends number>(predicate: (each: { element: number; index: number; }) => boolean): Sequence<S>;
    public flatMap<U>(transform: (element: number) => Iterable<U>): Sequence<U>;
    public flatMapIndexed<U>(transform: (each: { element: number; index: number; }) => Iterable<U>): Sequence<U>;
    public flatten(this: Collection<Collection<number>>): never;
    public map<R>(transform: (element: number) => R): Sequence<R>;
    public mapIndexed<R>(transform: (each: { element: number; index: number; }) => R): Sequence<R>;
    public onEach(consumer: (element: number) => void): IntRange;
    public onEachIndexed(consumer: (each: { element: number; index: number; }) => void): IntRange;
    public size(): number;
    public toList(): List<number>;
    public toMutableList(): MutableList<number>;
    public toSequence(): Sequence<number>;
    public unzip<R>(this: Collection<[number, R]>): never;
    public zip<R>(other: Iterable<R>): Sequence<[number, R]>;
    public zip<R, V>(other: Iterable<R>, transform: (each: { a: number; b: R; }) => V): Sequence<V>;
    public [Symbol.iterator](): IterableIterator<number>;
}
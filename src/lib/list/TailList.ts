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

export class TailList<T> extends AbstractCollection<T> implements List<T> {
    private static readonly EMPTY: TailList<unknown> = 
        new TailList(null, () => TailList.empty<unknown>());

    public readonly head: T;
    public readonly tail: () => TailList<T>;

    constructor(head: T, tail: () => TailList<T> = () => TailList.empty()) {
        super();
        this.head = head;
        this.tail = tail;
    }

    public static of<T>(...elements: T[]): TailList<T> {
        if (elements.length === 0)
            return TailList.empty<T>();
        else if (elements.length === 1)
            return new TailList<T>(elements[0] as T, () => TailList.empty<T>());
        else
            return TailList.createFromIterator<T>(elements.values());
    }

    public static from<T>(iterable: Iterable<T>): TailList<T> {
        return TailList.createFromIterator<T>(iterable[Symbol.iterator]());
    }

    public static empty<T>(): TailList<T> {
        return this.EMPTY as TailList<T>;
    }

    public static concat<T>(first: TailList<T>, second: TailList<T>): TailList<T> {
        return new TailList<T>(first.head, () => first.tail()).appendAll(second);
    }

    private static createFromIterator<T>(iterator: Iterator<T>): TailList<T> {
        const next = iterator.next();
        if (!next.done)
            return new TailList<T>(next.value, () => TailList.createFromIterator(iterator));
        else 
            return TailList.empty();
    }

    // Implement List

    public append(element: T): TailList<T> {
        if (this.isEmpty())
            return TailList.of(element);
        else
            return new TailList<T>(this.head, 
                () => this.tail().appendAll(TailList.of(element)));
    }

    public appendAll(elements: Iterable<T>): TailList<T> {
        if (this.isEmpty())
            return TailList.from<T>(elements);
        else 
            return new TailList<T>(this.head,
                () => this.tail().appendAll(TailList.from(elements)));
    }

    public backwardsIterator(): IterableIterator<T> {
        return this.reversed().iterator();
    }

    public chunked(size: number): TailList<List<T>> {
        Utils.ensurePositiveSize(size = size | 0);
        let list = TailList.empty<List<T>>();
        for (let i = 0; i < this.size(); i += size)
            list = TailList.appendRawList(list, this.slice(new IntRange(i, i + size)) as List<T>);
        return list;
    }

    private static appendRawList<T>(list: TailList<List<T>>, other: List<T>): TailList<List<T>> {
        if (list.isEmpty())
            return TailList.of<List<T>>(other);
        else
            return new TailList<List<T>>(
                list.first() as List<T>,
                () => TailList.appendRawList(list.tail(), other)
            );
    }

    public distinct(): TailList<T> {
        return this.distinctHelper(new Set<T>(), item => item);
    }

    public distinctBy<K>(selector: (element: T) => K): TailList<T> {
        return this.distinctHelper(new Set<K>(), selector);
    }

    private distinctHelper<K>(observed: Set<K>, selector: (element: T) => K): TailList<T> {
        if (this.isEmpty())
            return TailList.empty<T>();
        else {
            const key = selector(this.head);
            if (!observed.has(key)) {
                observed.add(key);
                return new TailList<T>(this.head, () => this.tail().distinctHelper(observed, selector));
            } else 
                return this.tail().distinctHelper(observed, selector);
        }
    }

    public drop(n: number): TailList<T> {
        Utils.ensurePositiveSize(n = n | 0);
        if (n > 0)
            return this.tail().drop(n - 1);
        else
            return this;
    }

    public dropLast(n: number): List<T> {
        Utils.ensurePositiveSize(n = n | 0);
        if (n === 0)
            return this;
        else
            return this.take(this.size() - n);
    }

    public dropLastWhile(predicate: (element: T) => boolean): TailList<T> {
        let index = this.lastIndex();
        while (index > -1) {
            if (!predicate(this.elementAt(index) as T))
                return this.take(index + 1);
            index--;
        }
        return TailList.empty<T>();
    }

    public dropWhile(predicate: (element: T) => boolean): List<T> {
        if (predicate(this.head))
            return this.tail().dropWhile(predicate);
        else
            return this;
    }

    public foldRight<R>(initial: R, operation: (each: { element: T; acc: R; }) => R): R {
        return ArrayList.from(this).foldRight(initial, operation);
    }

    public foldRightIndexed<R>(
        initial: R, 
        operation: (each: { element: T; acc: R; index: number; }) => R
    ): R {
        return ArrayList.from(this).foldRightIndexed(initial, operation);
    }

    public lastIndex(): number {
        return this.size() - 1;
    }

    public minus(element: T): TailList<T> {
        return this.minusAll([element]);
    }

    public minusAll(elements: Iterable<T>): TailList<T> {
        const toRemove = [...elements];
        if (toRemove.length === 0)
            return this;
        if (toRemove.includes(this.head)) {
            toRemove.splice(toRemove.indexOf(this.head), 1);
            return this.tail().minusAll(toRemove);
        }
        else 
            return new TailList(this.head, () => this.tail().minusAll(toRemove));
    }
    
    public reduceRight<S extends T>(operation: (each: { element: T; acc: S; }) => S): S | null {
        return ArrayList.from(this).reduceRight(operation);
    }

    public reduceRightIndexed<S extends T>(
        operation: (each: { element: T; acc: S; index: number; }) => S
    ): S | null {
        return ArrayList.from(this).reduceRightIndexed(operation);
    }

    public reversed(): TailList<T> {
        return TailList.from(ArrayList.from(this).reversed());
    }

    public slice(indices: IntRange | Iterable<number>): TailList<T> {
        const _indices = [...indices];
        return this.filterIndexed(({ index }) => _indices.includes(index));
    }

    public sorted<T extends Comparable<T>>(this: List<T>): TailList<T> {
        return TailList.from(ArrayList.from(this).sorted());
    }

    public sortedDescending<T extends Comparable<T>>(this: List<T>): TailList<T> {
        return TailList.from(ArrayList.from(this).sortedDescending());
    }

    public sortedBy<R extends Comparable<R>>(selector: (element: T) => R): TailList<T> {
        return TailList.from(ArrayList.from(this).sortedBy(selector));
    }

    public sortedByDescending<R extends Comparable<R>>(selector: (element: T) => R): TailList<T> {
        return TailList.from(ArrayList.from(this).sortedBy(selector));
    }

    public sortedWith(comparator: Comparator<T>): TailList<T> {
        return TailList.from(ArrayList.from(this).sortedWith(comparator));
    }

    public sortedWithDescending(comparator: Comparator<T>): TailList<T> {
        return TailList.from(ArrayList.from(this).sortedWithDescending(comparator));
    }

    public take(n: number): TailList<T> {
        Utils.ensurePositiveSize(n = n | 0);
        if (n === 0)
            return TailList.empty<T>();
        else if (n === 1)
            return new TailList<T>(this.head, () => TailList.empty<T>());
        else
            return new TailList<T>(this.head, () => this.tail().take(n - 1));
    }

    public takeLast(n: number): TailList<T> {
        Utils.ensurePositiveSize(n = n | 0);
        if (n === 0)
            return this;
        else
            return this.drop(this.size() - n);
    }

    public takeLastWhile(predicate: (element: T) => boolean): List<T> {
        if (this.isEmpty())
            return TailList.empty<T>();

        let startingIndex = this.lastIndex();
        for (const item of this.backwardsIterator()) {
            if (!predicate(item)) {
                break;
            }
            startingIndex--;
        }
        return this.takeLast(this.size() - startingIndex);
    }

    public takeWhile(predicate: (element: T) => boolean): TailList<T> {
        if (predicate(this.head))
            return new TailList<T>(this.head, () => this.tail().takeWhile(predicate));
        else
            return TailList.empty<T>();
    }

    // Implement AbstractCollection

    public filter(predicate: (element: T) => boolean): TailList<T>;
    public filter<S extends T>(predicate: (element: T) => boolean): TailList<S>;
    public filter(predicate: (element: T) => boolean): TailList<T> {
        if (this.isEmpty())
            return TailList.empty<T>();
        if (predicate(this.head))
            return new TailList<T>(this.head, () => this.tail().filter(predicate));
        else
            return this.tail().filter(predicate);
    }

    public filterIndexed(
        predicate: (each: { element: T; index: number; }) => boolean
    ): TailList<T>;
    public filterIndexed<S extends T>(
        predicate: (each: { element: T; index: number; }) => boolean
    ): TailList<S>;
    public filterIndexed(
        predicate: (each: { element: T; index: number; }) => boolean
    ): TailList<T> {
        return this.filterIndexedKeepingCount(predicate, 0);
    }

    private filterIndexedKeepingCount(
        predicate: (each: { element: T; index: number; }) => boolean, 
        current: number
    ): TailList<T> {
        if (this.isEmpty())
            return TailList.empty<T>();
        if (predicate({ element: this.head, index: current++ }))
            return new TailList<T>(
                this.head, 
                () => this.tail().filterIndexedKeepingCount(predicate, current)
            );
        else
            return this.tail().filterIndexedKeepingCount(predicate, current);
    }

    public flatMap<U>(transform: (element: T) => List<U>): TailList<U> {
        if (this.isEmpty())
            return TailList.empty<U>();
        else
            return TailList.concat<U>(
                TailList.from(transform(this.head)), 
                this.tail().flatMap(transform)
            );
    }

    public flatMapIndexed<U>(transform: (each: { element: T; index: number; }) => List<U>): List<U> {
        return this.flatMapIndexedKeepingCount(transform, 0);
    }

    private flatMapIndexedKeepingCount<U>(
        transform: (each: { element: T; index: number }) => List<U>, 
        current: number
    ): TailList<U> {
        if (this.isEmpty())
            return TailList.empty<U>();
        else
            return TailList.concat<U>(
                TailList.from(transform({ element: this.head, index: current++ })),
                this.tail().flatMapIndexedKeepingCount(transform, current)
            );
    }

    public flatten<T>(this: TailList<Collection<T>>): TailList<T> {
        if (this.isEmpty())
            return TailList.empty<T>();
        else
            return TailList.concat<T>(
                TailList.from(this.head),
                this.tail().flatten()
            );
    }

    public map<R>(transform: (element: T) => R): TailList<R> {
        if (this.isEmpty())
            return TailList.empty<R>();
        else
            return new TailList(transform(this.head), () => this.tail().map(transform));
    }

    public mapIndexed<R>(transform: (each: { element: T; index: number; }) => R): TailList<R> {
        if (this.isEmpty())
            return TailList.empty<R>();
        else
            return new TailList(
                transform({ element: this.head, index: 0 }), 
                () => this.tail().mapIndexedKeepingCount(transform, 1)
            );
    }

    private mapIndexedKeepingCount<R>(
        transform: (each: { element: T; index: number }) => R, 
        current: number
    ): TailList<R> {
        if (this.isEmpty())
            return TailList.empty<R>();
        else
            return new TailList(
                transform({ element: this.head, index: current++ }), 
                () => this.tail().mapIndexedKeepingCount(transform, current)
            );
    }

    public onEach(consumer: (element: T) => void): TailList<T> {
        if (this.isNotEmpty()) {
            consumer(this.head);
            this.tail().forEach(consumer);
        }
        return this;
    }

    public onEachIndexed(consumer: (each: { element: T; index: number; }) => void): TailList<T> {
        this.forEachIndexedKeepingCount(consumer, 0);
        return this;
    }

    public unzip<R>(this: TailList<[T, R]>): [TailList<T>, TailList<R>] {
        return this.fold<[TailList<T>, TailList<R>]>(
            [TailList.empty<T>(), TailList.empty<R>()], 
            ({ acc, element }) => {
                acc[0] = acc[0].append(element[0]);
                acc[1] = acc[1].append(element[1]);
                return acc;
            }
        );
    }

    public zip<R>(other: Iterable<R>): TailList<[T, R]>;
    public zip<R, V>(other: Iterable<R>, transform: (each: { a: T; b: R; }) => V): TailList<V>;
    public zip<R, V>(other: Iterable<R>, transform?: (each: { a: T; b: R; }) => V): List<[T, R]> | List<V> {
        if (!transform)
            return this.zip<R, [T, R]>(other, ({ a, b }) => [a, b]);
        
        const otherIterator = other[Symbol.iterator]();
        return this.map(item => transform({ a: item, b: otherIterator.next().value }))
                   .take(Math.min(this.size(), [...other].length));
    }

    // Implement AbstractCollection
    public override first(): T | undefined {
        return this.head ?? undefined;
    }

    public override forEach(consumer: (element: T) => void): void {
        if (this.isNotEmpty()) {
            consumer(this.head);
            this.tail().forEach(consumer);
        }
    }

    public override forEachIndexed(consumer: (each: { element: T; index: number; }) => void): void {
        this.forEachIndexedKeepingCount(consumer, 0);
    }

    private forEachIndexedKeepingCount(
        consumer: (each: { element: T; index: number }) => void, 
        current: number
    ): void {
        if (this.isNotEmpty()) {
            consumer({ element: this.head, index: current++ });
            this.tail().forEachIndexedKeepingCount(consumer, current);
        }
    }

    public override isEmpty(): boolean {
        return this === TailList.EMPTY;
    }

    public override isNotEmpty(): boolean {
        return this !== TailList.EMPTY;
    }

    public iterator(): IterableIterator<T> {
        return this[Symbol.iterator]();
    }

    public size(): number {
        if (this.isEmpty())
            return 0;
        else
            return 1 + this.tail().size();
    }

    public toList(): List<T> {
        return this;
    }

    public toMutableList(): MutableList<T> {
        return ArrayList.from(this);
    }

    public toSequence(): Sequence<T> {
        return Stream.from(this);
    }

    public [Symbol.iterator](): IterableIterator<T> {
        let self: TailList<T> = this;
        return {
            [Symbol.iterator]() { return this; },
            next() {
                if (self.isEmpty())
                    return { value: undefined as any, done: true };
                const head = self.first() as T;
                self = self.tail();
                return { value: head, done: false };
            }
        }
    }
}
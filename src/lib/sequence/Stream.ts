import { AbstractCollection } from "../collection/AbstractCollection.js";
import { Collection } from "../collection/Collection.js";
import { IntRange } from "../iterables/IntRange.js";
import { ArrayList } from "../list/ArrayList.js";
import { List, MutableList } from "../list/List.js";
import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";
import { Utils } from "../utils/Utils.js";
import { Sequence } from "./Sequence.js";

type ExcludeFunction<T> = T extends Function ? never : T;

export class Stream<T> 
        extends AbstractCollection<T> 
        implements Sequence<T> {

    protected readonly _values: Iterable<T>;
    protected readonly _size: number;

    protected constructor(iterable: Iterable<T>, size?: number) {
        super();
        this._values = iterable;
        if (typeof size === "number") {
            this._size = size | 0;
        } else {
            if (Utils.isLenghted(iterable))
                this._size = iterable.length;
            else if (Utils.isSized(iterable))
                this._size = iterable.size;
            else 
                this._size = -1;
        }
    }

    public static of<T>(...elements: T[]): Stream<T> {
        return new Stream<T>(elements, elements.length);
    }

    public static from<T>(iterable: Iterable<T>): Stream<T> {
        if (Utils.isIterableIterator<T>(iterable))
            return new ConstrainedStream<T>(iterable, -1);
        else 
            return new Stream<T>(iterable);
    }

    public static empty<T>(): Stream<T> {
        return new Stream<T>([], 0);
    }

    public static generate<T>(initial: T, nextValue: (current: T) => T | null): Stream<T> {
        return new GeneratorStream<T>(initial, nextValue);
    }

    public static continually<T>(continuous: T | (() => T)): Stream<T> {
        if (typeof continuous === "function")
            return new GeneratorStream<T>((continuous as any)(), _ => (continuous as any)() as T);
        return new GeneratorStream<T>(continuous, (curr) => curr);
    }

    // Implement Sequence

    public append(element: T): Stream<T> {
        return new AppendingStream<T>(this, Stream.of(element));
    }

    public appendAll(elements: Iterable<T>): Stream<T> {
        return new AppendingStream<T>(this, 
            elements instanceof Stream 
                ? elements 
                : Stream.from(elements)
        );
    }

    public chunked(size: number): Stream<Sequence<T>> {
        Utils.ensurePositiveSize(size);
        return new ChunkingStream<T>(this, size);
    }

    public constrainedOnce(): Stream<T> {
        return new ConstrainedStream<T>(this.iterator(), this.size());
    }

    public distinct(): Stream<T> {
        return new DistinctStream<T, T>(this, item => item);
    }

    public distinctBy<K>(selector: (item: T) => K): Stream<T> {
        return new DistinctStream<T, K>(this, selector);
    }

    public drop(n: number): Stream<T> {
        Utils.ensurePositiveSize(n);
        return new DroppingStream<T>(this, n);
    }

    public dropWhile(predicate: (element: T) => boolean): Stream<T> {
        return new DroppingWhileStream<T>(this, predicate);
    }

    public portion(start: number, endExclusive: number): Stream<T> {
        Utils.ensurePositiveSize(start);
        Utils.ensurePositiveSize(endExclusive);
        return this.drop(start).take(endExclusive - start);
    }

    public slice(indices: Iterable<number> | IntRange): Stream<T> {
        return new SlicingStream<T>(this, indices);
    }

    public sorted<T extends Comparable<T>>(this: Sequence<T>): Stream<T> {
        return Stream.from<T>(this.toList().sorted());
    }

    public sortedDescending<T extends Comparable<T>>(this: Sequence<T>): Stream<T> {
        return Stream.from<T>(this.toList().sortedDescending());
    }

    public sortedBy<R extends Comparable<R>>(selector: (element: T) => R): Stream<T> {
        return Stream.from<T>(this.toList().sortedBy(selector));
    }

    public sortedByDescending<R extends Comparable<R>>(selector: (element: T) => R): Stream<T> {
        return Stream.from<T>(this.toList().sortedByDescending(selector));
    }

    public sortedWith(comparator: Comparator<T>): Stream<T> {
        return Stream.from<T>(this.toList().sortedWith(comparator));
    }

    public sortedWithDescending(comparator: Comparator<T>): Stream<T> {
        return Stream.from<T>(this.toList().sortedWithDescending(comparator));
    }

    public take(n: number): Stream<T> {
        Utils.ensurePositiveSize(n);
        return new TakingStream<T>(this, n);
    }

    public takeWhile(predicate: (element: T) => boolean): Stream<T> {
        return new TakingWhileStream<T>(this, predicate);
    }


    // Implement AbstractCollection

    public filter(predicate: (element: T) => boolean): Stream<T>;
    public filter<S extends T>(predicate: (element: T) => boolean): Stream<S>;
    public filter(predicate: (element: T) => boolean): Stream<T> {
        return new FilteringStream<T>(this, predicate)
    }

    public filterIndexed(predicate: (each: { element: T; index: number; }) => boolean): Stream<T>;
    public filterIndexed<S extends T>(predicate: (each: { element: T; index: number; }) => boolean): Stream<S>;
    public filterIndexed(predicate: (each: { element: T; index: number; }) => boolean): Stream<T> {
        return new FilteringIndexedStream<T>(this, predicate);
    }

    public flatMap<U>(transform: (element: T) => Stream<U>): Stream<U> {
        return new FlatmappingStream<T, U>(this, transform);
    }

    public flatMapIndexed<U>(transform: (each: { element: T; index: number; }) => Stream<U>): Stream<U> {
        return new FlatmappingIndexedStream<T, U>(this, transform);
    }

    public flatten(this: Sequence<Collection<T>>): Stream<T> {
        return new FlatteningStream<T>(this);
    }

    public iterator(): IterableIterator<T> {
        return this[Symbol.iterator]();
    }

    public map<R>(transform: (element: T) => R): Stream<R> {
        return new MappingStream<T, R>(this, transform);
    }

    public mapIndexed<R>(transform: (each: { element: T; index: number; }) => R): Stream<R> {
        return new MappingIndexedStream<T, R>(this, transform);
    }

    public onEach(consumer: (element: T) => void): Stream<T> {
        for (const item of this)
            consumer(item);
        return this;
    }

    public onEachIndexed(consumer: (each: { element: T; index: number; }) => void): Stream<T> {
        let index = 0;
        for (const item of this)
            consumer({ element: item, index: index++ });
        return this;
    }

    public size(): number {
        return this._size;
    }

    public toList(): List<T> {
        return ArrayList.from(this);
    }

    public toMutableList(): MutableList<T> {
        return ArrayList.from(this);
    }

    public toSequence(): Sequence<T> {
        return this;
    }

    public unzip<R>(this: Stream<[T, R]>): [List<T>, List<R>] {
        return this.fold<[ArrayList<T>, ArrayList<R>]>([ArrayList.empty<T>(), ArrayList.empty<R>()],
            ({ acc, element }) => { acc[0].add(element[0]); acc[1].add(element[1]); return acc; }
        );
    }

    public zip<R>(other: Iterable<R>): Stream<[T, R]>;
    public zip<R, V>(other: Iterable<R>, transform: (each: { a: T; b: R; }) => V): Stream<V>;
    public zip<R, V>(other: Iterable<R>, transform?: (each: { a: T; b: R; }) => V): Stream<[T, R]> | Stream<V> {
        if (!transform)
            return this.zip<R, [T, R]>(other, ({ a, b }) => [a, b]);
        
        return new ZippingStream<T, R, V>(this, other, transform);
    }
    
    public [Symbol.iterator](): IterableIterator<T> {
        const iter = this._values[Symbol.iterator]();
        if (Utils.isIterableIterator<T>(iter))
            return iter;
        else return {
            [Symbol.iterator]() { return this; },
            next() { return iter.next(); }
        }
    }
}

class GeneratorStream<T> extends Stream<T> {
    private readonly initial: T;
    private readonly nextValue: (current: T) => T | null;
    constructor(initial: T, nextValue: (current: T) => T | null) {
        super([], -1);
        this.initial = initial;
        this.nextValue = nextValue;
    }

    override *[Symbol.iterator]() {
        let current: T | null = this.initial;
        yield this.initial;
        while (current !== null)
            if ((current = this.nextValue(current)) !== null)
                yield current;
    }
}

class AppendingStream<T> extends Stream<T> {
    private readonly other: Stream<T>;
    constructor(stream: Stream<T>, other: Stream<T>) {
        if (stream.size() < 0 || other.size() < 0)
            super(stream, -1);
        else
            super(stream, stream.size() + other.size());
        this.other = other;
    }

    override *[Symbol.iterator]() {
        yield* this._values;
        yield* this.other["_values"];
    }
}

class ChunkingStream<T> extends Stream<Sequence<T>> {
    private readonly chunkSize: number;
    constructor(stream: Stream<T>, n: number) {
        super(stream as any, -1);
        this.chunkSize = n;
    }

    override *[Symbol.iterator]() {
        let items: T[] = [];
        for (const value of this._values) {
            if (items.length === this.chunkSize)
                try { yield Stream.from(items); } 
                finally { items = []; }
            else
                items.push(value as any);
        }
        if (items.length > 0)
            yield Stream.from(items);
    }
}

class ConstrainedStream<T> extends Stream<T> {
    private readonly iter: IterableIterator<T>
    private iterated: boolean = false;
    constructor(iter: IterableIterator<T>, size: number) {
        super([], size);
        this.iter = iter;
    }

    override *[Symbol.iterator]() {
        if (this.iterated)
            throw new Utils.IllegalStateError("Attempted to iterate a Constrained Stream more than once");
        this.iterated = true;
        yield* this.iter;
    }
}

class DistinctStream<T, K> extends Stream<T> {
    private readonly selector: (element: T) => K
    constructor(stream: Stream<T>, selector: (element: T) => K) {
        super(stream, -1);
        this.selector = selector;
    }

    override *[Symbol.iterator]() {
        const observed = new Set<K>();
        for (const value of this._values) {
            const key = this.selector(value);
            if (!observed.has(key)) {
                observed.add(key);
                yield value;
            }
        }
    }
}

class DroppingStream<T> extends Stream<T> {
    private readonly n: number;
    constructor(stream: Stream<T>, n: number) {
        if (stream.size() < 0)
            super(stream, -1);
        else
            super(stream, stream.size() - n < 0 ? 0 : stream.size() - n);
        this.n = n;
    }
    
    override *[Symbol.iterator]() {
        let dropped = 0;
        for (const value of this._values)
            if (dropped++ >= this.n)
                yield value;
    }
}

class DroppingWhileStream<T> extends Stream<T> {
    private readonly predicate: (element: T) => boolean;
    constructor(stream: Stream<T>, predicate: (element: T) => boolean) {
        super(stream, -1);
        this.predicate = predicate;
    }

    override *[Symbol.iterator]() {
        let yielding = false;
        for (const value of this._values) {
            if (!this.predicate(value)) 
                yielding = true;
            if (yielding) 
                yield value;
        }
    }
}

class SlicingStream<T> extends Stream<T> {
    private readonly indices: IntRange | Iterable<number>;
    constructor(stream: Stream<T>, indices: IntRange | Iterable<number>) {
        super(stream, -1);
        this.indices = indices;
    }

    override *[Symbol.iterator]() {
        for (const index of this.indices) {
            const element = (this._values as Stream<T>).elementAt(index);
            if (element !== undefined) yield element;
        }
    }
}

class TakingStream<T> extends Stream<T> {
    private readonly n: number;
    constructor(stream: Stream<T>, n: number) {
        super(stream,
            stream.size() < 0
                ? -1
                : n > stream.size()
                    ? stream.size()
                    : n);
        this.n = n;
    }

    override *[Symbol.iterator]() {
        let taken = 0;
        for (const value of this._values) {
            if (taken++ < this.n)
                yield value;
            else break;
        }
    }
}

class TakingWhileStream<T> extends Stream<T> {
    private readonly predicate: (element: T) => boolean;
    constructor(stream: Stream<T>, predicate: (element: T) => boolean) {
        super(stream, -1);
        this.predicate = predicate;
    }

    override *[Symbol.iterator]() {
        let yielding = true;
        for (const value of this._values) {
            if (!this.predicate(value))
                yielding = false;
            if (!yielding)
                break;
            yield value;
        }
    }
}

class FilteringStream<T> extends Stream<T> {
    private readonly predicate: (element: T) => boolean;
    constructor(stream: Stream<T>, predicate: (element: T) => boolean) {
        super(stream, -1);
        this.predicate = predicate;
    }

    override *[Symbol.iterator]() {
        for (const value of this._values)
            if (this.predicate(value))
                yield value;
    }
}

class FilteringIndexedStream<T> extends Stream<T> {
    private readonly predicate: (each: { element: T, index: number }) => boolean;
    constructor(stream: Stream<T>, predicate: (each: { element: T, index: number }) => boolean) {
        super(stream, -1);
        this.predicate = predicate;
    }

    override *[Symbol.iterator]() {
        let index = 0;
        for (const value of this._values)
            if (this.predicate({ element: value, index: index++ }))
                yield value;
    }
}

class FlatmappingStream<T, U> extends Stream<U> {
    private readonly transform: (element: T) => Stream<U>;
    constructor(stream: Stream<T>, transform: (element: T) => Stream<U>) {
        super(stream as any, -1);
        this.transform = transform;
    }

    override *[Symbol.iterator]() {
        for (const value of this._values)
            yield* this.transform(value as any);
    }
}

class FlatmappingIndexedStream<T, U> extends Stream<U> {
    private readonly transform: (each: { element: T, index: number }) => Stream<U>;
    constructor(stream: Stream<T>, transform: (each: { element: T, index: number }) => Stream<U>) {
        super(stream as any, -1);
        this.transform = transform;
    }

    override *[Symbol.iterator]() {
        let index = 0;
        for (const value of this._values)
            yield* this.transform({ element: value as any, index: index++ });
    }
}

class FlatteningStream<T> extends Stream<T> {
    constructor(stream: Collection<Collection<T>>) {
        super(stream as any, -1);
    }

    override *[Symbol.iterator]() {
        for (const value of this._values)
            yield* value as any;
    }
}

class MappingStream<T, U> extends Stream<U> {
    private readonly transform: (element: T) => U;
    constructor(stream: Stream<T>, transform: (element: T) => U) {
        super(stream as any, stream.size());
        this.transform = transform;
    }

    override *[Symbol.iterator]() {
        for (const value of this._values)
            yield this.transform(value as any);
    }
}

class MappingIndexedStream<T, U> extends Stream<U> {
    private readonly transform: (each: { element: T, index: number }) => U;
    constructor(stream: Stream<T>, transform: (each: { element: T, index: number }) => U) {
        super(stream as any, stream.size());
        this.transform = transform;
    }

    override *[Symbol.iterator]() {
        let index = 0;
        for (const value of this._values)
            yield this.transform({ element: value as any, index: index++ });
    }
}

class ZippingStream<T, R, V> extends Stream<V> {
    private readonly other: Iterable<R>;
    private readonly transform: (each: { a: T, b: R }) => V;
    constructor(stream: Stream<T>, other: Iterable<R>, transform: (each: { a: T, b: R}) => V) {
        super(stream as any, -1);
        this.other = other;
        this.transform = transform;
    }

    override *[Symbol.iterator]() {
        const selfIt   = this._values[Symbol.iterator]() as Iterator<T>,
              otherIt  = this.other[Symbol.iterator]();

        let selfNext  = selfIt.next(), 
            otherNext = otherIt.next();

        while (!selfNext.done && !otherNext.done) {
            yield this.transform({ a: selfNext.value, b: otherNext.value });
            selfNext  = selfIt.next();
            otherNext = otherIt.next();
        }
    }
}
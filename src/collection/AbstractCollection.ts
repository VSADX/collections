import { Comparable } from "../utils/Comparable.js";
import { Comparator } from "../utils/Comparator.js";
import { Collection } from "./Collection.js";

export abstract class AbstractCollection<T> implements Collection<T> {
    public allMatch(predicate: (element: T) => boolean): boolean {
        for (const item of this)
            if (!predicate(item)) 
                return false;
        return true;
    }

    public anyMatch(predicate: (element: T) => boolean): boolean {
        for (const item of this)
            if (predicate(item))
                return true;
        return false;
    }

    public associate<K, V>(transform: (element: T) => [K, V]): Map<K, V> {
        const map = new Map<K, V>();
        for (const item of this) {
            const pair = transform(item);
            map.set(pair[0], pair[1]);
        }
        return map;
    }

    public associateBy<K>(selector: (element: T) => K): Map<K, T>;
    public associateBy<K, V>(keySelector: (element: T) => K, valueTransform: (element: T) => V): Map<K, V>;
    public associateBy<K, V>(keySelector: (element: T) => K, valueTransform?: (element: T) => V): Map<K, T> | Map<K, V> {
        if (!valueTransform)
            return this.associateBy(keySelector, (element) => element);
        
        const map = new Map<K, V>();
        for (const item of this)
            map.set(keySelector(item), valueTransform(item));
        return map;
    }
    
    public associateWith<V>(valueSelector: (element: T) => V): Map<T, V> {
        const map = new Map<T, V>();
        for (const item of this)
            map.set(item, valueSelector(item));
        return map;
    }

    public contains(element: T): boolean {
        for (const item of this)
            if (item === element)
                return true;
        return false;
    }

    public containsAll(elements: Iterable<T>): boolean {
        for (const element of elements)
            if (!this.contains(element))
                return false;
        return true;
    }

    public count(): number;
    public count(predicate: (element: T) => boolean): number;
    public count(predicate?: (element: T) => boolean): number {
        let count = 0;
        if (!predicate) {
            for (const _ of this)
                count++;
        } else {
            for (const item of this)
                if (predicate(item)) 
                    count++;
        }
        return count;
    }

    public elementAt(index: number): T | undefined {
        let current = 0;
        for (const item of this) {
            if (index === current)
                return item;
            current++;
        }
        return undefined;
    }

    abstract filter(predicate: (element: T) => boolean): Collection<T>;
    abstract filter<S extends T>(predicate: (element: T) => boolean): Collection<S>;

    abstract filterIndexed(predicate: (each: { element: T; index: number; }) => boolean): Collection<T>;
    abstract filterIndexed<S extends T>(predicate: (each: { element: T; index: number; }) => boolean): Collection<S>;

    public find(predicate: (element: T) => boolean): T | undefined {
        for (const item of this)
            if (predicate(item))
                return item;
        return undefined;
    }

    public findIndex(predicate: (element: T) => boolean): number {
        let index = 0;
        for (const item of this) {
            if (predicate(item))
                return index;
            index++;
        }
        return -1;
    }

    public findLast(predicate: (element: T) => boolean): T | undefined {
        let last: T | undefined;
        // since AbstractCollection is a generalized superimplementation of all collections, we
        // can't assume it's backwards iterable nor random access, so we can only try best case O(n)
        for (const item of this)
            if (predicate(item))
                last = item;
        return last;
    }

    public findLastIndex(predicate: (element: T) => boolean): number {
        let index = 0;
        let lastIndex = -1;
        for (const item of this) {
            if (predicate(item))
                lastIndex = index;
            index++;
        }
        return lastIndex;
    }

    public first(): T | undefined {
        for (const first of this) 
            return first;
        return undefined;
    }

    abstract flatMap<U>(transform: (element: T) => Collection<U>): Collection<U>;

    abstract flatMapIndexed<U>(transform: (each: { element: T; index: number; }) => Collection<U>): Collection<U>;

    abstract flatten(this: Collection<Collection<T>>): Collection<T>;

    public fold<R>(initial: R, operation: (each: { acc: R; element: T; }) => R): R {
        let result = initial;
        for (const item of this)
            result = operation({ acc: result, element: item });
        return result;
    }

    public foldIndexed<R>(initial: R, operation: (each: { acc: R; element: T; index: number; }) => R): R {
        let index = 0;
        let result = initial;
        for (const item of this)
            result = operation({ acc: result, element: item, index: index++ });
        return result;
    }

    public forEach(consumer: (element: T) => void): void {
        for (const item of this)
            consumer(item);
    }

    public forEachIndexed(consumer: (each: { element: T; index: number; }) => void): void {
        let index = 0;
        for (const item of this)
            consumer({ element: item, index });
    }

    //abstract groupBy<K>(selector: (element: T) => K): Map<K, Collection<T>>;
    //abstract groupBy<K, V>(keySelector: (element: T) => K, valueTransform: (element: T) => V): Map<K, Collection<V>>;

    public indexOf(element: T): number {
        let index = 0;
        for (const item of this) {
            if (item === element)
                return index;
            index++;
        }
        return -1;
    }

    public isEmpty(): boolean {
        for (const _ of this) return false;
        return true;
    }

    public isNotEmpty(): boolean {
        for (const _ of this) return true;
        return false;
    }

    abstract iterator(): IterableIterator<T>;

    public join(): string;
    public join(options: { 
        separator?: string;
        prefix?: string;
        postfix?: string;
        limit?: number;
        truncated?: string;
        transform?: (item: T) => string;
    }): string;
    public join(options?: { 
        separator?: string;
        prefix?: string;
        postfix?: string;
        limit?: number;
        truncated?: string;
        transform?: (item: T) => string;
    }): string {
        const separator = options?.separator ?? ", ",
              prefix    = options?.prefix    ?? "",
              postfix   = options?.postfix   ?? "",
              limit     = options?.limit     ?? -1,
              truncated = options?.truncated ?? "...",
              transform = options?.transform;
        let base: string = prefix;
        let count = 0;
        for (const item of this) {
            if (++count > 1) 
                base += separator;
            if (limit < 0 || count <= limit)
                if (transform)
                    base += transform(item);
                else
                    base += (item as any).toString();
            else 
                break;
        }
        if (limit >= 0 && count > limit)
            base += truncated;
        base += postfix;
        return base;
    }

    public last(): T | undefined {
        let last: T | undefined;
        // not random access nor backwards iterable
        for (const item of this) 
            last = item;
        return last;
    }

    public lastIndexOf(element: T): number {
        let index = 0;
        let lastIndex = -1;
        // not random access nor backwards iterable
        for (const item of this) {
            if (item === element)
                lastIndex = index;
            index++;
        }
        return lastIndex;
    }

    abstract map<R>(transform: (element: T) => R): Collection<R>;

    abstract mapIndexed<R>(transform: (each: { element: T; index: number; }) => R): Collection<R>;

    public max<T extends Comparable<T>>(this: Collection<T>): T | null {
        if (this.isEmpty()) 
            return null;

        let max = this.first() as T;
        for (const item of this)
            if (max.compareTo(item) < 0)
                max = item;
        return max;
    }

    public maxBy<R extends Comparable<R>>(selector: (element: T) => R): T | null {
        if (this.isEmpty())
            return null;
            
        let max = this.first() as T;
        for (const item of this)
            if (selector(max).compareTo(selector(item)) < 0)
                max = item;
        return max;
    }

    public maxOf(selector: (element: T) => number): T | null {
        if (this.isEmpty())
            return null;

        let max = this.first() as T;
        for (const item of this) 
            if (selector(max) < selector(item))
                max = item;
        return max;
    }

    public maxWith(comparator: Comparator<T>): T | null {
        if (this.isEmpty())
            return null;

        let max = this.first() as T;
        for (const item of this)
            if (comparator.compare(max, item) < 0)
                max = item;
        return max;
    }

    public min<T extends Comparable<T>>(this: Collection<T>): T | null {
        if (this.isEmpty())
            return null;
        
        let min = this.first() as T;
        for (const item of this)
            if (min.compareTo(item) > 0)
                min = item;
        return min;
    }

    public minBy<R extends Comparable<R>>(selector: (element: T) => R): T | null {
        if (this.isEmpty())
            return null;

        let min = this.first() as T;
        for (const item of this)
            if (selector(min).compareTo(selector(item)) > 0)
                min = item;
        return min;
    }

    public minOf(selector: (element: T) => number): T | null {
        if (this.isEmpty())
            return null;

        let min = this.first() as T;
        for (const item of this)
            if (selector(min) > selector(item))
                min = item;
        return min;
    }

    public minWith(comparator: Comparator<T>): T | null {
        if (this.isEmpty())
            return null;

        let min = this.first() as T;
        for (const item of this)
            if (comparator.compare(min, item) > 0)
                min = item;
        return min;
    }

    public noneMatch(predicate: (element: T) => boolean): boolean {
        for (const item of this)
            if (predicate(item))
                return false;
        return true;
    }

    abstract onEach(consumer: (element: T) => void): Collection<T>;

    abstract onEachIndexed(consumer: (each: { element: T; index: number; }) => void): Collection<T>;

    public reduce<S extends T>(operation: (each: { acc: S; element: T; }) => S): S | null {
        if (this.isEmpty())
            return null;

        const iterator = this.iterator();
        let result = iterator.next().value as S;
        for (const item of iterator)
            result = operation({ acc: result, element: item });
        return result;
    }

    public reduceIndexed<S extends T>(operation: (each: { acc: S; element: T; index: number }) => S): S | null {
        if (this.isEmpty())
            return null;

        let index = 0;
        const iterator = this.iterator();
        let result = iterator.next().value as S;
        for (const item of iterator)
            result = operation({ acc: result, element: item, index: index++ });
        return result;
    }

    abstract size(): number;

    abstract unzip<R>(this: Collection<[T, R]>): [Collection<T>, Collection<R>];

    abstract zip<R>(other: Iterable<R>): Collection<[T, R]>;
    abstract zip<R, V>(other: Iterable<R>, transform: (each: { a: T; b: R; }) => V): Collection<V>;

    abstract [Symbol.iterator](): IterableIterator<T>;
}
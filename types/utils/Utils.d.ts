export declare class Utils {
    public static isIterable<T>(value: any): value is Iterable<T>;
    public static isAsyncIterable<T>(value: any): value is AsyncIterator<T>;
    public static isIterator<T>(value: any): value is Iterator<T>;
    public static isIterableIterator<T>(value: any): value is IterableIterator<T>;
    public static isLengthed<T>(value: T): value is T & { length: number };
    public static isSized<T>(value: T): value is T & { size: number };
    public static ensurePositiveSize(n: number): void;
    public static ensureWithinBounds(size: number, index: number): void;
    public static ensureWithinAddingBounds(size: number, index: number): void;
    public static readonly IllegalStateError = class IllegalStateError extends Error {
        constructor(message?: string) { super(message);
            Object.setPrototypeOf(this, new.target.prototype);
        }
    }
    public static readonly NoSuchElementError = class NoSuchElementError extends Error {
        constructor(message?: string) { super(message);
            Object.setPrototypeOf(this, new.target.prototype);
        }
    }
    public static readonly IndexOutOfBoundsError = class IndexOutOfBoundsError extends Error {
        constructor(message?: string) { super(message);
            Object.setPrototypeOf(this, new.target.prototype);
        }
    }
}
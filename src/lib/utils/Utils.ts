export class Utils {
    public static isIterable<T>(value: any): value is Iterable<T> {
        return typeof value[Symbol.iterator] === "function";
    }

    public static isAsyncIterable<T>(value: any): value is AsyncIterable<T> {
        return typeof value[Symbol.asyncIterator] === "function";
    }

    public static isIterator<T>(value: any): value is Iterator<T> {
        return typeof value["next"] === "function";
    }

    public static isIterableIterator<T>(value: any): value is IterableIterator<T> {
        return Utils.isIterable(value) && Utils.isIterator(value);
    }

    public static isLenghted<T>(value: T): value is T & { length: number } {
        return typeof (value as any)["length"] === "number";
    }
    
    public static isSized<T>(value: T): value is T & { size: number } {
        return typeof (value as any)["size"] === "number";
    }

    public static ensurePositiveSize(n: number): void {
        if (n < 0) throw new TypeError(`number must be positive. received: ${n}`);
    }

    public static ensureWithinBounds(size: number, index: number): void {
        if (index < 0 && index >= size)
            throw new Utils.IndexOutOfBoundsError();
    }
    
    public static ensureWithinAddingBounds(size: number, index: number): void {
        Utils.ensureWithinBounds(size + 1, index);
    }

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
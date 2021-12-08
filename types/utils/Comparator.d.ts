import { Comparable } from "./Comparable.js";

export declare class Comparator<T> {
    public readonly compare: (a: T, b: T) => number;

    public constructor(comparison: (a: T, b: T) => number);

    public thenComparing(other: Comparator<T>): Comparator<T>;
    public thenComparingWith<U>(keySelector: (t: T) => U, keyComparator: Comparator<U>): Comparator<T>;
    public thenComparingBy<U extends Comparable<U>>(keySelector: (t: T) => U): Comparator<T>;
    public comparingWith<U>(keySelector: (t: T) => U, keyComparator: Comparator<U>): Comparator<T>
    public comparingBy<U extends Comparable<U>>(keySelector: (t: T) => U): Comparator<T>;
    public reversed(): Comparator<T>;
    public static numbers(): Comparator<number>;
    public static strings(): Comparator<string>;
    public static reverseOrder<T extends Comparable<T>>(): Comparator<T>;
    public static naturalOrder<T extends Comparable<T>>(): Comparator<T>;
    public static nullsFirst<T>(comparator: Comparator<T>): Comparator<T>;
    public static nullsLast<T>(comparator: Comparator<T>): Comparator<T>;
}
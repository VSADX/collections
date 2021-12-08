export interface Comparable<T> {
    // spec: -0 for less than, =0 for equal, +0 for greater than
    compareTo(other: T): number;
}
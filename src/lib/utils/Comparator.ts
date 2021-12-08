import { Comparable } from "./Comparable.js";

/**
 * Wraps custom defined logic for comparing a pair of `T` values.
 * Similar to Java's `Comparator` class, provides a way to compose Comparators
 * by using `Comparator<T>.thenComparing` or `Comparator<T>.thenComparingByKey`
 */
export class Comparator<T> {
    public readonly compare: (a: T, b: T) => number;

    public constructor(comparison: (a: T, b: T) => number) {
        this.compare = comparison;
    }

    public thenComparing(other: Comparator<T>): Comparator<T> {
        const self = this;
        return new Comparator<T>((a: T, b: T): number => {
            const res = self.compare(a, b);
            return (res !== 0) ? res : other.compare(a, b);
        });
    }

    public thenComparingWith<U>(
        keySelector: (t: T) => U, 
        keyComparator: Comparator<U>
    ): Comparator<T> {
        return this.thenComparing(this.comparingWith(keySelector, keyComparator));
    }

    public thenComparingBy<U extends Comparable<U>>(
        keySelector: (t: T) => U
    ): Comparator<T> {
        return this.thenComparing(this.comparingBy(keySelector));
    }

    public comparingWith<U>(
        keySelector: (t: T) => U, 
        keyComparator: Comparator<U>
    ): Comparator<T> {
        return new Comparator<T>((a: T, b: T): number =>
            keyComparator.compare(keySelector(a), keySelector(b))
        );
    }

    public comparingBy<U extends Comparable<U>>(
        keySelector: (t: T) => U
    ): Comparator<T> {
        return new Comparator<T>((a: T, b: T): number =>
            keySelector(a).compareTo(keySelector(b))
        );
    }

    public reversed(): Comparator<T> {
        return reverseOrder(this);
    }

    public static numbers(): Comparator<number> {
        return NumberComparator.INSTANCE;
    }

    public static strings(): Comparator<string> {
        return StringComparator.INSTANCE;
    }

    public static reverseOrder<T extends Comparable<T>>(): Comparator<T> {
        return reverseOrder();
    }

    public static naturalOrder<T extends Comparable<T>>(): Comparator<T> {
        return NaturalOrderComparator.INSTANCE as any;
    }

    public static nullsFirst<T>(comparator: Comparator<T>): Comparator<T> {
        return new NullComparator(true, comparator);
    }

    public static nullsLast<T>(comparator: Comparator<T>): Comparator<T> {
        return new NullComparator(false, comparator);
    }
}

function reverseOrder<T>(): Comparator<T>
function reverseOrder<T>(c: Comparator<T>): Comparator<T>
function reverseOrder<T>(c?: Comparator<T>): Comparator<T> {
    if (c === null || c === undefined) {
        return ReverseComparator.REVERSE_ORDER as any;
    } else if ((c as any) === ReverseComparator.REVERSE_ORDER) {
        return NaturalOrderComparator.INSTANCE as any;
    } else if ((c as any) === NaturalOrderComparator.INSTANCE) {
        return ReverseComparator.REVERSE_ORDER as any;
    } else if (c instanceof ReverseComparator2) {
        return c.cmp;
    } else {
        return new ReverseComparator2(c);
    }
}

class NumberComparator extends Comparator<number> {
    public static readonly INSTANCE = new NumberComparator((a: number, b: number) => a - b);
}

class StringComparator extends Comparator<string> {
    public static readonly INSTANCE = new StringComparator(
        (a: string, b: string) => a > b ? 1 : b > a ? -1 : 0);
}

class NaturalOrderComparator extends Comparator<Comparable<unknown>> {
    public static readonly INSTANCE = new NaturalOrderComparator(
        (a: Comparable<unknown>, b: Comparable<unknown>): number => a.compareTo(b));

    private constructor(
        comparison: (a: Comparable<unknown>, b: Comparable<unknown>) => number
    ) { super(comparison) }

    public override reversed(): Comparator<Comparable<unknown>> {
        return Comparator.reverseOrder();
    }
}

class NullComparator<T> extends Comparator<T> {
    private readonly nullFirst: boolean;
    private readonly real: Comparator<T> | null;

    public constructor(nullFirst: boolean, real: Comparator<T> | null) {
        super(
            (a: T, b: T): number => {
                if (a === null || a === undefined) {
                    return (b === null || b === undefined) ? 0 : (nullFirst ? -1 : 1);
                } else if (b === null || b === undefined) {
                    return nullFirst ? 1 : -1;
                } else {
                    return (real === null || real === undefined) ? 0 : real.compare(a, b);
                }
            }
        );
        this.nullFirst = nullFirst;
        this.real = real;
    }

    public override thenComparing(other: Comparator<T>): Comparator<T> {
        return new NullComparator(this.nullFirst, (this.real === null || this.real === undefined) 
            ? other : this.real.thenComparing(other))
    }

    public override reversed(): Comparator<T> {
        return new NullComparator(!this.nullFirst, (this.real === null || this.real === undefined) 
            ? null : this.real.reversed())
    }
}

class ReverseComparator extends Comparator<Comparable<unknown>> {   
    static readonly REVERSE_ORDER: ReverseComparator = new ReverseComparator(
        (a: Comparable<unknown>, b: Comparable<unknown>): number => b.compareTo(a));

    public override reversed() {
        return Comparator.naturalOrder();
    }
}

class ReverseComparator2<T> extends Comparator<T> {
    readonly cmp: Comparator<T>;
    constructor(comparator: Comparator<T>) {    
        super((a: T, b: T): number => comparator.compare(b, a));
        this.cmp = comparator;
    }

    public override reversed(): Comparator<T> {
        return this.cmp;
    }
}
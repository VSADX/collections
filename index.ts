import { ArrayList } from "./src/list/ArrayList.js";
import { LinkedList } from "./src/list/LinkedList.js";
import { List } from "./src/list/List.js";
import { Comparable } from "./src/utils/Comparable.js";

class ComparableNumber implements Comparable<ComparableNumber> {
    constructor(public readonly value: number) {}
    public valueOf(): number { return this.value; }
    public compareTo(other: ComparableNumber): number {
        return this.value - other.value;
    }
}

const linkedList = LinkedList.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
                       .map(i => new ComparableNumber(i));

const list = ArrayList.from(linkedList) as List<ComparableNumber>;

linkedList.sorted()
          .sortedDescending()
          .filter(i => i.valueOf() % 2 === 0)
          .reduceRight(({ element }) => element)

list.sorted()
    .sortedDescending()
    .filter(i => i.valueOf() % 2 === 0)
    .reduceRight(({ element }) => element)
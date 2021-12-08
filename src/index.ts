import { ArrayList } from "./lib/list/ArrayList.js";
import { Comparator } from "./lib/utils/Comparator.js";

console.log(
    ArrayList.of(1, 2, 3, 4, 5)
             .sortedWithDescending(
                 Comparator.numbers().reversed()
             )
             .toSequence()
             .constrainedOnce()
             .map(String)
             .join({ 
                 prefix: "A list of numbers: [",
                 postfix: "]"
             })
);
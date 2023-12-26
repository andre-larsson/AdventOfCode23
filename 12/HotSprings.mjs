import { readInput } from "../shared/util.mjs"

const input = await readInput("sample.data");

const parseInput = (input) => {
    const lines = input.split("\n")
        .filter(line => line.length > 0)
        .map(line => {
            let [condition, nContiguous] = line.split(" ");
            nContiguous = nContiguous.split(",").map(n => parseInt(n));
            return {
                condition: condition,
                nContiguous: nContiguous
            }
        }
    );
    return lines;
}

const recordList = parseInput(input);


const getAllPossibleRecords = (record) => {

    let memo = {};

    const getNumPossibleArrangements = (condition, remainingGroups) => {
        if(condition.length == 0 && remainingGroups.length == 0) {
            // no remaining groups and no remaining condition
            // console.log("!!!", condition, remainingGroups);
            return 1;
        } else if(condition.length == 0 && remainingGroups.length > 0) {
            // not possible
            return 0;
        } else if(condition.length*2-1 < remainingGroups.length){
            // cannot split into enough groups
            return 0;
        }

        const char = condition[0];
        const rest = condition.slice(1);


        let key = condition + remainingGroups.join("");
        if(memo[key]) {
            // console.log("memo hit", key, memo[key]);
            return memo[key];
        }

        if(char==".") {
            // continue
            const result = getNumPossibleArrangements(rest, remainingGroups);
            key = rest + remainingGroups.join("");
            // console.log("memo miss1", key, result);
            memo[key] = result;
            return result;
        }

        // if(remainingGroups==0) {
        //     // no more groups to fill
        //     if( condition.match(/#/g) ) {
        //         // no more groups but we have more # in condition
        //         return 0;
        //     } else {
        //         // no more groups and no more # in condition
        //         return 1;
        //     }
        // }

        if( char == "#") {
            const currentGroup = remainingGroups[0];
            // valid if next N characters can be #, and character after that is not an #
            if(condition.length >= currentGroup &&
                !condition.slice(0, currentGroup).match(/\./g) &&
                (condition.length == currentGroup || condition[currentGroup] != "#")) // character after group cannot be #
                {
                    const restWithoutCurrentGroup = rest.slice(currentGroup); // start next group after '.' that separates groups
                    // console.log("condition", condition, "currentGroup", currentGroup, "restWithoutCurrentGroup", restWithoutCurrentGroup, "remainingGroups", remainingGroups);
                    const result = getNumPossibleArrangements(restWithoutCurrentGroup, remainingGroups.slice(1))
                    key = restWithoutCurrentGroup + remainingGroups.slice(1).join("");
                    memo[key] = result;
                    // console.log("memo miss2", key, result);
                    return result;
                }            
            return 0;
        }

        if( char == "?") {
            const result= getNumPossibleArrangements("#" + rest, remainingGroups)
                + getNumPossibleArrangements("." + rest, remainingGroups);
            memo[key] = result;
            return result;
        }
        throw new Error("Invalid character");

    }


    const result = getNumPossibleArrangements(record.condition, record.nContiguous);

    console.log(result);
    return result;
}

// Part 1
const possibleRecords = recordList.map(record => getAllPossibleRecords(record));
const sum1 = possibleRecords.reduce((acc, records) => acc + records, 0);

console.log(`Part 1: ${sum1}`);

// Part 2
const unfoldedRecords = recordList.map(record => {
    const unfoldedCondition = (record.condition + "?").repeat(5).slice(0, -1);
    // repeat array 5 times
    const unfoldedNContiguous = Array(5).fill(record.nContiguous).flat();
    return {
        condition: unfoldedCondition,
        nContiguous: unfoldedNContiguous
    }
});

const pr2 = unfoldedRecords.map(record => getAllPossibleRecords(record));
const sum2 = pr2.reduce((acc, records) => acc + records, 0);

// very slow and still wrong answer, am I so bad at this :(
console.log(`Part 2: ${sum2}`);
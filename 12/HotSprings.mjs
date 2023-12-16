import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const parseInput = (input) => {
    const lines = input.split("\n")
        .filter(line => line.length > 0)
        .map(line => {
            let [condition, nContiguous] = line.split(" ");
            nContiguous = nContiguous.split(",").map(n => parseInt(n));
            return {
                condition,
                nContiguous: nContiguous
            }
        }
    );
    return lines;
}

const conditionRecords = parseInput(input);

const isRecordPossible = (condition, nContiguous) => {
    // check if a record is consistent for a given number of contiguous numbers
    let groups = condition.split(/\.+/).filter(g => g.length > 0);
    if(groups.length != nContiguous.length) {
        return false;
    }

    for (let i = 0; i < groups.length; i++) {
        if (groups[i].length != nContiguous[i]) {
            return false;
        }
    }

    return true;
}

const isPrefixPossible = (condition, nContiguous) => {
    // check if a prefix record is consistent for a given number of contiguous
    // numbers
    let groups = condition.split(/\.+/).filter(g => g.length > 0);

    if(groups.length <= 0) return true;

    if(groups.length > nContiguous.length) {
        return false;
    }

    // last contiguous group has an end
    const lastGroupIsComplete = condition[condition.length-1] == ".";

    for (let i = 0; i < groups.length-1; i++) {
        if (groups[i].length != nContiguous[i]) {
            return false;
        }
    }

    // check last group
    const lastGroupLength = groups[groups.length-1].length;
    const lastContiguousLength = nContiguous[groups.length-1];
    if (lastGroupIsComplete) {
        if (lastGroupLength != lastContiguousLength) return false;
    }else{
        if (lastGroupLength > lastContiguousLength) return false;
    }

    return true;
}

const getAllPossibleRecords = (record) => {

    let generated = [];
    const generateRecords = (record, generated) => {
        // if no ? is found, add the record, if it is consistent
        if (!record.condition.match(/\?/)) {
            if (isRecordPossible(record.condition, record.nContiguous)) {
                generated.push(record);
            }
            return;
        }

        const completedPart = record.condition.split("?")[0];

        // if the completed part is not consistent, return
        if (completedPart.length>0 && !isPrefixPossible(completedPart, record.nContiguous)) {
            return;
        }
        

        // generate all possible records for a given condition
        // replace ? with either . or #
        const cond1 = record.condition.replace(/\?/, "#");
        const cond2 = record.condition.replace(/\?/, ".");

        // generate records for both conditions
        generateRecords({
            condition: cond1,
            nContiguous: record.nContiguous
        }, generated);
        generateRecords({
            condition: cond2,
            nContiguous: record.nContiguous
        }, generated);
    }

    generateRecords(record, generated);

    console.log(record.condition, generated.length);
    return generated;
}

// Part 1
const possibleRecords = conditionRecords.map(record => getAllPossibleRecords(record));
const sum1 = possibleRecords.reduce((acc, records) => acc + records.length, 0);

console.log(`Part 1: ${sum1}`);

// Part 2
const unfoldedRecords = conditionRecords.map(record => {
    const unfoldedCondition = (record.condition + "?").repeat(5).slice(0, -1);
    // repeat array 5 times
    const unfoldedNContiguous = Array(5).fill(record.nContiguous).flat();
    return {
        condition: unfoldedCondition,
        nContiguous: unfoldedNContiguous
    }
});

const pr2 = unfoldedRecords.map(record => getAllPossibleRecords(record));
const sum2 = pr2.reduce((acc, records) => acc + records.length, 0);

console.log(`Part 2: ${sum2}`);
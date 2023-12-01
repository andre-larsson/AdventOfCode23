import { open } from 'node:fs/promises';

// dictionary of digits
// { stringMatch: digit}
let digitDict = {}

for(let i=0; i<10; i++) {
    digitDict[i] = i;
}

let extendedDigitDict = {
    ...digitDict,
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five':5,
    'six':6,
    'seven':7,
    'eight':8,
    'nine': 9
};



const sum1 = await sumValues(digitDict);
console.log(`Sum1: ${sum1}`);


const sum2 = await sumValues(extendedDigitDict);

console.log(`Sum2: ${sum2}`);

async function sumValues(digitDict) {
    const file = await open('./input1.data');

    const allNumbers = [];

    // requires Node 18.11.0
    for await (const line of file.readLines()) {
        const newNumber = findExtremeMatches(line, digitDict);

        allNumbers.push(newNumber);
    }

    const sum = allNumbers.reduce((a, b) => a + b, 0);
    return sum;
}

function findExtremeMatches(line, digitDict) {

    let firstMatch = null;
    let lastMatch = null;

    let firstIndex = 99999999;
    let lastIndex = -1;

    for(let matchValue of Object.keys(digitDict)) {
        const firstMatchIndex = line.indexOf(matchValue);
        const lastMatchIndex = line.lastIndexOf(matchValue);

        if(firstMatchIndex !==-1 && firstMatchIndex <= firstIndex) {
            firstIndex = firstMatchIndex;
            firstMatch = matchValue;
        }

        if(lastMatchIndex !==-1 && lastMatchIndex >= lastIndex) {
            lastIndex = lastMatchIndex;
            lastMatch = matchValue;
        }
    }

    const firstDigit = digitDict[firstMatch];
    const lastDigit = digitDict[lastMatch];

    // console.log(line)
    // console.log(`First: ${firstDigit}, Last: ${lastDigit}`)

    const newNumber = parseInt(`${firstDigit}${lastDigit}`);

    return newNumber;
}
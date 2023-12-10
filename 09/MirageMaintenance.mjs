import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const getDiffs = (numbers) => {
    let diffs = [];
    for (let i = 0; i < numbers.length - 1; i++) {
        diffs.push(numbers[i + 1] - numbers[i]);
    }
    return diffs;
};

const numbers = input.split("\n")
    .filter((line) => line.length > 0)
    .map((line) => line.split(" ").map((n) => parseInt(n)));


let extrapolatedNumbers = [];
for (let i = 0; i < numbers.length; i++) {
    let diffList = [numbers[i]];
    let currentDiff = numbers[i];
    while (currentDiff.some((diff) => diff !== 0)) {
        currentDiff = getDiffs(currentDiff);
        diffList.push(currentDiff);

    }

    if(diffList.length == 0 || diffList[0].length == 1) {
        // all numbers are 0, or constant
        extrapolatedNumbers.push({
            first: numbers[i][0],
            last: numbers[i][0]
        });
        continue;
    }

    // add extra zero to first and last diff
    diffList[diffList.length - 1].push(0);
    diffList[diffList.length - 1].unshift(0);

    // extrapolate last number
    for(let j = diffList.length - 2; j >= 0; j--) {
        const diffBelow = diffList[j+1][diffList[j+1].length - 1];
        const lastNumber = diffList[j][diffList[j].length - 1];
        console.log("diffBelow", diffBelow, "lastNumber", lastNumber)
        diffList[j].push(diffBelow + lastNumber);
    }
    
    // extrapolate first number
    for(let j = diffList.length - 2; j >= 0; j--) {
        const diffBelow = diffList[j+1][0];
        const firstNumber = diffList[j][0];
        diffList[j].unshift(-diffBelow + firstNumber);
    }

    extrapolatedNumbers.push({
        first: diffList[0][0],
        last: diffList[0][diffList[0].length - 1]
    });
}

const answer1 = extrapolatedNumbers.reduce((acc, o) => acc + o.last, 0);
console.log(`Part 1 answer: ${answer1}`);

const answer2 = extrapolatedNumbers.reduce((acc, o) => acc + o.first, 0);
console.log(`Part 2 answer: ${answer2}`);


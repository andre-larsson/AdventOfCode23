import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const getDistance = (chargeTime, raceTime) => {
    if (chargeTime >= raceTime) return 0;
    const distance = chargeTime * (raceTime - chargeTime);
    return distance;
}

const findNumWaysToWin = (raceTime, distance) => {
    let numWinnings = 0;
    for(let chargeTime = 0; chargeTime < raceTime; chargeTime++){
        const d = getDistance(chargeTime, raceTime);
        if(d > distance){
            numWinnings++;
        }
    }
    return numWinnings;
}

// Part 1

// parse the input
const inputNumbers = input.split("\n")
    .map(s => s.match(/(\d+)/g)?.map( a => Number(a)))
    .filter(l => l != null);

// transposed the array to get races as rows
const races = inputNumbers[0].map((_, colIndex) => inputNumbers.map(row => row[colIndex]));


let marginOfError = 1;
for(let race of races){
    const [time, distance] = race;
    marginOfError = marginOfError*findNumWaysToWin(time, distance);
}

console.log("Part 1 Answer: ", marginOfError);

// Part 2

// parse the input
const inputNumbers2 = input.split("\n")
    .map(s => {
        // remove whitespace
        s = s.replace(/\s/g, '');
        // match numbers
        return s.match(/(\d+)/g)?.map( a => Number(a));
    })
    .filter(l => l != null);

const time2 = inputNumbers2[0][0];
const distance2 = inputNumbers2[1][0];

const numWinnings2 = findNumWaysToWin(time2, distance2);

console.log("Part 2 Answer: ", numWinnings2);
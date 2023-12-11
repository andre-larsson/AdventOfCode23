import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

// split into lines and remove empty lines
let skyMap1 = input.split("\n").filter((line) => line.length > 0);


// Part 1

// find rows with no galaxies and add empty space
for(let i = 0; i < skyMap1.length; i++) {
    const row = skyMap1[i].split("");
    if(row.every((char) => char === ".")) {
        const newRow = ".".repeat(skyMap1[i].length);
        skyMap1.splice(i, 0, newRow);
        i++;
    }
}

// find columns with no galaxies and add empty space
let width = skyMap1[0].length;
for(let i = 0; i < width; i++) {
    if(skyMap1.every((row) => row[i] === ".")) {
        for(let j = 0; j < skyMap1.length; j++) {
            skyMap1[j] = skyMap1[j].slice(0, i) + "." + skyMap1[j].slice(i);
        }
        i++;
        width++;
    }
}

// print result
// console.log(skyMap1.join("\n"));

// find galaxies
const galaxies = [];

for(let i = 0; i < skyMap1.length; i++) {
    const row = skyMap1[i];
    for(let j = 0; j < row.length; j++) {
        if(row[j] == "#") {
            galaxies.push({x: j, y: i})
        }
    }
}

// for each pair of galaxies, calculate distance
let sumOfDistances = 0;
for(let i = 0; i < galaxies.length; i++) {
    // loop through diagonals only
    for(let j = i + 1; j < galaxies.length; j++) {
        const distance = Math.abs(galaxies[i].x - galaxies[j].x) + Math.abs(galaxies[i].y - galaxies[j].y);
        sumOfDistances += distance;
    }
}

console.log("Answer Part 1: ", sumOfDistances);

// Part 2

const skyMap2 = input.split("\n").filter((line) => line.length > 0);

// find galaxies

const galaxies2 = [];
for(let i = 0; i < skyMap2.length; i++) {
    const row = skyMap2[i].split("");
    for(let j = 0; j < row.length; j++) {
        if(row[j] == "#") {
            galaxies2.push({x: j, y: i})
        }
    }
}

// find cumulative number of empty rows
const emptyRows = [];
let emptyRowsCount = 0;
for(let i = 0; i < skyMap2.length; i++) {
    const row = skyMap2[i].split("");
    if(row.every((char) => char === ".")) {
        emptyRowsCount++;
    }
    emptyRows.push(emptyRowsCount);
}

// find cumulative number of empty columns
const emptyCols = [];
let emptyColsCount = 0;
for(let i = 0; i < skyMap2[0].length; i++) {
    if(skyMap2.every((row) => row[i] === ".")) {
        emptyColsCount++;
    }
    emptyCols.push(emptyColsCount);
}

const factor = 1000000;
// calc new coord taking into account expanding space
const expandedCoord = (coord, numEmpty) => {
    let nonEmpty = coord - numEmpty;
    return nonEmpty + numEmpty*factor;
}

// calc distance between galaxies using coords after expansion
const expandedDistance = (g1, g2) => {
    const x1 = expandedCoord(g1.x, emptyCols[g1.x]);
    const y1 = expandedCoord(g1.y, emptyRows[g1.y]);
    const x2 = expandedCoord(g2.x, emptyCols[g2.x]);
    const y2 = expandedCoord(g2.y, emptyRows[g2.y]);
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}


// for each pair of galaxies, calculate distance
let sumOfDistances2 = 0;
for(let i = 0; i < galaxies2.length; i++) {
    // loop through diagonals only
    for(let j = i + 1; j < galaxies2.length; j++) {
        sumOfDistances2 += expandedDistance(galaxies2[i], galaxies2[j]);
    }
}

console.log("Answer Part 2: ", sumOfDistances2);
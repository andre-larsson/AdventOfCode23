import { dir } from "console";
import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const parseInput = (input) => {
    const lines = input.split("\n").filter(line => line.length > 0)
                .map(line => line.split(" "));
    return lines;
}

const parseInputSwapped = (input) => {
    const instructions = parseInput(input);

    const swappedInstructions = instructions.map(instruction => {
        const hexStr = instruction[2].slice(2, instruction[2].length - 2);
        const hex = parseInt(hexStr, 16);
        const direction = instruction[2][instruction[2].length - 2];
        let dirStr = "";

        if (direction == "0") {
            dirStr = "R";
        } else if (direction == "1") {
            dirStr = "D";
        } else if (direction == "2") {
            dirStr = "L";
        } else if (direction == "3") {
            dirStr = "U";
        }

        return [dirStr, hex, instruction[2]];
    });

    return swappedInstructions;
}

const digBorders = (digInstructions) => {
    let map = new Set();
    let x = 0;
    let y = 0;
    for (const instruction of digInstructions) {
        const direction = instruction[0];
        const steps = parseInt(instruction[1]);

        if (direction === "D") {
            for (let i = 0; i < steps; i++) {
                y++;
                map.add(`${x},${y}`);
            }
        } else if (direction === "R") {
            for (let i = 0; i < steps; i++) {
                x++;
                map.add(`${x},${y}`);
            }
        } else if (direction === "U") {
            for (let i = 0; i < steps; i++) {
                y--;
                map.add(`${x},${y}`);
            }
        } else if (direction === "L") {
            for (let i = 0; i < steps; i++) {
                x--;
                map.add(`${x},${y}`);
            }
        }
    }
    return map;
}

const fillInterior = (digged) => {
    // modifies map in place, returns map
    let toVisit = new Set();

    toVisit.add(`${1},${1}`);

    do{
        const nextToVisit = new Set();
        for(const cell of toVisit) {
            let [x, y] = cell.split(",").map(coord => parseInt(coord));
            digged.add(`${x},${y}`);
                // dig in all directions
            if(!digged.has(`${x},${y-1}`)) {
                nextToVisit.add(`${x},${y-1}`);
            }
            if(!digged.has(`${x},${y+1}`)) {
                nextToVisit.add(`${x},${y+1}`);
            }
            if(!digged.has(`${x-1},${y}`)) {
                nextToVisit.add(`${x-1},${y}`);
            }
            if(!digged.has(`${x+1},${y}`)) {
                nextToVisit.add(`${x+1},${y}`);
            }
        }
    toVisit = nextToVisit;
    } while (toVisit.size > 0);
    

    return digged;
}

// Part 1

const digInstructions1 = parseInput(input);
let digged1 = digBorders(digInstructions1);

console.log("borders digged", digged1.size);

digged1 = fillInterior(digged1);
console.log(`Number of digged cells: ${digged1.size}`);

// Part 2

// ????
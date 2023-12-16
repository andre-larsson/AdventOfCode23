import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const parseInput = (input) => {
    const lines = input.split("\n")
        .filter(line => line.length > 0)
        .map(line => {
            return line.split("");
        }
    );
    return lines;
}

let dishGrid1 = parseInput(input);

// updates grid in-place, returns grid
const tiltUpWards = (grid) => {
    // tilt the dish upwards
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    let hasMoved = null;
    do{
        hasMoved = false;
        for (let y = 1; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                if(grid[y][x] == "O" && grid[y-1][x] == ".") {
                    // move rock up if there is space
                    grid[y-1][x] = "O";
                    grid[y][x] = ".";
                    hasMoved = true;
                }
            }
        }
    } while(hasMoved);
    return grid;
}

const tiltDownWards = (grid) => {
    // tilt the dish downwards
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    let hasMoved = null;
    do{
        hasMoved = false;
        for (let y = gridHeight-2; y >= 0; y--) {
            for (let x = 0; x < gridWidth; x++) {
                if(grid[y][x] == "O" && grid[y+1][x] == ".") {
                    // move rock down if there is space
                    grid[y+1][x] = "O";
                    grid[y][x] = ".";
                    hasMoved = true;
                }
            }
        }
    } while(hasMoved);
    return grid;
}

const tiltLeftWards = (grid) => {
    // tilt the dish leftwards
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    let hasMoved = null;
    do{
        hasMoved = false;
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 1; x < gridWidth; x++) {
                if(grid[y][x] == "O" && grid[y][x-1] == ".") {
                    // move rock left if there is space
                    grid[y][x-1] = "O";
                    grid[y][x] = ".";
                    hasMoved = true;
                }
            }
        }
    } while(hasMoved);
    return grid;
}

const tiltRightWards = (grid) => {
    // tilt the dish rightwards
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    let hasMoved = null;
    do{
        hasMoved = false;
        for (let y = 0; y < gridHeight; y++) {
            for (let x = gridWidth-2; x >= 0; x--) {
                if(grid[y][x] == "O" && grid[y][x+1] == ".") {
                    // move rock right if there is space
                    grid[y][x+1] = "O";
                    grid[y][x] = ".";
                    hasMoved = true;
                }
            }
        }
    } while(hasMoved);
    return grid;
}

const calcTotalLoad = (grid) => {
    return grid.reduce((acc, row, rowI) => {
        const load = grid.length - rowI;
        return acc + row.reduce((acc, cell) => {
            return acc + (cell == "O" ? load : 0);
        }, 0);
    }, 0);
}

dishGrid1 = tiltUpWards(dishGrid1);
const totalLoad1 = calcTotalLoad(dishGrid1);

// Part 1

console.log("Part 1: ", totalLoad1);

// Part 2

const spinDish = (grid, n) => {
    let newGrid = JSON.parse(JSON.stringify(grid));
    // spin the dish n times
    // return the loads for each spin
    let loads = [];
    for (let i = 0; i < n; i++) {
        newGrid = tiltUpWards(newGrid);
        newGrid = tiltLeftWards(newGrid);
        newGrid = tiltDownWards(newGrid);
        newGrid = tiltRightWards(newGrid);
        loads.push(calcTotalLoad(newGrid));
    }
    return loads;
}

const findRepeatingPattern = (integers, offset) => {
    // find a repeating pattern in a list of integers
    // offset is the number of integers to skip at the beginning of the list
    // return the pattern length and the pattern
    
    let patternLength = 1;
    let pattern = null;

    do{
        patternLength++;
        pattern = integers.slice(offset, offset+patternLength);
        const patternRepeated = integers.slice(offset+patternLength, offset+patternLength*2);
        if(patternRepeated.join(".") == pattern.join(".")) {
            console.log("Pattern found: ", pattern);
            break;
        }
    } while(patternLength < integers.length);

    return {patternLength, pattern};
}


const loads2 = spinDish(dishGrid1, 300);

// check for repeating pattern after 200 spins
const patternStartIndex = 200;
const {patternLength, pattern} = findRepeatingPattern(loads2, patternStartIndex);

// calculate the load for the 1000000000 spins
// -1 is due to indexing starting at 0
const numRemainingSpins = (1000000000-patternStartIndex-1) % patternLength;
const totalLoad2 = pattern[numRemainingSpins];

console.log("Part 2: ", totalLoad2);
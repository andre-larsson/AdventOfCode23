import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const grids = input.split("\n\n")
.map(chunk => chunk.split("\n")
    .filter(line => line.length > 0)
    .map(line => line.split("")));


const isSymmetryLine = (grid, x) => {
    // is x a (vertical) symmetry line for grid?
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    // check vertical lines of symmetries
    const maxPatternWidth = Math.min(x, gridWidth-x);

    // check if current line is a symmetry line
    for (let width = 1; width <= maxPatternWidth; width++) {
        for (let y = 0; y < gridHeight; y++) {
            if (grid[y][x-width] !== grid[y][x+width-1]) {
                return false;
            }
        }
    }
    return true;
};


const transposeGrid = (grid) => {
    return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
}


const findSmudgesForLine = (grid, x) => {
    // find all smudges for a given (vertical) symmetry line
    // smudge is a point where the value is not reflected
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    // check vertical lines of symmetries
    const maxPatternWidth = Math.min(x, gridWidth-x);

    const smudges = [];

    // check how many diffs are there for a given line
    for (let width = 1; width <= maxPatternWidth; width++) {
        for (let y = 0; y < gridHeight; y++) {
            if (grid[y][x-width] !== grid[y][x+width-1]) {
                smudges.push({sx:x-width, sy:y});
            }
        }
    }

    return smudges;
};

const getPatternValueSmudge = (grid) => {
    // get value for a pattern given the rules in part 2
    // check grid for any reflection lines that have exactly one smudge

    for (let x = 1; x < grid[0].length; x++) {
        if(findSmudgesForLine(grid, x)?.length==1) return x
    }

    // check horizontal lines of symmetries
    let gridT = transposeGrid(grid);
    for (let x = 1; x < gridT[0].length; x++) {
        if(findSmudgesForLine(gridT, x)?.length==1) return 100*x
    }

    
    // all grids should have at least one smudge
    throw new Error("No smudges found");
}


const getPatternValue = (grid) => {
    // get value for a pattern given the rules in part 1
    // check vertical lines of symmetries
    for (let x = 1; x < grid[0].length; x++) {
        if (isSymmetryLine(grid, x)) return x;
    }

    // check horizontal lines of symmetries
    const  gridT = transposeGrid(grid);

    for (let x = 1; x < gridT[0].length; x++) {
        if (isSymmetryLine(gridT, x)) return x*100;
    }

    // all grids should have at least one symmetry
    throw new Error("No symmetries found");
}

const sum1 = grids.reduce((sum, grid) => sum + getPatternValue(grid), 0);

console.log("Part 1 Answer:", sum1);

const sum2 = grids.reduce((sum, grid) => sum + getPatternValueSmudge(grid), 0);

console.log("Part 2 Answer:", sum2);
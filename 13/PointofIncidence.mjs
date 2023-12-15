import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const grids = input.split("\n\n")
.map(chunk => chunk.split("\n")
    .filter(line => line.length > 0)
    .map(line => line.split("")));


const calcPatternSum = (grid) => {
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
    let sum=0;

    // check vertical lines of symmetries
    for (let x = 1; x < gridWidth; x++) {
        const maxPatternWidth = Math.min(x, gridWidth-x);

        let isSymmetric = true;

        for (let width = 1; width <= maxPatternWidth; width++) {
            for (let y = 0; y < gridHeight; y++) {
                if (grid[y][x-width] !== grid[y][x+width-1]) {
                    isSymmetric = false;
                    break;
                }
            }
            if (!isSymmetric) break;
        }

        if (isSymmetric) sum += x;

    }

    // check horizontal lines of symmetries
    for (let y = 1; y < gridHeight; y++) {
        const maxPatternHeight = Math.min(y, gridHeight-y);

        let isSymmetric = true;

        for (let height = 1; height <= maxPatternHeight; height++) {
            for (let x = 0; x < gridWidth; x++) {
                if (grid[y-height][x] !== grid[y+height-1][x]) {
                    isSymmetric = false;
                    break;
                }
            }
            if (!isSymmetric) break;
        }

        if (isSymmetric) sum += 100*y;
    }

    return sum;
}

const sum1 = grids.reduce((sum, grid) => sum + calcPatternSum(grid), 0);


console.log("Part 1 Answer:", sum1);
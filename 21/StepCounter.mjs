import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");
const parseInput = (input) => {
    const gardenMap = input.split("\n")
        .filter(l => l.length>0)
        .map(e => e.split(""));
    return gardenMap;
}

const gardenMap = parseInput(input);

// find starting position
const findStart = (gardenMap) => {
    for(let y=0; y<gardenMap.length; y++){
        for(let x=0; x<gardenMap[y].length; x++){
            if(gardenMap[y][x] == "S"){
                return [x,y];
            }
        }
    }
}

const getInfiniteMap = (gardenMap) => {
    const width = gardenMap[0].length;
    const height = gardenMap.length;

    const infiniteMap = (x,y) => {
        x = x % width;
        y = y % height;

        if(x<0) x += width;
        if(y<0) y += height;

        return gardenMap[y][x] == "#"; // true if its a rock
    }

    return infiniteMap; // function
}
    

const updateSteps = (elfPositions, infMap) => {
    let newPositions = [];
    for(let i=0; i<elfPositions.length; i++){
        const elfPosition = elfPositions[i];
        const [x,y] = elfPosition;
        const possibleSteps = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
        const validSteps = possibleSteps.filter(([x,y]) => {
            return !infMap(x,y); // filter out rocks
        });
        newPositions = newPositions.concat(validSteps);
    };

    // remove duplicates positions
    newPositions = newPositions.filter((v,i,a) => a.findIndex(t => (t[0] === v[0] && t[1] === v[1])) === i);
    return newPositions;
}
const infGardenMap = getInfiniteMap(gardenMap); // need infinite map for part 2
let elfPositions = [findStart(gardenMap)];

for(let i=0; i<64; i++){
    elfPositions = updateSteps(elfPositions, infGardenMap);
}

const numPositions = elfPositions.length;

console.log(`Answer Part 1: ${numPositions}`);


import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const parseInput = (input) => {
    return input.split("\n")
    .filter(line => line.length > 0)
    .map(line => line.split("").map(n => parseInt(n)));
}

const cityMap = parseInput(input);

const getPossibleMoves = (crucible, minConsecutive=1, maxConsecutive=3) => {
    const possibleMoves = [];

    const mustTurn = crucible.numSameDir >= maxConsecutive;

    // must move minConsecutive times in same direction
    // if no lastDir (first tile), we can move freely
    const mustContinue = (crucible.numSameDir < minConsecutive) && crucible.lastDir !== null;

    if (!(mustTurn && crucible.lastDir == "left") //can't move more than 3 times in same direction
        && !(mustContinue && crucible.lastDir != "left") // must continue but in other direction than left
        && !(crucible.lastDir == "right") // can't reverse
        && crucible.x > 0) { // can go left
        possibleMoves.push({x: crucible.x - 1, y: crucible.y,
            lastDir: "left",
            numSameDir: crucible.lastDir === "left" ? crucible.numSameDir + 1 : 1,
            totalCost: crucible.totalCost + cityMap[crucible.y][crucible.x - 1]});
    }
    if (!(mustTurn && crucible.lastDir == "right") &&
        !(mustContinue && crucible.lastDir != "right") &&
        !(crucible.lastDir == "left") &&
        crucible.x < cityMap[crucible.y].length - 1) { // can go right
        possibleMoves.push({x: crucible.x + 1, y: crucible.y,
            lastDir: "right",
            numSameDir: crucible.lastDir === "right" ? crucible.numSameDir + 1 : 1,
            totalCost: crucible.totalCost + cityMap[crucible.y][crucible.x + 1]});
    }
    if (!(mustTurn && crucible.lastDir == "up") &&
        !(mustContinue && crucible.lastDir != "up") &&
        !(crucible.lastDir == "down") &&
        crucible.y > 0) { // can go up
        possibleMoves.push({x: crucible.x, y: crucible.y - 1,
            lastDir: "up", numSameDir: crucible.lastDir === "up" ? crucible.numSameDir + 1 : 1,
            totalCost: crucible.totalCost + cityMap[crucible.y - 1][crucible.x]});
    }
    if (!(mustTurn && crucible.lastDir == "down") &&
        !(mustContinue && crucible.lastDir != "down") &&
        !(crucible.lastDir == "up") &&
        crucible.y < cityMap.length - 1) { // can go down
        possibleMoves.push({x: crucible.x, y: crucible.y + 1,
            lastDir: "down", numSameDir: crucible.lastDir === "down" ? crucible.numSameDir + 1 : 1,
            totalCost: crucible.totalCost + cityMap[crucible.y + 1][crucible.x]});
    }
    return possibleMoves;
}


const findBestCost = (minConsecutive, maxConsecutive) => {

    const initCrucible = {
        x:0, y:0,
        lastDir: null,
        numSameDir: 0,
    }

    // save move costs
    const cityMapBestCost = new Map();
    cityMapBestCost.set(JSON.stringify(initCrucible), 0);

    let currentCrucibles = new Set();
    currentCrucibles.add(JSON.stringify(initCrucible));
    let visitedCrucibles = new Set();

    let bestCost = Number.MAX_SAFE_INTEGER;

    do{
        const newCrucibles = new Set();
        for(let crucible of currentCrucibles){
            const crucibleObject = JSON.parse(crucible);
            crucibleObject.totalCost = cityMapBestCost.get(crucible);
            const nextMoves = getPossibleMoves(crucibleObject, minConsecutive, maxConsecutive);
            nextMoves.forEach( move =>{
                const moveWithoutCost = {x: move.x, y: move.y, lastDir: move.lastDir, numSameDir: move.numSameDir};
                // key includes latest direction, and num successive moves in same direction,
                // since this restricts future moves, but not total cost
                const moveKey = JSON.stringify(moveWithoutCost);
                if (!visitedCrucibles.has(moveKey)) {
                    visitedCrucibles.add(moveKey);
                }

                // check if we are at lower right, and if cost is better than best
                if (move.x === cityMap[0].length - 1 && move.y === cityMap.length - 1) {
                    if (move.totalCost < bestCost) {
                        bestCost = move.totalCost;
                    }
                    return;
                } else if (move.totalCost >= bestCost) {
                    // cost is already worse than best, don't continue
                    return;
                }

                if(cityMapBestCost.has(moveKey)){
                    const bestCost = cityMapBestCost.get(moveKey);
                    if (move.totalCost >= bestCost) {
                        // another move with same key was better
                        return;
                    } else {
                        // better than saved move, overwrite
                        cityMapBestCost.set(moveKey, move.totalCost);
                        newCrucibles.add(moveKey);
                    }
                } else{
                    // new move
                    cityMapBestCost.set(moveKey, move.totalCost);
                    newCrucibles.add(moveKey);
                }
            });
        }
        currentCrucibles = newCrucibles;
        console.log("Number of currentCrucibles to check in next iteration:", currentCrucibles.size);
    } while(currentCrucibles.size > 0);

    return bestCost;
}

// Part 1
const cost1 = findBestCost(1, 3);
console.log(`Part 1: ${cost1}`);

// Part 2
const cost2 = findBestCost(4, 10);
console.log(`Part 2: ${cost2}`);
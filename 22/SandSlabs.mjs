import { error } from "console";
import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const parseInput = (input) => {
    const bricks = input.split("\n")
        .filter(l => l.length>0)
        .map(row => {
            let [start, end] = row.split("~");
            start = start.split(",").map(e => parseInt(e));
            end = end.split(",").map(e => parseInt(e));
            const cubes = [];
            for(let x=start[0]; x<=end[0]; x++){
                for(let y=start[1]; y<=end[1]; y++){
                    for(let z=start[2]; z<=end[2]; z++){
                        cubes.push([x,y,z]);
                    }
                }
            }
            return {
                start,
                end,
                cubes
            }
        });

    const xMax = Math.max(...bricks.map(b => Math.max(b.end[0], b.start[0])));
    const yMax = Math.max(...bricks.map(b => Math.max(b.end[1], b.start[1])));
    const zMax = Math.max(...bricks.map(b => Math.max(b.end[2], b.start[2])));

    const hasBrick = [];

    for(let x=0; x<=xMax; x++){
        hasBrick[x] = [];
        for(let y=0; y<=yMax; y++){
            hasBrick[x][y] = [];
            for(let z=0; z<=zMax; z++){
                hasBrick[x][y][z] = false;
            }
        }
    }

    for(let brick of bricks){
        const {cubes} = brick;
        for(let cube of cubes){
            const [x,y,z] = cube;
            hasBrick[x][y][z] = true;
        }
    }

    return [bricks, hasBrick];
}

let [bricks, hasBrick] = parseInput(input);

const iterateBricks = (bricks, hasBrick) => {
    // returns false if no brick moved
    // modifies bricks and hasBrick in place
    let movedBricks = [];
    for(let i=0; i<bricks.length; i++){
        const {cubes} = bricks[i];

        // try to move down
        let canMoveDown = true;
        let newCubes = [];
        for(let cube of cubes){
            const [x,y,z] = cube;
            const below = [x,y,z-1];
            const otherCubes = cubes.filter(c => c[0]!==x || c[1]!==y || c[2]!==z);

            if(z>1 && // can fall if z>1
                // below is empty, or below is same brick
                (!hasBrick[x][y][z-1] || otherCubes.some(c => c[0]===x && c[1]===y && c[2]===z-1))
                ){
                newCubes.push(below);
            } else {
                canMoveDown = false;
                break;
            }
        }

        if(canMoveDown){
            movedBricks.push(i);
            // if we can move down, update brick
            bricks[i].cubes = newCubes;
            bricks[i].start[2] -= 1;
            bricks[i].end[2] -= 1;

            // also update hasBrick
            for(let cube of cubes){
                const [x,y,z] = cube;
                hasBrick[x][y][z] = false;
            }
            for(let cube of newCubes){
                const [x,y,z] = cube;
                hasBrick[x][y][z] = true;
            }
        }
    }

    return movedBricks;
}


const simulateToStable = (bricks, hasBrick) => {
    bricks = JSON.parse(JSON.stringify(bricks));
    hasBrick = JSON.parse(JSON.stringify(hasBrick));
    let movedBricks = [];
    do{
        movedBricks = iterateBricks(bricks, hasBrick);
    } while(movedBricks.length>0);

    return [bricks, hasBrick];
}

[bricks, hasBrick] = simulateToStable(bricks, hasBrick);


// print bricks after stable
// for(let brick of bricks){
//     console.log(brick.start, brick.end);
// }

const removeAndCountMoving = (i, bricks, hasBrick) => {
    bricks = JSON.parse(JSON.stringify(bricks));
    hasBrick = JSON.parse(JSON.stringify(hasBrick));

    // remove brick i
    const deleted = bricks.splice(i,1);

    // update hasBrick
    for(let cube of deleted[0].cubes){
        const [x,y,z] = cube;
        hasBrick[x][y][z] = false;
    }

    // simulate to stable
    let allMovedBricks = new Set(); // store bricks that moved
    let movedBricks = []; // bricks moved in current iteration
    do{
        movedBricks = iterateBricks(bricks, hasBrick);
        for(let m of movedBricks){
            allMovedBricks.add(m); // m is index of brick
        }
    } while(movedBricks.length>0);

    return allMovedBricks.size;

}

let numMovedIfRemoved = [];
for(let i=0; i<bricks.length; i++){
    numMovedIfRemoved.push(removeAndCountMoving(i, bricks, hasBrick));
}

// Part 1:
console.log("Part 1: ", numMovedIfRemoved.filter(n => n==0).length);

// Part 2:
console.log("Part 2: ", numMovedIfRemoved.reduce((a,b) => a+b, 0));
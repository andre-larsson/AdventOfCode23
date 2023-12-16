import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

let initBeam = {
    x: 0,
    y: 0,
    direction: 'R'
};

const initCaveGrid = input.split("\n")
    .filter(line => line.length > 0)
    .map(line => line.split("").map( t => {return { tile: t, beams: [] }}));

// functions for updating the beam
// should always return an array of beams

const simpleContinue = (beam) => {
    let newBeam = {
        x: beam.x,
        y: beam.y,
        direction: beam.direction
    };
    switch (beam.direction) {
        case 'R':
            newBeam.x++;
            break;
        case 'L':
            newBeam.x--;
            break;
        case 'U':
            newBeam.y--;
            break;
        case 'D':
            newBeam.y++;
            break;
    }
    return [newBeam];
};

const horizontalSplitter = (beam) => {
    // '-' tile
    if (beam.direction === 'L' || beam.direction === 'R') {
        return simpleContinue(beam);
    } else{
        return [{
            x: beam.x-1,
            y: beam.y,
            direction: 'L'
        }, {
            x: beam.x+1,
            y: beam.y,
            direction: 'R'
        }];
    }
}

const verticalSplitter = (beam) => {
    // '|' tile
    if (beam.direction === 'U' || beam.direction === 'D') {
        return simpleContinue(beam);
    } else{
        return [{
            x: beam.x,
            y: beam.y-1,
            direction: 'U'
        }, {
            x: beam.x,
            y: beam.y+1,
            direction: 'D'
        }];
    }
}

const slashMirror = (beam) => {
    // '/' tile
    switch(beam.direction) {
        case 'U': // this is the direction the current beam is moving
            return [{
                x: beam.x+1,
                y: beam.y,
                direction: 'R'
            }];
        case 'D':
            return [{
                x: beam.x-1,
                y: beam.y,
                direction: 'L'
            }];
        case 'L':
            return [{
                x: beam.x,
                y: beam.y+1,
                direction: 'D'
            }];
        case 'R':
            return [{
                x: beam.x,
                y: beam.y-1,
                direction: 'U'
            }];
    }
}

const backslashMirror = (beam) => {
    // '\' tile
    switch(beam.direction) {
        case 'U':
            return [{
                x: beam.x-1,
                y: beam.y,
                direction: 'L'
            }];
        case 'D':
            return [{
                x: beam.x+1,
                y: beam.y,
                direction: 'R'
            }];
        case 'L': // current beam moves leftward
            return [{
                x: beam.x,
                y: beam.y-1,
                direction: 'U'
            }];
        case 'R':
            return [{
                x: beam.x,
                y: beam.y+1,
                direction: 'D'
            }];
    }

}

const updateBeam = (beam, caveGrid) => {

    switch (caveGrid[beam.y][beam.x].tile) {
        case '.':
            return simpleContinue(beam);
        case '|':
            return verticalSplitter(beam);
        case '-':
            return horizontalSplitter(beam);
        case '/':
            return slashMirror(beam);
        case '\\':
            return backslashMirror(beam);
        default:
            throw new Error("Unknown tile type");
    }

}


const findNumEnergized = (grid, initBeam) => {
    let activeBeams = [initBeam];

    // deep copy the grid
    let caveGrid = JSON.parse(JSON.stringify(initCaveGrid));
    do{
        // add visited beams to tile
        activeBeams.forEach(element => {
            caveGrid[element.y][element.x].beams.push(element.direction);
        });

        let newBeams = [];
        for (let beam of activeBeams) {
            newBeams.push(...updateBeam(beam, caveGrid));
        }

        // remove beams that are out of bounds
        newBeams = newBeams.filter(beam => {
            if (beam.x < 0 || beam.y < 0) return false;
            if (beam.x >= caveGrid[0].length || beam.y >= caveGrid.length) return false;
            return true;
        });

        // remove beams that are already present in a tile (to avoid infinite loops)
        newBeams = newBeams.filter(beam => {
            if (caveGrid[beam.y][beam.x].beams.includes(beam.direction)) return false;
            return true;
        });

        // print energized tiles
        // caveGrid.forEach(row => {
        //     console.log(row.map(tile => tile.beams.length>0 ? '#' : ".").join(""));
        // });
        // console.log(activeBeams, " -> " ,newBeams);

        activeBeams = newBeams;


    } while (activeBeams.length > 0);

    // count energized tiles
    const energizedTiles = caveGrid.flat().filter(tile => tile.beams.length>0).length;
    return energizedTiles;
}

// Part 1
console.log("Part 1 Answer:", findNumEnergized(initCaveGrid, initBeam));

// Part 2

const createInitBeam = (x,y, d) => {
    return {x: x, y: y, direction: d}
} 

let mostEnergy = 0;

// loop top/bottom rows
for(let x = 0; x < initCaveGrid[0].length; x++) {
    // topmost row, down
    const topInit = createInitBeam(x,0,'D');
    mostEnergy = Math.max(mostEnergy, findNumEnergized(initCaveGrid, topInit));

    // bottommost row, up
    const bottomInit = createInitBeam(x,initCaveGrid.length-1,'U');
    mostEnergy = Math.max(mostEnergy, findNumEnergized(initCaveGrid, bottomInit));
}

// loop left/right columns
// corners will be done twice, as intended (moving in different directions)
for(let y = 0; y < initCaveGrid.length; y++) {
    // leftmost column, right
    const leftInit = createInitBeam(0,y,'R');
    mostEnergy = Math.max(mostEnergy, findNumEnergized(initCaveGrid, leftInit));

    // rightmost column, left
    const rightInit = createInitBeam(initCaveGrid[0].length-1,y,'L');
    mostEnergy = Math.max(mostEnergy, findNumEnergized(initCaveGrid, rightInit));
}

console.log("Part 2 Answer:", mostEnergy);
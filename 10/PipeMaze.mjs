import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");
const mapTiles = input.split("\n").map((line) => line.split(""));

class Pipe {
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
        this.neighbors = [];
    }

    addNeighbor(neighbors) {
        this.neighbors.push(neighbors);
    }

    findNeighborPos() {
        switch(this.dir) {
            case "|":
                return [
                    {x: this.pos.x, y: this.pos.y - 1},
                    {x: this.pos.x, y: this.pos.y + 1}
                ];
            case "-":
                return [
                    {x: this.pos.x - 1, y: this.pos.y},
                    {x: this.pos.x + 1, y: this.pos.y}
                ];
            case "L":
                return [
                    {x: this.pos.x, y: this.pos.y - 1},
                    {x: this.pos.x + 1, y: this.pos.y}
                ];
            case "J":
                return [
                    {x: this.pos.x, y: this.pos.y - 1},
                    {x: this.pos.x - 1, y: this.pos.y}
                ];
            case "7":
                return [
                    {x: this.pos.x, y: this.pos.y + 1},
                    {x: this.pos.x - 1, y: this.pos.y}
                ];
            case "F":
                return [
                    {x: this.pos.x, y: this.pos.y + 1},
                    {x: this.pos.x + 1, y: this.pos.y}
                ];
            case "S":
                // we cannot tell the neighbors of the start tile, without knowing the surrounding tiles
                // fill in these in PipeMap
                return [];
            case ".":
                return [];
            default:
                throw new Error("Unknown pipe type: " + this.dir);
    }
    }
}

class PipeMap {
    constructor(tilesChars) {
        // tilesChars is a 2d array of pipe characters
        this.tiles = tilesChars.filter((row) => row.length > 0)
            .map((row, i) => row.map((tile, j) => new Pipe({x: j, y: i}, tile)));

        this.pipeLoop = null;
        // find and add the neighbors for each tile
        for(let i = 0; i < this.tiles.length; i++) {
            for(let j = 0; j < this.tiles[i].length; j++) {
                const neighbors = this.tiles[i][j].findNeighborPos();
                for(let neighbor of neighbors) {
                    if(neighbor.x >= 0 && neighbor.x < this.tiles[i].length &&
                        neighbor.y >= 0 && neighbor.y < this.tiles.length) {
                        this.tiles[i][j].addNeighbor(this.tiles[neighbor.y][neighbor.x]);
                    }
                }
            }
        }

        // find start tile
        let startTile = this._findStartTile();

        // find neighbors for start position
        for(let vDiff of [-1, 1]) {
            if(startTile.pos.y + vDiff < 0 || startTile.pos.y + vDiff >= this.tiles.length)
                continue;

            const neighbor = this.tiles[startTile.pos.y + vDiff][startTile.pos.x];
            if(neighbor.neighbors.includes(startTile)){
                startTile.addNeighbor(neighbor);
                neighbor.addNeighbor(startTile);
            }
        }

        for(let hDiff of [-1, 1]) {
            if(startTile.pos.x + hDiff < 0 || startTile.pos.x + hDiff >= this.tiles[startTile.pos.y].length)
                continue;

            const neighbor = this.tiles[startTile.pos.y][startTile.pos.x + hDiff];
            if(neighbor.neighbors.includes(startTile)){
                startTile.addNeighbor(neighbor);
                neighbor.addNeighbor(startTile);
            }
        }

        this.startTile = startTile;

        if(this.startTile.neighbors.length !== 2)
            throw new Error("Start tile should have two neighbors but found: " + this.startTile.neighbors.length);

    }

    _findStartTile() {
        for(let i = 0; i < this.tiles.length; i++) {
            for(let j = 0; j < this.tiles[i].length; j++) {
                if(this.tiles[i][j].dir === "S") {
                    return this.tiles[i][j];
                }
            }
        }
        throw new Error("No start position found");
    }

    findPipeLoop() {
        let pipePath = [];
        let previousTile = null;
        let nextTile = null;
        let currentTile = this.startTile; // start
        let i = 0; // for debugging
        do{
            nextTile = currentTile.neighbors.find((neighbor) => neighbor !== previousTile);
            previousTile = currentTile;
            currentTile = nextTile;
            i++;
            pipePath.push(currentTile);
            currentTile.inMainLoop = true;
        } while(currentTile.dir !== "S" && i < 100000000);

        // save the loop
        this.pipeLoop = pipePath;

        return pipePath;
    }
}

const findPointsInsideLoop = (pipeMap) => {
    // Finds all points that are inside the main loop of the pipeMap
    //
    // In this task, we imagine filling the maze of pipes with water from the outside.
    // The water would move through empty tiles and ignore tiles with pipes not connected
    // to the main loop, but the main loop would form a barrier that the water could not
    // pass through.
    // However, water can squeeze through adjacent pipes that are not connected.
    //
    // We need to find all tiles inside the main loop (tiles not filled with water).
    //
    // To find these tiles, we build a map of the corners of the tiles.
    // Water in a corner will flow to all neighboring corners, but will be blocked iff both
    // tiles that are adjacent to the path to the next corner are part of the main loop,
    // and are connected.
    //
    // Note there will be one more corner than the number of tiles in a row/column
    //
    // Water in an outside corner can move to a new corner if any of the following is true
    // for the path:
    // * at least one of the tiles adjacent to the wall is not part of the loop
    // * the adjacent tiles are part of the main loop but not connected
    //
    // When we have this map, we find the set of tiles that
    // * does not have any outside corners touching it (this would fill it with water)
    // * are not part of the main loop
    //
    // We can start in any corner on the border: we start in the top left corner

    if(pipeMap.pipeLoop === null)
        throw new Error("Pipe loop not calculated for pipe map");

    let outsideCorners = new Set();
    let cornersToVisit = new Set(["0,0"]); // top left corner

    const mapWidth = pipeMap.tiles[0].length;
    const mapHeight = pipeMap.tiles.length;

    do{
        for(const corner of cornersToVisit.values()) {
            cornersToVisit.delete(corner);
            const [cX, cY] = corner.split(",").map((c) => parseInt(c));

            outsideCorners.add(corner);

            if(cX>0) {
                // left
                const newCorner = [cX-1, cY].join(",");
                if(cY==0 || cY==mapHeight) {
                    // top or bottom row, can always move through
                    if(!outsideCorners.has(newCorner)) cornersToVisit.add(newCorner);
                } else{
                    // check if we can move through
                    const tileAboveWall = pipeMap.tiles[cY-1][cX-1];
                    const tileBelowWall = pipeMap.tiles[cY][cX-1];
                    
                    if(!tileAboveWall.inMainLoop || !tileBelowWall.inMainLoop ||
                        !tileAboveWall.neighbors.includes(tileBelowWall)) {
                        // can move through
                        if(!outsideCorners.has(newCorner)) cornersToVisit.add(newCorner);
                    }
                }
            }

            if(cX<mapWidth) {
                // right
                const newCorner = [cX+1, cY].join(",");
                if(cY==0 || cY==mapHeight) {
                    // top or bottom row, can always move through
                    if(!outsideCorners.has(newCorner)) cornersToVisit.add(newCorner);
                } else{
                    // check if we can move through
                    const tileAboveWall = pipeMap.tiles[cY-1][cX];
                    const tileBelowWall = pipeMap.tiles[cY][cX];
                    if(!tileAboveWall.inMainLoop || !tileBelowWall.inMainLoop ||
                        !tileAboveWall.neighbors.includes(tileBelowWall)) {
                        // can move through
                        if(!outsideCorners.has(newCorner)) cornersToVisit.add(newCorner);
                    }
                }
            }

            if(cY>0) {
                // top
                const newCorner = [cX, cY-1].join(",");
                if(cX==0 || cX==mapWidth) {
                    // left or right column, can always move through
                    if(!outsideCorners.has(newCorner)) cornersToVisit.add(newCorner);
                } else{
                    // check if we can move through
                    const tileLeftWall = pipeMap.tiles[cY-1][cX-1];
                    const tileRightWall = pipeMap.tiles[cY-1][cX];
                    if(!tileLeftWall.inMainLoop || !tileRightWall.inMainLoop ||
                        !tileLeftWall.neighbors.includes(tileRightWall)) {
                        // can move through
                        if(!outsideCorners.has(newCorner)) cornersToVisit.add(newCorner);
                    }
                }
            }

            if(cY<mapHeight) {
                // bottom
                const newCorner = [cX, cY+1].join(",");
                if(cX==0 || cX==mapWidth) {
                    // left or right column, can always move through
                    if(!outsideCorners.has(newCorner)) cornersToVisit.add(newCorner);
                } else{
                    // check if we can move through
                    const tileLeftWall = pipeMap.tiles[cY][cX-1];
                    const tileRightWall = pipeMap.tiles[cY][cX];
                    if(!tileLeftWall.inMainLoop || !tileRightWall.inMainLoop ||
                        !tileLeftWall.neighbors.includes(tileRightWall)) {
                        // can move through
                        if(!outsideCorners.has(newCorner)) cornersToVisit.add(newCorner);
                    }
                }
            }
        }
    } while(cornersToVisit.size > 0);

    // find the set of tiles that does not have any outside corner
    const hasNoOutsideCorner = (tile) => {
        const {x, y} = tile.pos;
        const corners = [
            [x, y].join(","),
            [x+1, y].join(","),
            [x, y+1].join(","),
            [x+1, y+1].join(",")
        ];
        for(const corner of corners) {
            // if is has outside corner, return false
            if(outsideCorners.has(corner))
                return false;
        }
        return true;
    }

    let tilesArray = pipeMap.tiles.flat();
    let tilesWithNoOutsideCorner = tilesArray.filter(tile => !tile.inMainLoop).filter(hasNoOutsideCorner);
    return tilesWithNoOutsideCorner.length;
}

const pipeMap = new PipeMap(mapTiles);
const pipeLoop = pipeMap.findPipeLoop();
const answer1 = Math.ceil(pipeLoop.length/2)
console.log("Part 1 Answer:", answer1);

const answer2 = findPointsInsideLoop(pipeMap);
console.log("Part 2 Answer:", answer2);
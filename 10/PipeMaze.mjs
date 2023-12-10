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
                // we cannot tell the neighbors of the start tile,
                // without knowing the surrounding tiles
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
        this.tiles = tiles.map((row, i) => row.map((tile, j) => new Pipe({x: j, y: i}, tile)));

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
        } while(currentTile.dir !== "S" && i < 100000000);

        return pipePath;
    }
}

const pipeMap = new PipeMap(mapTiles);
const pipeLoop = pipeMap.findPipeLoop();
console.log("Part 1 Answer:", Math.ceil(pipeLoop.length/2));
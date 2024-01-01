import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const parseInput = (input) => {
    const map = input.split("\n")
        .filter(l => l.length>0)
        .map(row => row.split(""));
    return map;
}

const map = parseInput(input);

const getPossibleMoves = (map, path) => {
    const [x,y] = path[path.length-1];
    const moves = [];
    if(x>0 && (map[y][x-1]=="." || map[y][x-1]=="<")){
        moves.push([x-1, y]);
    }
    if(x<map[0].length-1 && (map[y][x+1]=="." || map[y][x+1]==">")){
        moves.push([x+1, y]);
    }
    if(y>0 && (map[y-1][x]=="." || map[y-1][x]=="^")){
        moves.push([x, y-1]);
    }
    if(y<map.length-1 && (map[y+1][x]=="." || map[y+1][x]=="v")){
        moves.push([x, y+1]);
    }
    return moves;
}

const getPossibleMoves2 = (map, path) => {
    const [x,y] = path[path.length-1];
    const moves = [];
    if(x>0 && (map[y][x-1]!="#")){
        moves.push([x-1, y]);
    }
    if(x<map[0].length-1 && (map[y][x+1]!="#")){
        moves.push([x+1, y]);
    }
    if(y>0 && (map[y-1][x]!="#")){
        moves.push([x, y-1]);
    }
    if(y<map.length-1 && (map[y+1][x]!="#")){
        moves.push([x, y+1]);
    }
    return moves;
}

const getMaxDistance = (map, part2=false) => {
    const initPath = [[map[0].indexOf("."), 0]];
    const endPos = [map[map.length-1].indexOf("."), map.length-1];
    let maxDistance = 0;
    const pathQueue = [initPath];
    while(pathQueue.length>0){
        const path = pathQueue.shift();

        let moves = [];
        if(part2) moves = getPossibleMoves2(map, path);
        else moves = getPossibleMoves2(map, path);
        for(let move of moves){
            if(!path.some(p => p[0]==move[0] && p[1]==move[1])){
                pathQueue.push([...path, move]);
            }

            if(move[0]==endPos[0] && move[1]==endPos[1]){
                maxDistance = path.length > maxDistance ? path.length : maxDistance;
            }

        }
    }
    return maxDistance;
}


console.log("Answer part 1:", getMaxDistance(map));

// part 2, solution too slow
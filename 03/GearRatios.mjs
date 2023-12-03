import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");
console.log(input);

const lineArray = input.split("\n")
const lineWidth = lineArray[0].length


let sum1=0;

// x width, y height
for(let y=0; y<lineArray.length; y++){
    const line = lineArray[y];
    const matches = line.matchAll(/(\d+)/g);

    for(const match of matches){
	const xStart = match.index;
	const xEnd = match.index + match[1].length-1

	// check for symbols in a rectangle around the match
	const leftmost = Math.max(xStart-1, 0);
	const rightmost = Math.min(xEnd+1, lineWidth-1)
	const uppermost = Math.max(y-1, 0);
	const lowermost = Math.min(y+1, lineArray.length-1)

	let hasAdjacentSymbol = false;

	searchLoop1:
	for(let yy=uppermost; yy<=lowermost; yy++){
	    for(let xx=leftmost; xx<=rightmost; xx++){
		if(yy==y && xx>=xStart && xx<=xEnd){
		    continue;
		} else{
		    if(lineArray[yy].charAt(xx).match(/[^\d\.]/) !== null){
			hasAdjacentSymbol = true;
			break searchLoop1;
		    }
		}
	    }
	}

	if (hasAdjacentSymbol) sum1+= Number(match[1]);	
    }
}

console.log("Sum1: ", sum1);



let sum2=0;

// x width, y height
for(let y=0; y<lineArray.length; y++){
    const line = lineArray[y];
    const matches = line.matchAll(/\*/g);

    for(const match of matches){
	// TODO
    }
}

console.log("Sum2: ", sum2);


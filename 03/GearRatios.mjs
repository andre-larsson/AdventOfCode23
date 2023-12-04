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
    const starMatches = line.matchAll(/\*/g);

    for(const sm of starMatches){
	// find adjacent number to the left (if any)
	let adjacentNum = [];
	
	if(sm.index>0){
	    const leftNum = line.slice(0, sm.index).match(/(\d+)$/)
	    if(leftNum) adjacentNum.push(leftNum[1]);
	}

	// find adjacent number to the right
	if(sm.index<lineWidth-1){
	    const rightNum = line.slice(sm.index+1, -1).match(/^(\d+)/);
	    if(rightNum) adjacentNum.push(rightNum[1]);
	}

	// find adjacent above
	if(y>0){
	    let numbersAbove = [...lineArray[y-1].matchAll(/(\d+)/g)]
		.filter((numMatch) => {
		    const startI = (numMatch.index-1);
		    const endI = (numMatch.index + numMatch[1].length);
		    return ( sm.index >= startI && sm.index <=endI);
		})
		.forEach((m) =>{
		    adjacentNum.push(m[1])
		});
	}

	// find adjacent below
	if(y<lineArray.length-1){
	    let numbersBelow = [...lineArray[y+1].matchAll(/(\d+)/g)]
		.filter((numMatch) => {
		    const startI = (numMatch.index-1);
		    const endI = (numMatch.index + numMatch[1].length);
		    return ( sm.index >= startI && sm.index <=endI);
		})
		.forEach((m) =>{
		    adjacentNum.push(m[1])
		});
	}

	if(adjacentNum.length == 2) sum2 += Number(adjacentNum[0])*Number(adjacentNum[1]);
    }
}

console.log("Sum2: ", sum2);

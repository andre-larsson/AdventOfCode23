import { readInput } from "../shared/util.mjs"


const input = await readInput("input.data");

// Part 1 and 2
const findNumElfWins = (row) => {
    const [wNumStr, eNumStr] = row.replace(/Card.+\d+:/,"").split("|");
    let wNums = wNumStr.match(/(\d+)/g) || [];
    let eNums = eNumStr.match(/(\d+)/g) || [];
    
    // remove duplicates (needed?)
    // wNums = Array.from(new Set(wNums));
    // eNums = Array.from(new Set(eNums));
    
    return (eNums.filter((e) => wNums.includes(e))).length;
}

// Part 1
let pointsTable = {}; // cardNum: numPoints (for part 2)
const getPoints = (cardString) => {
    const result = cardString.split("\n")
	  .map((row, y) => {
	      if(row.length<1) return 0;
	      const numElfWins = findNumElfWins(row);
	      pointsTable[y+1] = numElfWins;
	      if(numElfWins==0) return 0;
	      else return 2**(numElfWins-1);
	  })
	  .reduce((acc, curr) => (acc + curr));
    
    return result;
}


// Part 2
let summedNumCardWins = {}; // for memoization
const sumNumCardWins = (cardNum) => {
    if(summedNumCardWins[cardNum] !== undefined) return summedNumCardWins[cardNum];
    const numWins = pointsTable[cardNum];
    if(numWins==0){
	 // no (additional) wins on this card, but we still get this card
	summedNumCardWins[cardNum] = 1;
	return 1;
    } else{
	let sum = 1;
	for(let iAdd=0; iAdd<numWins; iAdd++){
	    if(pointsTable[cardNum+iAdd+1] !== undefined)
		sum += sumNumCardWins(cardNum+iAdd+1);
	}
	
	summedNumCardWins[cardNum] = sum;
	return sum;
    }
}

// Part 2
const getNumCards = (cardString) => {
    if(Object.keys(pointsTable).length ==0){
	console.log("No stored card points! Run getPoints() to fill in the points table!");
    }

    // number of cards
    const nCards = (cardString.split("\n")).reduce((agg, row) =>{
	if(row.length>0) return agg + 1; // count rows with non-zero length
	else return agg;
    }, 0);

    let sum = 0;
    for(let i=0; i<nCards; i++){
	sum += sumNumCardWins(i+1);
    }
    return sum;
}

console.log("Part 1: ", getPoints(input));
console.log("Part 2: ", getNumCards(input));

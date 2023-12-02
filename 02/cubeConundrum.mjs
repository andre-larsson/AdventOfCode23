import { open } from 'node:fs/promises';


const sumGames = async () => {
    const file = await open('./input.data');

    const allNumbers = [];

    for await (const line of file.readLines()) {
	const result = checkPossibleGame(line);
	if(result) allNumbers.push(result);
    }

    const sum = allNumbers.reduce((a, b) => a + b, 0);
    return sum;
};

const sumPowers = async() =>{
    const file = await open('./input.data');

    const allNumbers = [];

    for await (const line of file.readLines()) {
	allNumbers.push(getCubePower(line));
    }

    const sum = allNumbers.reduce((a, b) => a + b, 0);
    return sum;
};



// return 0 if game is not possible, otherwise return game number
const checkPossibleGame = (line) => {
    const [gameStr, gameRecord] = line.split(":");
    const bags = gameRecord.split(";");

    //console.log("line:", line);
    
    for(let bag of bags){
	const cubes = bag.split(",");
	let result = {}
	for(let cube of cubes){
	    const num = parseInt(/(\d+)/.exec(cube)[1]);
	    if(cube.match("red")) result.red = num;
	    if(cube.match("green")) result.green = num;
	    if(cube.match("blue")) result.blue = num;
	}
	//console.log(result)

	if(result.red>12 || result.green>13 || result.blue>14) return 0;
    }

    const gameNum = /(?<=Game )(\d+)/.exec(gameStr)[1];

    //console.log("gameNum:", gameNum);

    return parseInt(gameNum);
};

// find min amount of cubes possible for game and multiply them
const getCubePower = (line) => {
    const [gameStr, gameRecord] = line.split(":");

    const bags = gameRecord.split(";");

    console.log("line:", line);

    let result = {
	red:0,
	green:0,
	blue:0
    };
    
    for(let bag of bags){
	const cubes = bag.split(",");	
	for(let cube of cubes){
	    const num = parseInt(/(\d+)/.exec(cube)[1]);
	    if(cube.match("red") && num>result.red) result.red = num;
	    if(cube.match("green") && num>result.green) result.green = num;
	    if(cube.match("blue") && num>result.blue) result.blue = num;
	}
    }

    console.log(result)

    const power=result.red*result.green*result.blue;

    console.log("power:", power);

    return power;
};


const sum1 = await sumGames();
console.log("Sum1: ", sum1);

const sum2 = await sumPowers();
console.log("Sum2: ", sum2);

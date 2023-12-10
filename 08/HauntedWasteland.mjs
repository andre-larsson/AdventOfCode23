import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const inputLines = input.split("\n");

const parseNode = (line) => {
    line = line.replace("= ", "").replace("(", "").replace(")", "").replace(",", "")
    const parts = line.split(" ");
    return {
        name: parts[0],
        leftName: parts[1],
        rightName: parts[2]
    }
};

// find the left right instructions
const leftRight = inputLines[0].split("");

// parse the nodes and their connections
const nodes = inputLines.slice(1).map(parseNode);
let GraphNodes = {};
nodes.forEach(node => {
    GraphNodes[node.name] = {
        name: node.name,
        left: node.leftName,
        right: node.rightName
    }
});


// Part 1

if(GraphNodes["AAA"] != undefined) {
    // only run if a AAA node is in the data
    let currentNode = "AAA"
    let lri = 0;
    let numSteps = 0;

    while (currentNode != "ZZZ") {
        const node = GraphNodes[currentNode];
        switch (leftRight[lri]) {
            case "L":
                currentNode = node.left;
                break;
            case "R":
                currentNode = node.right;
                break;
        }
        lri = (lri + 1) % leftRight.length;
        numSteps++;
    }

    console.log("Part 1: " + numSteps);
};

// Part 2

// find all nodes ending in A
let currentNodes = Object.values(GraphNodes)
    .filter(node => node.name.endsWith("A"))
    .map(node => node.name);

const findPeriodicity = (initNode, leftRight) => {
    let currentNode = initNode;
    let lastMatch = null;
    let patternBegins = null;
    let lri2 = 0;
    let numSteps2 = 0;
    do {
        const node = GraphNodes[currentNode];
        switch (leftRight[lri2]) {
            case "L":
                currentNode = node.left;
                break;
            case "R":
                currentNode = node.right;
                break;
        }
        lri2 = (lri2 + 1) % leftRight.length;
        numSteps2++;
        if(currentNode.endsWith("Z")) {
            if(patternBegins ===null) {
                patternBegins = numSteps2;
            } else{
                lastMatch = numSteps2;
            }
        }
    // continue until match is found, or we return to the initial node
    } while  (!(currentNode == initNode && lri2 == 0) && lastMatch === null);
    return {
        initNode: initNode,
        periodicity: lastMatch - patternBegins,
        firstMatch: patternBegins
    }
}

// if we run the periodicity finder for a longer time,
// we find that each starting point get stuck in a loop that
// returns to exactly one node ending in Z with some periodicity.
const periodicity = currentNodes.map(node => findPeriodicity(node, leftRight));


// For finding the least common multiple of a list of integers
// https://stackoverflow.com/a/34955386
const gcd2 = (a, b) => {
    // Greatest common divisor of 2 integers
    if(!b) return b===0 ? a : NaN;
    return gcd2(b, a%b);
}
const lcm2 = (a, b) => {
    // Least common multiple of 2 integers
    return a*b / gcd2(a, b);
}
const lcm = (array) => {
    // Least common multiple of a list of integers
    var n = 1;
    for(var i=0; i<array.length; ++i)
        n = lcm2(array[i], n);
    return n;
}

// Note that first match and periodicity are equal in each node:
// The repeating pattern starts with the same offset (0) for each node.
// We only have to find the least common multiple of the periodicities
// (this is where all Z's are first aligned)
periodicity.forEach(p => {
    console.log(p);
});

const commonPeriod = lcm(periodicity.map(p => p.periodicity));

console.log("Part 2 answer:", commonPeriod);
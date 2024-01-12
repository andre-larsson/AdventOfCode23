import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

// not finished

const parseInput = (input, excludeList=[]) => {
    let nodes = {};
    input.split("\n")
        .filter(line => line.length > 0)
        .forEach(element => {
            const [name, connected] = element.split(": ");
            if (excludeList.includes(name)) {
                return;
            }
            const connectedNodes = connected.split(" ").filter(node => !excludeList.includes(node));

            if(nodes[name] === undefined) nodes[name] = new Set();

            nodes[name].add(...connectedNodes);
            // console.log("name", name, connectedNodes);
            // Add the reverse connection
            for (const connectedNode of connectedNodes) {
                // console.log("connectedNode", connectedNode);
                nodes[connectedNode] = nodes[connectedNode] || new Set();
                nodes[connectedNode].add(name);
            }
        });
    return nodes;
}

const MaximumAdjacencySearch = (vertices, startNode) => {
    let foundSet = [startNode];
    let candidates= new Set(Object.keys(vertices));

    let cutWeight = [];

    candidates.delete(startNode);


    while (candidates.size > 0) {
        let maxNextVertex = null;
        let maxSum = 0;
        for (let next of candidates) {
            let nEdges = 0;
            for (let s of foundSet) {
                // console.log("s", s, "next", next, "vertices", vertices);
                const areConnected = vertices[next]?.has(s);
                if (areConnected) {
                    nEdges += 1; // weight of the edge
                }
            }

            if (nEdges > maxSum) {
                maxNextVertex = next;
                maxSum = nEdges;
            }
        }

        candidates.delete(maxNextVertex);
        foundSet.push(maxNextVertex);
        cutWeight.push(maxSum);
    }

    // we take the last two vertices in foundSet and their weight as a cut of the phase
    let n = foundSet.length;
    console.log("foundSet", foundSet, "cutWeight", cutWeight);
    return [
            // that's "s" in the literature and will remain as a merged vertex with "t"
            foundSet[n - 2], 
            // that's "t" and will be removed afterwards
            foundSet[n - 1], 
            // that's "w" to compute the minimum cut on later
            cutWeight[cutWeight.length - 1]
    ]

}

const MinimumCut = (vertices) => {
    let vCopy = {...vertices}

    let currentPartition = new Set();
    let currentBestPartition = null;
    let currentBestCut = null;

    while(vCopy && Object.keys(vCopy).length > 1) {
        let [s, t, w] = MaximumAdjacencySearch(vCopy, Object.keys(vCopy)[0]);

        if(currentBestCut === null || w < currentBestCut) {
            currentBestCut = w;
            currentBestPartition = new Set(currentPartition);
        }

        currentPartition.add(t);

        // merge s and t
        vCopy[s].delete(t);
        vCopy[t].delete(s);
        vCopy[s].add(...vCopy[t]);
        vCopy[t] = vCopy[s];

        // remove t from the graph
        delete vCopy[t];
    }

    return [currentBestPartition, currentBestCut];
}


const MinCutResult = (vertices, partition, bestCut) => {
    let graph1 = {};
    let graph2 = {};

    let cuts = [];
    let cutWeight = 0;

    for(let [vertex, connected] of Object.entries(vertices)) {
        if(partition.has(vertex)) {
            graph1[vertex] = connected;
        } else {
            graph2[vertex] = connected;
        }
    }

    return [graph1, graph2];
}

const nodes = parseInput(input);

console.log("nodes", nodes);
const [bestPartition, bestCut] = MinimumCut(nodes);
console.log("bestPartition", bestPartition, "bestCut", bestCut);
console.log("nodes", nodes);
const [graph1, graph2] = MinCutResult(nodes, bestPartition, bestCut);
console.log("graph1", graph1);
console.log("graph2", graph2);


// const findGroups = (nodes) => {
//     let groups = [];
//     let nodeNames = new Set(Object.keys(nodes));
//     let connectedNodes = [nodeNames.values().next().value];
//     let currentGroup = new Set();
//     while (nodeNames.size > 0) {
//         const connectedNode = connectedNodes.pop();
//         currentGroup.add(connectedNode);
//         nodeNames.delete(connectedNode);
//         connectedNodes = [...connectedNodes, ...nodes[connectedNode]];

//         // console.log("connectedNodes", connectedNodes);

//         if(connectedNodes.length === 0) {
//             // exhausted all connections
//             groups.push(currentGroup);
//             currentGroup = new Set();
//             connectedNodes = [nodeNames.values().next().value];
//         }
//     }
//     return groups;
// }

// const groups = findGroups(nodes);

// console.log(groups);
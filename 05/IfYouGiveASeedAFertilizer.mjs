import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const dataChunks = input.split("\n\n");

// seeds are the first chunk
const seeds = dataChunks[0].match(/(\d+)/g).map(Number);

// create a mapping value1 -> value2
const createMap = (dataChunk) => {
    let rulesArray = [];
    let name = null;
    // parse the list of rules
    dataChunk.split("\n").forEach((line, i) => {
        if (i === 0) {
            name = line.replace(":", "");
            return;
        }

        const ranges = line.match(/(\d+)/g)?.map(Number);
        if (!ranges) return; // empty line

        const shift = ranges[0] - ranges[1];

        // create rule
        rulesArray.push({
            min: ranges[1],
            max: ranges[1] + ranges[2], // exclusive
            shift: shift,
        });
        
    });

    // function for finding the conversion
    // we avoid saving each map value because the range is too large
    const f = (value) => {
        for (let rule of rulesArray) {
            if (value >= rule.min && value < rule.max) {
                return value + rule.shift;
            }
        }
        return value;
    }

    return {
        name,
        f
    };
}

// create all mappings from the data chunks, excluding the first
const mappings = dataChunks.slice(1).map((dataChunk) => createMap(dataChunk));

console.log(mappings);
// [{ name: 'seed-to-soil map', f: [Function: f] }, ...]

// create a function that chains all mappings
// should be in order of the data chunks
const chainedMap = (value) => {
    for (let mapping of mappings) {
        value = mapping.f(value);
    }
    return value;
};

// Part 1
// find lowest location (last value of the chain)
const lowest = Math.min(...seeds.map(chainedMap));
console.log("Part 1 answer:", lowest);


// Part 2

// convert seeds to seed ranges
const seedRanges = [];
for( let i = 0; i < seeds.length; i += 2) {
    seedRanges.push({
        min: seeds[i],
        max: seeds[i] + seeds[i+1]
    });
}

// find lowest location
let lowestLocation = 99999999999999;
seedRanges.forEach((range) => {
    console.log(range);
    for(let i = range.min; i < range.max; i++) {
        const value = chainedMap(i);
        if (value < lowestLocation) {
            lowestLocation = value;
        }
    }
});

console.log("Part 2 answer:", lowestLocation);
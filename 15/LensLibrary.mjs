import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const parseInput = (input) => {
    return input.split(",").filter(line => line.length > 0);
}

const calcHASH = (string) => {
    // run the HASH algorithm
    const result = string.split("").reduce((previous, char) => {
        // ignore newline
        if(char == "\n") return previous;

        const asciiValue = char.charCodeAt(0);
        let newValue = asciiValue + previous;
        newValue = (newValue*17) % 256;
        return newValue;
    }, 0);
    return result;
}

const strings = parseInput(input);

// Part 1
const hashes = strings.map(string => {
    return calcHASH(string);
});

console.log("Answer Part 1: ", hashes.reduce((a, c) => a + c, 0));

// Part 2

// initialize empty boxes
let boxes = [];
for(let i = 0; i < 256; i++) boxes.push([]);

for(let instruction of strings) {
    // split based on - or =
    const [boxStr, focalLength] = instruction.split(/-|=/);
    const boxNumber = calcHASH(boxStr);

    if( instruction.includes("-") ) {
        const index = boxes[boxNumber].findIndex(box => box.label == boxStr);

        if(index != -1) {
            boxes[boxNumber].splice(index, 1);
        }
    } else if (instruction.includes("=")) {
        const index = boxes[boxNumber].findIndex(box => box.label == boxStr);
        if(index != -1) {
            boxes[boxNumber][index].focalLength = focalLength;
        } else {
            boxes[boxNumber].push({label: boxStr, focalLength: focalLength});
        }
    }
    else{
        throw new Error("Unknown instruction: " + instruction);
    }
}

// calculate focusing power

const focusingPower = boxes.reduce((prev, box, boxIndex) => {
    const boxFactor = boxIndex + 1;
    const boxPower = box.reduce((sum, lens, lensIndex) => {
        const lensFactor = lensIndex + 1;
        return sum + boxFactor * lensFactor * lens.focalLength;
    }, 0);
    return prev + boxPower;
}, 0);

console.log("Answer Part 2: ", focusingPower);
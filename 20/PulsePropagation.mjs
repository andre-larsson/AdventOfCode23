import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const LOW = 1;
const HIGH = 2;

const createBroadcastFn = (name, outputs) => {
    const fn = (inSignal) => {
        const result = outputs.map((output) => {
            return {from:name, to: output, value: inSignal.value}
        });
        return result;
    }

    return fn;
}

const createFlipFlopFn = (name, outputs) =>{
    // variable 'on' tracks the internal state of each module (on/off)
    let on = false;

    const fn = (inSignal) => {
        const signal = inSignal.value;
        if(signal==HIGH){
            return [];
        }

        if(on){
            on = !on;
            return outputs.map(output => { return {from:name, to: output, value: LOW}})
        } else{
            on = !on;
            return outputs.map(output => { return {from:name, to: output, value: HIGH}})
        }

    }

    return fn;

}


const createConjuctionFn = (name, inputs, outputs) => {

    // stores most recent input signals as key-value pairs,
    // key is name of input node, value is last signal
    const lastInputSignals = {};
    inputs.forEach(e => lastInputSignals[e] = LOW);

    const fn = (inSignal) => {
        // update stored inputs
        lastInputSignals[inSignal.from] = inSignal.value;

        const allHigh = Object.values(lastInputSignals).every((value) => value==HIGH);
        const outSignal = allHigh ? LOW : HIGH;

        return outputs.map((output) => {
            return {from:name, to:output, value:outSignal}
        });
    };

    return fn;
}


const parseInput = (input) => {
    const parsed = input.split("\n")
    .filter(line => line.length>0)
    .map((line) => {
        const [moduleStr, outputStr] = line.split(" -> ");
        let type = moduleStr.match(/[%&]/g)
        let name = null;
        if(type == null){
            // broadcaster
            name = moduleStr
            type = name;
        } else{
            name = moduleStr.slice(1);
            type = type[0];
        }
        const outputs = outputStr.split(", ");
        return [type, name, outputs]
    });
    let modules = {};

    parsed.forEach(module => {
        const [type, name, outputs] = module;

        if(type=="broadcaster"){
            modules[name] = createBroadcastFn(name, outputs);
        } else if(type =="%"){
            modules[name] = createFlipFlopFn(name, outputs);
        } if(type == "&"){
            // find inputs
            const inputs = parsed.reduce((acc, row) => {
                const [type, currName, outputs] = row;
                if(outputs.includes(name)){
                    return [...acc, currName]
                } else{
                    return acc
                }
            }, []);

            modules[name] = createConjuctionFn(name, inputs, outputs);
        }
        
    });

    return modules;
}

const modules = parseInput(input);

const pushButton = (n, part2=false) => {

    let numLow = 0;
    let numHigh = 0;


    for(let i =0; i<n; i++){

        // Press button: send LOW signal from button to broadcaster
        let currentPulses = [{from:"button", to:"broadcaster", value:LOW}];

        do{
            // iterate until there are no more pulses to process
            let newPulses = [];
            numLow += currentPulses.filter(item => item.value==LOW).length;
            numHigh += currentPulses.filter(item => item.value==HIGH).length;
            for(let inPulse of currentPulses){
                if(inPulse.to =="rx"){
                    if(part2 && inPulse.value == LOW) return i;
                } else if(modules[inPulse.to] !== undefined){
                    const outPulses = modules[inPulse.to](inPulse);
                    newPulses = [...newPulses, ...outPulses]
                } else{
                    console.log("Terminal node encountered:", inPulse.to)
                }
            }
            currentPulses = newPulses;
        } while(currentPulses.length>0);
    };

    if(part2) return null;

    return numLow*numHigh;
}

const answer1 = pushButton(1000);

console.log("Part 1 Answer:", answer1);

// too slow, another approach needed
// const answer2 = pushButton(1000000000, true);
// console.log("Part 2 Answer:", answer2);

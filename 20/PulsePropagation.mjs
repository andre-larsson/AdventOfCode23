import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const LOW = 1;
const HIGH = 2;

// note: store all pulses as objects:
// {from: "module1", to: "module2", value: LOW}

const createBroadcastFn = (name, outputs) => {
    const fn = (inSignal) => {
        const result = outputs.map((output) => {
            return {from:name, to: output, value: inSignal.value}
        });
        return result;
    }

    return fn;
}

const lcm = (array) => {
    const gcd = (a, b) => a ? gcd(b % a, a) : b;
    const lcm2 = (a, b) => a * b / gcd(a, b);
    const lcmArray = (arr) => arr.reduce((acc, val) => lcm2(acc, val), 1);
    return lcmArray(array);
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
    // split into type, name, outputs
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

    // create functions for each module
    parsed.forEach(module => {
        const [type, name, outputs] = module;

        modules[name] = {type, name, outputs};

        if(type=="broadcaster"){
            modules[name].fn = createBroadcastFn(name, outputs);
        } else if(type =="%"){
            modules[name].fn = createFlipFlopFn(name, outputs);
            modules[name].state = false;
        } if(type == "&"){
            // find all other nodes that output to this node
            const inputs = parsed.reduce((acc, row) => {
                const [type, currName, outputs] = row;
                if(outputs.includes(name)){
                    return [...acc, currName]
                } else{
                    return acc
                }
            }, []);
            modules[name].inputs = inputs;
            modules[name].inputValues = inputs.reduce((acc, input) => {
                acc[input] = LOW;
                return acc;
            }, {});
            modules[name].fn = createConjuctionFn(name, inputs, outputs);
        }
        
    });

    // given an insignal, dispatch it to the correct module and return the output signals
    const dispatcher = (inSignal) => {
        if(inSignal.to=="rx") return [];
        const fn = modules[inSignal.to].fn;
        if(fn === undefined){
            console.log("Unknown module encountered:", inSignal.to);
            return [];
        }
        return fn(inSignal);
    }

    return {moduleDispatcher: dispatcher, modules: modules};
}


const {moduleDispatcher} = parseInput(input);

const pushButton = (n, moduleDispatcher, part2=false) => {

    let numLow = 0;
    let numHigh = 0;

    // note: conjunction &  will send low pulse (to rx) if all inputs are high
    // we want to know when the rx receives a low pulse
    // this happens when all inputs to lv (chainedPulses) are all high
    // which happens when all chainedPulses receives a low pulse simultaneously
    // chainedPulses (all received low pulse in same turn) >all sends high> &lv >low> rx
    //

    const chainedPulses = {"st":-1, "tn":-1, "hh":-1, "dt":-1};


    for(let i =0; i<n; i++){

        // Press button: send LOW signal from button to broadcaster
        let currentPulses = [{from:"button", to:"broadcaster", value:LOW}];

        do{
            // iterate until there are no more pulses to process
            let newPulses = [];
            numLow += currentPulses.filter(item => item.value==LOW).length;
            numHigh += currentPulses.filter(item => item.value==HIGH).length;
            for(let inPulse of currentPulses){

                if(inPulse.value == LOW && chainedPulses[inPulse.to] == -1){
                    // chainedModule to receive a LOW pulse, meaning it becomes HIGH
                    chainedPulses[inPulse.to] = i+1; // to include first pulse
                }


                const outPulses = moduleDispatcher(inPulse);
                newPulses = [...newPulses, ...outPulses]
            }
            currentPulses = newPulses;
        } while(currentPulses.length>0);

        if(part2 && Object.values(chainedPulses).every(value => value!=-1)){
            break;
        }
    };

    if(part2) return lcm(Object.values(chainedPulses))
    return numLow*numHigh;
}

const answer1 = pushButton(1000, moduleDispatcher);

console.log("Part 1 Answer:", answer1);

// Part 2
// reset all states
const {moduleDispatcher: moduleDispatcher2} = parseInput(input);

const answer2 = pushButton(1000000, moduleDispatcher2, true);
console.log("Part 2 Answer:", answer2);

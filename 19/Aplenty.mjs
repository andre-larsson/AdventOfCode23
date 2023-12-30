import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const createRuleFn = (ruleStr) => {

    const parseSubRule = (subRuleStr) => {
            
        if(!subRuleStr.includes(":")){
            // last rule. send directly to destination
            return (vars) => {
                return subRuleStr;
            }
        }

        let [rule, destination] = subRuleStr.split(":");

        const varName = rule.slice(0,1);
        const operator = rule.slice(1,2);
        const number = rule.slice(2)

        if(operator == ">"){
            return (vars) => {
                if(vars[varName] > number){
                    return destination;
                }
            }
        } else if(operator == "<"){
            return (vars) => {
                if(vars[varName] < number){
                    return destination;
                }
            }
        }

        throw new Error("Unknown operator", operator);
    }

    const functions = ruleStr.split(",").map(r => parseSubRule(r));

    const chainedFunctions = (value) => {
        for(let i=0; i<functions.length; i++){
            const result = functions[i](value);
            if(result) return result;
        }
        throw new Error("No terminal destination defined");
    }

    return chainedFunctions;
}

const parseInput = (input, keepRuleStr=false) => {
    const [rules, parts] = input.split("\n\n");

    const rulesMap = {};

    rules.split("\n")
    .filter(r => r.length>0)
    .forEach((rule) => {
        rule = rule.replace(/}/, "")
        const [id, ruleStr] = rule.split("{");
        if(keepRuleStr) rulesMap[id] = ruleStr;
        else rulesMap[id] = createRuleFn(ruleStr);
    }
    );

    let partsArray = parts.split("\n")
        .filter(line => line.length>0)
        .map((part) => {
        let partObj = {};
        part = part.replace(/}/, "").replace(/{/, "");
        part.split(",").forEach((p) => {
            const [key, value] = p.split("=");
            partObj[key] = parseInt(value);
        });
        return partObj;
    });

    return [rulesMap, partsArray];
    }

// Part 1
// parse rules (first section in input) and parts (second section)
const [rules, parts] = parseInput(input);


// iterate a part through rules until either A or R is reached
const iteratePart = (part) => {
    let ruleName = "in"; // start at rule "in"
    do{
        ruleName = rules[ruleName](part);
    } while(ruleName != "A" && ruleName != "R")

    return ruleName;
}

// get accepted parts and sum ratings
const accepted = parts.filter(part => iteratePart(part) == "A")

const summedRatings = accepted.reduce((acc, p) => {
    return acc + p.x + p.m + p.a + p.s;
},0);

console.log("Answer Part 1:", summedRatings);

// Part 2
// Now we are interested in the bounds of the possible parameters, which we will save as
//
// partBounds = { x: {l, u}, m: {l, u}, a: {l, u}, s: {l, u}}
// 
// Here l and u are lower/upper bounds of x, m, a, s.
// Each rule creates a new "split in the data", and sends this chunk to the next rule,
// which will further split the data, and send each of the splits to a new rule and so on...
// We do all data splits recursively until we reach the end, where we calculate the number of
// combinations.

const getNumAccepted = (ruleName, partBounds) => {
    // Recursively calculate number of accepted parts

    if(ruleName == "R"){
        return 0; // none accepted
    } else if(ruleName == "A"){
        const num = Object.values(partBounds).reduce((acc, v) => {
            if(v.l > v.u) return 0; // impossible combination
            return acc*(v.u - v.l + 1);
        }
        ,1);
        return num; 
    }

    const parseSubRule = (subRuleStr, prevBounds) => {
        // Given a subrule str (such as 'm>3736:rfj') and a partBounds object (see above)
        // Returns [bounds1, bounds2, destination]
        // where bounds1 is the data split sent to destination ('rfj')
        // while bounds2 is the split sent to the next rule
            
        if(!subRuleStr.includes(":")){
            // last rule. everything is sent to destination.
            return [{...prevBounds}, undefined, subRuleStr];
        }

        let [rule, destination] = subRuleStr.split(":");

        const varName = rule.slice(0,1);
        const operator = rule.slice(1,2);
        const number = parseInt(rule.slice(2));

        if(operator == ">"){
            let bounds1 = {...prevBounds};
            let bounds2 = {...prevBounds};
            // all numbers above number are sent to destination
            bounds1[varName] = {
                l: Math.max(prevBounds[varName].l, number+1),
                u: prevBounds[varName].u
            }
            // all numbers below number will continue to next rule
            bounds2[varName] = {
                l: prevBounds[varName].l,
                u: Math.min(prevBounds[varName].u, number)
            }
                return [bounds1, bounds2, destination];
        } else if(operator == "<"){
            let bounds1 = {...prevBounds};
            let bounds2 = {...prevBounds};
            // all numbers below number are sent to destination
            bounds1[varName] = {
                l: prevBounds[varName].l,
                u: Math.min(prevBounds[varName].u, number-1)
            }
            // all numbers above number will continue to next rule
            bounds2[varName] = {
                l: Math.max(prevBounds[varName].l, number),
                u: prevBounds[varName].u
            }
            return [bounds1, bounds2, destination];
        }
        throw new Error("Unknown operator", operator);
    }

    // get rule with name ruleName, and split into subRules
    const subRuleStrs = ruleStrs[ruleName].split(",");

    let currentBounds = {...partBounds};
    let total = 0;
    for(let i=0; i<subRuleStrs.length; i++){
        const [bounds1, bounds2, newRuleName] = parseSubRule(subRuleStrs[i], currentBounds);

        // calculate num accepted for split sent to new rule
        total += getNumAccepted(newRuleName, bounds1);

        // continue with next split sent to next subrule
        currentBounds = bounds2;
    }

    return total;
}

// read rules but don't convert rules to functions (do parsing in getNumAccepted)
const [ruleStrs, _] = parseInput(input, true);

const result = getNumAccepted("in", {
    x: {l: 1, u: 4000},
    m: {l: 1, u: 4000},
    a: {l: 1, u: 4000},
    s: {l: 1, u: 4000}
});

console.log("Answer Part 2:", result);

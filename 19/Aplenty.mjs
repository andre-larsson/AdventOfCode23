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

const parseInput = (input) => {
    const [rules, parts] = input.split("\n\n");

    const rulesMap = {};

    rules.split("\n")
    .filter(r => r.length>0)
    .forEach((rule) => {
        rule = rule.replace(/}/, "")
        const [id, ruleStr] = rule.split("{");
        rulesMap[id] = createRuleFn(ruleStr);
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

const [rules, parts] = parseInput(input);
const iteratePart = (part) => {
    let ruleName = "in"
    do{
        ruleName = rules[ruleName](part);
    } while(ruleName != "A" && ruleName != "R")

    return ruleName;
}

const accepted = parts.filter(part => iteratePart(part) == "A")

console.log("accepted", accepted)

const summedRatings = accepted.reduce((acc, p) => {
    return acc + p.x + p.m + p.a + p.s;
},0);

console.log("Answer Part 1:", summedRatings);
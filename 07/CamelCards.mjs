import { get } from "http";
import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const getCardValue = (value) => {
    switch(value){
        case "T":
            return 10;
        case "J":
            return 11;
        case "Q":
            return 12;
        case "K":
            return 13;
        case "A":
            return 14;
        default:
            return Number(value);
    }
}

const HIGH_CARD=0;
const PAIR=1;
const TWO_PAIR=2;
const THREE_OF_A_KIND=3;
const FULL_HOUSE=4;
const FOUR_OF_A_KIND=5;
const FIVE_OF_A_KIND=6;

const getCardValue2 = (value) => {
    switch(value){
        case "J":
            return 1;
        case "T":
            return 10;
        case "Q":
            return 11;
        case "K":
            return 12;
        case "A":
            return 13;
        default:
            return Number(value);
    }
}

const gameState = input.split("\n")
.filter(line => line.length > 0)
.map(line =>{
    const cells = line.split(" ");
    return {
        hand: cells[0],
        bet: Number(cells[1])
    }
});

const getRank = (card) => {

    // sort such that the same cards are next to each other
    const cardSorted = card.split("").sort().join("");

    if(cardSorted.match(/(.)(\1){4}/g) !== null){
        // five of a kind
        return FIVE_OF_A_KIND;
    }
    
    if(cardSorted.match(/(.)(\1){3}/g) !== null){
        // four of a kind
        return FOUR_OF_A_KIND;
    }

    const threeOfAKind = cardSorted.match(/(.)(\1){2}/g);
    const pair = cardSorted.match(/(.)(\1)/g);

    if(threeOfAKind !== null && pair !== null && pair.length == 2){
        // found two groups with >=2 cards
        // at least one with 3 cards
        // must be full house
        return FULL_HOUSE;
    }

    if(threeOfAKind !== null){
        // three of a kind
        return THREE_OF_A_KIND;
    }

    if(pair !== null && pair.length === 2){
        // two pair
        return TWO_PAIR;
    }

    if(pair !== null){
        // pair
        return PAIR;
    }
    // high card
    return HIGH_CARD;
}


const getRank2 = (card) => {

    const numJokers = card.match(/J/g)?.length ?? 0;

    if(numJokers === 5 || numJokers === 4){
        // five of a kind
        return FIVE_OF_A_KIND;
    }

    const numUniqueCards = new Set(card).size;

    if(numJokers === 3){ // two non-jokers
        if(numUniqueCards === 2) return FIVE_OF_A_KIND;
        else if(numUniqueCards === 3) return FOUR_OF_A_KIND;
        else throw new Error("Unexpected hand");
    }

    if(numJokers === 2){ // three non-jokers
        if(numUniqueCards === 2) return FIVE_OF_A_KIND;
        else if(numUniqueCards === 3) return FOUR_OF_A_KIND; // must be a pair (but not 3-of-a-kind) in the non-jokers
        else if(numUniqueCards === 4) return THREE_OF_A_KIND; // all non-jokers are different
        else throw new Error("Unexpected hand");
    }

    if(numJokers === 1){ // four non-jokers
        if(numUniqueCards === 2) return FIVE_OF_A_KIND;
        else if(numUniqueCards === 3){
            // two unique cards among the four non-jokers
            // must be either: 3-of-a-kind or two pair

            const bestHandNonJokers = getRank(card.replace(/J/g, ""));
            if(bestHandNonJokers === THREE_OF_A_KIND) return FOUR_OF_A_KIND;
            else if(bestHandNonJokers === TWO_PAIR) return FULL_HOUSE;
            else throw new Error("Unexpected hand");
        } else if(numUniqueCards === 4){
            // three unique cards among the four non-jokers
            // hand must be a pair
            return THREE_OF_A_KIND;
        } else if(numUniqueCards === 5){
            // all four non-jokers are different
            return PAIR;
        }
    }
    // no jokers, return the best hand
    return getRank(card);
}

const compareHands = (hand1, hand2) => {
    const rank1 = getRank(hand1.hand);
    const rank2 = getRank(hand2.hand);

    if(rank1 !== rank2){
        // if hand1 has a higher rank, return a positive number
        return rank1 - rank2;
    } else {
        // same rank, compare the values from left to right
        for(let i = 0; i < hand1.hand.length; i++){
            const value1 = getCardValue(hand1.hand[i]);
            const value2 = getCardValue(hand2.hand[i]);
            if(value1 !== value2){
                return value1 - value2;
            }
        }
    }
    console.log("Tie")
    return 0;
}

const compareHands2 = (hand1, hand2) => {
    const rank1 = getRank2(hand1.hand);
    const rank2 = getRank2(hand2.hand);

    console.log(hand1.hand, rank1, hand2.hand, rank2);

    if(rank1 !== rank2){
        // if hand1 has a higher rank, return a positive number
        return rank1 - rank2;
    } else {
        // same rank, compare the values from left to right
        for(let i = 0; i < hand1.hand.length; i++){
            const value1 = getCardValue2(hand1.hand[i]);
            const value2 = getCardValue2(hand2.hand[i]);
            if(value1 !== value2){
                return value1 - value2;
            }
        }
    }
    console.log("Tie")
    return 0;
}

const sortedHands = gameState.sort(compareHands);
const totalWinnings = sortedHands.reduce((acc, hand, index) => acc + hand.bet*(index+1), 0);

console.log("Part 1 Answer:", totalWinnings)

const sortedHands2 = gameState.sort(compareHands2);
const totalWinnings2 = sortedHands2.reduce((acc, hand, index) => acc + hand.bet*(index+1), 0);

console.log("Part 2 Answer:", totalWinnings2)
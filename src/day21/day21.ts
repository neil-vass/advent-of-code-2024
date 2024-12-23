import {linesFromFile, Sequence} from "generator-sequences";

export function reversePath(p: string) {
    return [...p].reverse().map(c => "^v<>"["v^><".indexOf(c)]).join("");
}

export class Keypad {
    currentKey = "A"

    constructor(private readonly keymap: Keymap) {}

    shortestPathsTo(destination: string) {
        if (destination === this.currentKey) return [""];

        const fromHere = this.keymap[this.currentKey][destination];
        if (fromHere !== undefined) {
            return fromHere;
        }

        const fromThere = this.keymap[destination][this.currentKey];
        return fromThere.map(reversePath);
    }

    costToSendPath(pathSequence: string) {
        // For a dirpad sending this sequence: Starting over A, sending all
        // the directions with an A after each one, how many presses are needed?
        this.currentKey = "A";
        let cost = 0;
        for (const key of pathSequence) {
            cost += this.shortestPathsTo(key)[0].length + 1; // +1 for the A
            this.currentKey = key;
        }
        return cost;
    }
}

// <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
// v<<A>>^A<A>AvA<^AA>A<vAAA>^A
// <A^A>^^AvvvA
// 029A

export function sequenceNeededToEnterCode(code: string, chain: Keypad[]) {
    // We can optimise one char of the code at a time, since after each of those we know where we end up.
    // All d-pads on "A" and the numpad on the code's char.

    let sequence = code;
    for (let i=0; i < chain.length; i++) {
        let sendToThisPad = "";
        let cost = 0;
        for (const key of sequence) {
            let bestCmd = "";
            let lowestCostSoFar = Infinity;
            for (const option of chain[i].shortestPathsTo(key)) {
                const cmdForThisOption = option + "A";
                const costForThisOption = (i+1 < chain.length) ? chain[i+1].costToSendPath(cmdForThisOption) : cmdForThisOption.length;
                if (costForThisOption < lowestCostSoFar) {
                    bestCmd = cmdForThisOption;
                    lowestCostSoFar = costForThisOption;
                }
            }
            sendToThisPad += bestCmd;
            cost += lowestCostSoFar;
            chain[i].currentKey = key;
        }
        sequence = sendToThisPad;
        console.log(sequence)
        console.log(cost);
    }

    return sequence;
}



export async function solvePart1(lines: Sequence<string>) {
    return "Hello, World!";
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day21.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}


type Keymap = {[from: string]: {[to: string]: string[]}};

export const numericKeymap: Keymap = {
    "A": {
        "0": ["<"],
        "1": ["^<<", "<^<"], // missing corner
        "2": ["^<", "<^"],
        "3": ["^"],
        "4": ["^^<<", "^<^<", "^<<^", "<^^<", "<^<^"], // missing corner
        "5": ["^^<", "^<^", "<^^"],
        "6": ["^^"],
        "7": ["^^^<<", "^^<^<", "^^<<^", "^<^^<", "^<^<^", "^<<^^", "<^^^<", "<^^<^", "<^<^^"], // missing corner
        "8": ["^^^<", "^^<^", "^<^^", "<^^^"],
        "9": ["^^^"],
    },
    "0": {
        "1": ["^<"], // missing corner
        "2": ["^"],
        "3": ["^>", ">^"],
        "4": ["^^<", "^<^"], // missing corner
        "5": ["^^"],
        "6": ["^^>", "^>^", ">^^"],
        "7": ["^^^<", "^^<^", "^<^^"], // missing corner
        "8": ["^^^"],
        "9": ["^^^>", "^^>^", "^>^^", ">^^^"],
    },
    "1": {
        "2": [">"],
        "3": [">>"],
        "4": ["^"],
        "5": ["^>", ">^"],
        "6": ["^>>", ">^>", ">>^"],
        "7": ["^^"],
        "8": ["^^>", "^>^", ">^^"],
        "9": ["^^>>", "^>^>", "^>>^", ">^^>", ">^>^", ">>^^"],
    },
    "2": {
        "3": [">"],
        "4": ["^<", "<^"],
        "5": ["^"],
        "6": ["^>", ">^"],
        "7": ["^^<", "^<^", "<^^"],
        "8": ["^^"],
        "9": ["^^>", "^>^", ">^^"],
    },
    "3": {
        "4": ["^<<", "<^<", "<<^"],
        "5": ["^<", "<^"],
        "6": ["^"],
        "7": ["^^<<", "^<^<", "^<<^", "<^^<", "<^<^", "<<^^"],
        "8": ["^^<", "^<^", "<^^"],
        "9": ["^^^"],
    },
    "4": {
        "5": [">"],
        "6": [">>"],
        "7": ["^"],
        "8": ["^>", ">^"],
        "9": ["^>>", ">^>", ">>^"],
    },
    "5": {
        "6": [">"],
        "7": ["^<", "<^"],
        "8": ["^"],
        "9": ["^>", ">^"],
    },
    "6": {
        "7": ["^<<", "<^<", "<<^"],
        "8": ["^<", "<^"],
        "9": ["^"],
    },
    "7": {
        "8": [">"],
        "9": [">>"],
    },
    "8": {
        "9": [">"],
    },
    "9": {}
};

export const directionKeymap: Keymap = {
    "A": {
        "^": ["<"],
        "<": ["v<<", "<v<"], // missing corner
        "v": ["v<", "<v"],
        ">": ["v"],
    },
    "^": {
        "<": ["v<"], // missing corner
        "v": ["v"],
        ">": ["v>", ">v"],
    },
    "<": {
        "v": [">"],
        ">": [">>"],
    },
    "v": {
        ">": [">>"],
    },
    ">": {}
};



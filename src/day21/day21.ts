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

    costToSend(sequence: string, sender: Keypad) {
        // How many keys would the sender need to press to send me
        // over to each dir key, press it, back to A and press that?
        let cost = 0;
        for (const key of sequence + "A") {
            cost += (sender.shortestPathsTo(key)[0].length + 1) * 2;
        }
        return cost;
    }
}

export function enterCode(code: string, chain: Keypad[]) {
    // We can optimise one char of the code at a time, since after each of those we know where we end up.
    // All d-pads on "A" and the numpad on the code's char.
    let totalPresses = 0;
    let requiredSequence = code;
    for (let i = 0; i < chain.length; i++) {
        let nextSequence = "";
        for (const key of requiredSequence) {
            const options = chain[i].shortestPathsTo(key);
            if (i === chain.length-1) {
                totalPresses += Math.min(...options.map(op => op.length));
            } else {
                let lowestCost = Infinity;
                let lowestSequence = "";
                for (const op of options) {
                    const cost = chain[i].costToSend(op, chain[i+1]);
                    if (cost < lowestCost) {
                        lowestCost = cost;
                        lowestSequence = op;
                    }
                }
                nextSequence += lowestSequence + "A";
            }
            if (i === 0) chain[i].currentKey = key;
        }
        console.log(nextSequence)
        requiredSequence = nextSequence;
    }

    return totalPresses;
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





import {linesFromFile, Sequence} from "generator-sequences";

export function reversePath(p: string) {
    return [...p].map(c => "^v<>"["v^><".indexOf(c)]).join("");
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
}

export function enterCode(code: string, chain: Keypad[]) {
    // We can optimise one char of the code at a time, since after each of those we know where we end up.
    // All d-pads on "A" and the numpad on the code's char.
    const presses: string[] = [];
    let sequenceOnThisPad = code;
    for (const keypad of chain.toReversed()) {
        let sequenceOnNextPad = "";
        for (const key of sequenceOnThisPad) {
            // Let's just take the first of the shortest paths.
            // (I'm sure we'll change that later)
            sequenceOnNextPad += keypad.shortestPathsTo(key)[0] + "A";
            keypad.currentKey = key;
        }
        // Time to move on!
        presses.unshift(sequenceOnThisPad);
        sequenceOnThisPad = sequenceOnNextPad;
    }
    return presses;
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

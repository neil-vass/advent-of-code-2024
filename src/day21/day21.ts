import {linesFromFile, Sequence} from "generator-sequences";

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
        ">": [">"],
    },
    ">": {}
};

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
}


const cache = new Map<string, number>();
export function costToEnterCode(code: string, chain: Keypad[]) {
    const theseArgs = `${code} + ${chain.length}`;
    const result = cache.get(theseArgs);
    if (result !== undefined) return result;

    const [head, ...rest] = chain;
    let cost = 0;

    for (const key of code) {
        if (rest.length === 0) {
            cost += head.shortestPathsTo(key)[0].length +1; // For the "A"
        } else {
            const optionCosts = head.shortestPathsTo(key).map(path => costToEnterCode(path+"A", rest));
            cost += Math.min(...optionCosts);
        }
        head.currentKey = key;
    }

    cache.set(theseArgs, cost);
    return cost;
}

export async function solve(lines: Sequence<string>, numRobotDirpads=2) {
    const chain = Array.from({length: numRobotDirpads}, () => new Keypad(directionKeymap));
    chain.unshift(new Keypad(numericKeymap));

    const complexities = lines.map(code => costToEnterCode(code, chain) * parseInt(code));
    return Sequence.sum(complexities);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day21.input.txt`;
    const numRobotDirpads = 25;
    console.log(await solve(linesFromFile(filepath), numRobotDirpads));
}





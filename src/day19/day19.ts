import {linesFromFile, Sequence} from "generator-sequences";
import {Stack} from "../utils/graphSearch.js";

export function availableTowels(line: string) {
    return new Set(line.split(", "));
}

let checked = 0;
export function isPossible(pattern: string, towels: Set<string>) {
    checked++;
    console.log(`checking ${checked}: ${pattern}`);
    // Backtrack with Stack
    const possibilities = new Stack<{ rp: string, possible: string }>();
    let remainingPattern = pattern;
    while (remainingPattern.length > 0) {
        for (const t of towels) {
            if (remainingPattern.startsWith(t)) {
                possibilities.push({rp: remainingPattern, possible: t});
            }
        }

        let foundWayForward = false;
        while (!foundWayForward) {
            if (possibilities.isEmpty()) return false;
            const candidate = possibilities.pull()!;
            remainingPattern = candidate.rp.slice(candidate.possible.length);
            foundWayForward = true;
        }
    }
    return true;
}

export async function solvePart1(lines: Sequence<string>) {
    const linesArray = await lines.toArray();
    const towels = availableTowels(linesArray[0]);
    return linesArray.slice(2).filter(p => isPossible(p, towels)).length;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day19.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
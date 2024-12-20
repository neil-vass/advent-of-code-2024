import {linesFromFile, Sequence} from "generator-sequences";
import {Stack} from "../utils/graphSearch.js";

export function availableTowels(line: string) {
    const allTowels = line.split(", ");
    const sizedTowels = new Map<number, string[]>();
    let minLength = Infinity;
    let maxLength = 0;
    for (const t of allTowels) {
        if (!sizedTowels.has(t.length)) sizedTowels.set(t.length, []);
        sizedTowels.get(t.length)!.push(t);
        minLength = Math.min(minLength, t.length);
        maxLength = Math.max(maxLength, t.length);
    }

    let len = minLength+1;
    const keepers = sizedTowels.get(minLength)!;
    while (len <= maxLength) {
        const someTowels = sizedTowels.get(len);
        if(!someTowels) continue;
        const cantMake = someTowels.filter(t => !isPossible(t, keepers));
        keepers.push(...cantMake);
        len++;
    }
    return keepers;
}

export function isPossible(pattern: string, towels: Iterable<string>) {
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

export function letMeCountTheWays(pattern: string, towels: string[]) {
    return 0;
}

export async function solvePart1(lines: Sequence<string>) {
    const linesArray = await lines.toArray();
    const towels = availableTowels(linesArray[0]);
    return linesArray.slice(2).filter(p => isPossible(p, towels)).length;
}

export async function solvePart2(lines: Sequence<string>) {
    const linesArray = await lines.toArray();
    const towels = availableTowels(linesArray[0]);
    return linesArray.slice(2).filter(p => letMeCountTheWays(p, towels)).length;
}
// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day19.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
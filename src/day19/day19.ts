import {linesFromFile, Sequence} from "generator-sequences";
import {Stack} from "../utils/graphSearch.js";

// Part 1 pulled out just the towels that are "atoms" - ones that all other
// towels can be built from. This approach doesn't work for part 2, and it
// turns out the recursive / memoized approach there would do part 1 just fine
// as well. But here's the original...
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

// We're going to wrap this so we rememberResults of all calls, so it's declared with "let".
export let letMeCountTheWays = function(pattern: string, towels: string[]) {
    let count = 0;
    for (const t of towels) {
        if (pattern === t) {
            count++;
        } else if (pattern.startsWith(t)) {
            count += letMeCountTheWays(pattern.slice(t.length), towels);
        }
    }
    return count;
}

// Counting all the ways takes too long, let's remember the answer every time we
// check a portion of a pattern - the same questions come up repeatedly.
const cache = new Map<string, any>();

function rememberResults(fn: any) {
    return function() {
        let result = cache.get(JSON.stringify(arguments));
        if (result === undefined) {
            result = fn.apply(undefined, arguments);
            cache.set(JSON.stringify(arguments), result);
        }
        return result;
    }
}

letMeCountTheWays = rememberResults(letMeCountTheWays);

export async function solvePart1(lines: Sequence<string>) {
    const linesArray = await lines.toArray();
    const towels = availableTowels(linesArray[0]);
    return linesArray.slice(2).filter(p => isPossible(p, towels)).length;
}

export async function solvePart2(lines: Sequence<string>) {
    const linesArray = await lines.toArray();
    const towels = linesArray[0].split(", ");
    const patterns = linesArray.slice(2);
    return patterns.reduce((total, pattern) => total + letMeCountTheWays(pattern, towels), 0);
}
// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day19.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
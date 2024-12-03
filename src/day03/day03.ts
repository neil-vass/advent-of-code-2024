import {linesFromFile, Sequence} from "generator-sequences";

export function sumOfMuls(line: string) {
    const matches = line.matchAll(/mul\((\d+),(\d+)\)/g);
    let sum = 0;
    for (const m of matches) {
        sum += +m[1] * +m[2];
    }
    return sum;
}

export async function solvePart1(lines: Sequence<string>) {
    return await Sequence.sum(lines.map(sumOfMuls));
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day03.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
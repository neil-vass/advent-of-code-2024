import {linesFromFile, Sequence} from "generator-sequences";

export function sumOfMuls(line: string) {
    const matches = line.matchAll(/mul\((\d+),(\d+)\)/g);
    let sum = 0;
    for (const m of matches) {
        sum += +m[1] * +m[2];
    }
    return sum;
}

export function sumOfMulsWithConditionals(line: string) {
    const matches = line.matchAll(/(mul\((\d+),(\d+)\))|(do\(\))|(don't\(\))/g);
    let sum = 0;
    let process = true;
    for (const m of matches) {
        if (m[0] === "do()") {
            process = true;
        } else if (m[0] === "don't()") {
            process = false;
        }
        else if (m[0].startsWith("mul") && process){
            sum += +m[2] * +m[3];
        }
    }
    return sum;

}

export async function solvePart1(lines: Sequence<string>) {
    return await Sequence.sum(lines.map(sumOfMuls));
}

export async function solvePart2(lines: Sequence<string>) {
    const oneLine = await lines.reduce((acc, val) => acc + val, "");
    return sumOfMulsWithConditionals(oneLine);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day03.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}


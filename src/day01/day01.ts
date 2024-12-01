import {linesFromFile, Sequence} from "generator-sequences";

export function parseLine(line: string) {
    const m = line.match(/^(\d+)\s+(\d+)$/);
    if (!m) throw new Error(`Unrecognized format: ${line}`);
    return [+m[1], +m[2]];
}

async function createLists(input: Sequence<string>) {
    const list1 = new Array<number>();
    const list2 = new Array<number>();

    for await (const line of input) {
        const [left, right] = parseLine(line);
        list1.push(left);
        list2.push(right);
    }
    return {list1, list2};
}

export async function solvePart1(input: Sequence<string>) {
    const {list1, list2} = await createLists(input);

    list1.sort((a, b) => a-b);
    list2.sort((a, b) => a-b);

    let sumOfDiffs = 0;
    for (let i = 0; i < list1.length; i++) {
        sumOfDiffs += Math.abs(list1[i] - list2[i]);
    }
    return sumOfDiffs;
}

export function countOccurrences(list: number[]) {
    const counter: { [key: number]: number } = {};
    list.forEach(val => counter[val] ? counter[val]++ : counter[val] = 1);
    return counter;
}

export async function solvePart2(input: Sequence<string>) {
    const {list1, list2} = await createLists(input);
    const occurrences = countOccurrences(list2);
    return list1.reduce((acc, val) => (acc += val * occurrences[val] || 0), 0);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day01.input.txt`;
    const input = linesFromFile(filepath);
    console.log(await solvePart2(input));
}
import {linesFromFile, Sequence} from "generator-sequences";

export function parseLine(line: string): [number, number[]] {
    if (!line.match(/^\d+:( \d+)+$/)) throw new Error(`Bad format`);
    const [testVal, rest] = line.split(": ");
    const equationVals = rest.split(" ");
    return [Number(testVal), equationVals.map(Number)];
}

type Operator = (x: number, y: number) => number;
export const add = (x: number, y: number) => x+y;
export const mul = (x: number, y: number) => x*y;
export const con = (x: number, y: number) => +(""+x+y);

export function couldBeTrue(testVal: number, equationVals: number[], operators=[add, mul]) {

    function hasSolution(head: number, rest: number[]): boolean {
        if (rest.length === 0) {
            return head === testVal;
        } else {
            return operators.some(op => hasSolution(op(head, rest[0]), rest.slice(1)));
        }
    }

    return hasSolution(equationVals[0], equationVals.slice(1));
}

async function sumValidResults(lines: Sequence<string>, operators: Operator[]) {
    let calibrationResult = 0;
    for await (const [testVal, equationVals] of lines.map(parseLine)) {
        if (couldBeTrue(testVal, equationVals, operators)) {
            calibrationResult += testVal;
        }
    }
    return calibrationResult;
}

export async function solvePart1(lines: Sequence<string>) {
    return await sumValidResults(lines, [add, mul]);
}

export async function solvePart2(lines: Sequence<string>) {
    return await sumValidResults(lines, [add, mul, con]);
}


// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day07.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}

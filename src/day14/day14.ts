import {linesFromFile, Sequence} from "generator-sequences";

export type XY = {x: number, y: number};
export type Robot = {p: XY, v: XY};

export function parseRobot(line: string): Robot {
    const m = line.match(/^p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)$/);
    if (!m) throw new Error(`Unexpected format: ${line}`);
    return {
        p: { x: +m[1], y: +m[2] },
        v: { x: +m[3], y: +m[4] }
    }
}

export async function solvePart1(lines: Sequence<string>) {
    return "Hello, World!";
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day14.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
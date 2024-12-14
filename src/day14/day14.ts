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

const mod = (a: number, b: number) => ((a % b) + b) % b;

export function positionAfter(robot: Robot, room: XY, seconds: number) {
    const xMove = robot.p.x + (robot.v.x * seconds)
    const xWrapped = mod(xMove, room.x);
    const yMove = robot.p.y + (robot.v.y * seconds)
    const yWrapped = mod(yMove, room.y);
    return {x: xWrapped, y: yWrapped};
}

export function quadrant(pos: XY, room: XY): 1|2|3|4|null {
    const xMid = Math.floor(room.x / 2);
    const yMid = Math.floor(room.y / 2);
    if (pos.x < xMid && pos.y < yMid) return 1;
    if (pos.x > xMid && pos.y < yMid) return 2;
    if (pos.x < xMid && pos.y > yMid) return 3;
    if (pos.x > xMid && pos.y > yMid) return 4;
    return null;
}

export async function solvePart1(lines: Sequence<string>, room: XY, seconds: number) {
    const quadrantCounts = {1: 0, 2: 0, 3: 0, 4: 0};
    const robots = lines.map(parseRobot);
    const endPositions = robots.map(bot => positionAfter(bot, room, seconds));
    const botQuadrants = endPositions.map(pos => quadrant(pos, room));
    for await (const quad of botQuadrants) {
        if (quad !== null) {
            quadrantCounts[quad]++;
        }
    }
    return quadrantCounts[1] * quadrantCounts[2] * quadrantCounts[3] * quadrantCounts[4];
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day14.input.txt`;
    const lines = linesFromFile(filepath);
    const room = {x: 101, y: 103};
    const seconds =  100;
    console.log(await solvePart1(lines, room, seconds));
}

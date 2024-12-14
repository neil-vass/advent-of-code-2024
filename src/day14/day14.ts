import {linesFromFile, Sequence} from "generator-sequences";
// @ts-ignore
import ppm from "ppm";

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

async function printAt(lines: Sequence<string>, room: XY, seconds: number) {
    const robots = await lines.map(parseRobot).toArray();
    const endPositions = robots.map(bot => positionAfter(bot, room, seconds));
    const grid = Array.from({length: room.y}, () => Array.from({length: room.x}, () => " "));
    endPositions.forEach(({x,y}) => grid[y][x] = "*");
    grid.forEach(row => console.log(row.join("")));
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

export async function solvePart2(lines: Sequence<string>, room: XY) {
    const timeOfMaxInOneQuadrant = [8149]
    let maxSeen = 0;
    let timeMaxWasSeen = 0;

    const robots = await lines.map(parseRobot).toArray();
    for (const seconds of timeOfMaxInOneQuadrant) {
        const endPositions = robots.map(bot => positionAfter(bot, room, seconds));
        const botQuadrants = endPositions.map(pos => quadrant(pos, room));
        const quadrantCounts = {1: 0, 2: 0, 3: 0, 4: 0};
        for await (const quad of botQuadrants) {
            if (quad !== null) {
                quadrantCounts[quad]++;
            }
        }

        const maxThisTime = Object.values(quadrantCounts).reduce((acc, val) => Math.max(acc, val), 0);
        if (maxThisTime > maxSeen) {
            maxSeen = maxThisTime;
            timeMaxWasSeen = seconds;
        }
    }
    return timeMaxWasSeen;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day14.input.txt`;
    const lines = linesFromFile(filepath);
    const room = {x: 101, y: 103};
    const timeMaxWasSeen =  await solvePart2(lines, room);
    console.log(timeMaxWasSeen);
    console.log(await printAt(linesFromFile(filepath), room, timeMaxWasSeen));
}

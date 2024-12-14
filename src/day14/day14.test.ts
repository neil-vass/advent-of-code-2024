import {expect, describe, it} from "vitest";
import {parseRobot, Robot, solvePart1, XY} from "./day14.js";
import {Sequence} from "generator-sequences";

const mod = (a: number, b: number) => ((a % b) + b) % b;

function positionAfter(robot: Robot, room: XY, seconds: number) {
    const xMove = robot.p.x + (robot.v.x * seconds)
    const xWrapped =  mod(xMove, room.x);
    const yMove = robot.p.y + (robot.v.y * seconds)
    const yWrapped =  mod(yMove, room.y);
    return { x: xWrapped, y: yWrapped };
}

function quadrant(pos: XY, room: XY): number | null {
    const xMid = Math.floor(room.x / 2);
    const yMid = Math.floor(room.y / 2);
    if (pos.x < xMid && pos.y < yMid) return 1;
    if (pos.x > xMid && pos.y < yMid) return 2;
    if (pos.x < xMid && pos.y > yMid) return 3;
    if (pos.x > xMid && pos.y > yMid) return 4;
    return null;
}

describe("Part 1", () => {
    it("Parses robot", async () => {
        expect(parseRobot("p=0,4 v=3,-3")).toStrictEqual(
            {p: {x:0, y:4}, v: {x:3, y:-3}}
        );
    });

    it("Calculates position", async () => {
        const robot = parseRobot("p=2,4 v=2,-3");
        const room = {x: 11, y: 7};
        expect(positionAfter(robot, room, 0)).toStrictEqual({x: 2, y: 4});
        expect(positionAfter(robot, room, 1)).toStrictEqual({x: 4, y: 1});
        expect(positionAfter(robot, room, 2)).toStrictEqual({x: 6, y: 5});
    });

    it("Identifies quadrant", async () => {
        const room = {x: 11, y: 7};
        expect(quadrant({x:0, y:2}, room)).toBe(1);
        expect(quadrant({x:6, y:0}, room)).toBe(2);
        expect(quadrant({x:5, y:4}, room)).toBeNull();
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "p=0,4 v=3,-3",
            "p=6,3 v=-1,-3",
            "p=10,3 v=-1,2",
            "p=2,0 v=2,-1",
            "p=0,0 v=1,3",
            "p=3,0 v=-2,-2",
            "p=7,6 v=-1,-3",
            "p=3,0 v=-1,-2",
            "p=9,3 v=2,3",
            "p=7,3 v=-1,2",
            "p=2,4 v=2,-3",
            "p=9,5 v=-3,-3",
        ]);
        expect(await solvePart1(lines)).toBe(12);
    });
});
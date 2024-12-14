import {describe, expect, it} from "vitest";
import {parseRobot, positionAfter, quadrant, solvePart1} from "./day14.js";
import {Sequence} from "generator-sequences";

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
        const room = {x: 11, y: 7};
        const seconds = 100;
        expect(await solvePart1(lines, room, seconds)).toBe(12);
    });
});
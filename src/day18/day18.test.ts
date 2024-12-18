import {expect, describe, it} from "vitest";
import {solvePart1, solvePart2} from "./day18.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Solves example", async () => {
        const lines = new Sequence([
            "5,4",
            "4,2",
            "4,5",
            "3,0",
            "2,1",
            "6,3",
            "2,4",
            "1,5",
            "0,6",
            "3,3",
            "2,6",
            "5,1",
            "1,2",
            "5,5",
            "2,5",
            "6,5",
            "1,4",
            "0,4",
            "6,4",
            "1,1",
            "6,1",
            "1,0",
            "0,5",
            "1,6",
            "2,0",
        ]);
        const goal = {x: 6, y: 6};
        const byteLimit = 12;
        expect(await solvePart1(lines, goal, byteLimit)).toBe(22);
    });
});

describe("Part 2", () => {
    it("Solves example", async () => {
        const lines = new Sequence([
            "5,4",
            "4,2",
            "4,5",
            "3,0",
            "2,1",
            "6,3",
            "2,4",
            "1,5",
            "0,6",
            "3,3",
            "2,6",
            "5,1",
            "1,2",
            "5,5",
            "2,5",
            "6,5",
            "1,4",
            "0,4",
            "6,4",
            "1,1",
            "6,1",
            "1,0",
            "0,5",
            "1,6",
            "2,0",
        ]);
        const goal = {x: 6, y: 6};
        const byteLimit = 12;
        expect(await solvePart2(lines, goal, byteLimit)).toBe("6,1");
    });
});
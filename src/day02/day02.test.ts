import {expect, describe, it} from "vitest";
import {isSafe, parseReport, solvePart1, solvePart2} from "./day02.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Parses reports", () => {
        expect(parseReport("7 6 4 2 1")).toStrictEqual([7, 6, 4, 2, 1]);
    });

    it("Identifies safe reports", () => {
        expect(isSafe([7, 6, 4, 2, 1])).toBe(true);
        expect(isSafe([1, 3, 2, 4, 5])).toBe(false);
    });

    it("Solves example", async () => {
        const input = new Sequence([
            "7 6 4 2 1",
            "1 2 7 8 9",
            "9 7 6 2 1",
            "1 3 2 4 5",
            "8 6 4 4 1",
            "1 3 6 7 9",
        ]);
        expect(await solvePart1(input)).toBe(2);
    });
});

describe("Part 2", () => {
    it("Uses dampener", () => {
        expect(isSafe([1, 2, 7, 8, 9], true)).toBe(false);
    });

    it("Solves example", async () => {
        const input = new Sequence([
            "7 6 4 2 1",
            "1 2 7 8 9",
            "9 7 6 2 1",
            "1 3 2 4 5",
            "8 6 4 4 1",
            "1 3 6 7 9",
        ]);
        expect(await solvePart2(input)).toBe(4);
    });
});
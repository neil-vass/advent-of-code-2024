import {expect, describe, it} from "vitest";
import {countOccurrences, parseLine, solvePart1, solvePart2} from "./day01.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Parses line", () => {
        expect(parseLine("3   4")).toStrictEqual([3, 4]);
    });

    it("Solves example", async () => {
        const input = new Sequence([
            "3   4",
            "4   3",
            "2   5",
            "1   3",
            "3   9",
            "3   3",
        ]);
        expect(await solvePart1(input)).toBe(11);
    });
});

describe("Part 2", () => {
    it("Counts occurrences", () => {
        const list = [4, 3, 5, 3, 3];
        expect(countOccurrences(list)).toStrictEqual({
            4: 1,
            3: 3,
            5: 1
        });
    });

    it("Solves example", async () => {
        const input = new Sequence([
            "3   4",
            "4   3",
            "2   5",
            "1   3",
            "3   9",
            "3   3",
        ]);
        expect(await solvePart2(input)).toBe(31);
    });
});
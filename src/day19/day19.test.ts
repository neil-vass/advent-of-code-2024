import {expect, describe, it} from "vitest";
import {availableTowels, isPossible, solvePart1} from "./day19.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Checks designs are possible", () => {
        const towels = availableTowels("r, wr, b, g, bwu, rb, gb, br");
        expect(isPossible("brwrr", towels)).toBe(true);
        expect(isPossible("bbrgwb", towels)).toBe(false);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "r, wr, b, g, bwu, rb, gb, br",
            "",
            "brwrr",
            "bggr",
            "gbbr",
            "rrbgbr",
            "ubwu",
            "bwurrg",
            "brgr",
            "bbrgwb",
        ]);
        expect(await solvePart1(lines)).toBe(6);
    });
});
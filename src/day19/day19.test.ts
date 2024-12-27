import {expect, describe, it} from "vitest";
import {
    availableTowels,
    isPossible,
    letMeCountTheWays,
    solvePart1,
    solvePart2
} from "./day19.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Only keeps towels we can't make from smaller ones.", () => {
        const towels = availableTowels("r, wr, b, g, bwu, rb, gb, br");
        expect(towels.join(", ")).toBe("r, b, g, wr, bwu")
    });

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

describe("Part 2", () => {
    it("Counts simple ways to make a pattern", () => {
        const towels = "r, b, rb".split(", ");
        expect(letMeCountTheWays("r", towels)).toBe(1);
        expect(letMeCountTheWays("rb", towels)).toBe(2);
    });

    it("Counts example's ways to make a pattern", () => {
        const towels = "r, wr, b, g, bwu, rb, gb, br".split(", ");
        expect(letMeCountTheWays("brwrr", towels)).toBe(2);
        expect(letMeCountTheWays("bggr", towels)).toBe(1);
        expect(letMeCountTheWays("gbbr", towels)).toBe(4);
        expect(letMeCountTheWays("rrbgbr", towels)).toBe(6);
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
        expect(await solvePart2(lines)).toBe(16);
    });
});
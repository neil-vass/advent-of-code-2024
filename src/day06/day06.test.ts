import {expect, describe, it} from "vitest";
import {solvePart1, solvePart2} from "./day06.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Solves one line", async () => {
        const lines = new Sequence([
            "..>..",
        ]);
        expect(await solvePart1(lines)).toBe(3);
    });

    it("Turns at blocks", async () => {
        const lines = new Sequence([
            "..>..#..",
            "..#.....",
            "..#.....",
        ]);
        expect(await solvePart1(lines)).toBe(5);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "....#.....",
            ".........#",
            "..........",
            "..#.......",
            ".......#..",
            "..........",
            ".#..^.....",
            "........#.",
            "#.........",
            "......#...",
        ]);
        expect(await solvePart1(lines)).toBe(41);
    });
});

describe("Part 2", () => {
    it("Solves example", async () => {
        const lines = new Sequence([
            "....#.....",
            ".........#",
            "..........",
            "..#.......",
            ".......#..",
            "..........",
            ".#..^.....",
            "........#.",
            "#.........",
            "......#...",
        ]);
        expect(await solvePart2(lines)).toBe(6);
    });
});
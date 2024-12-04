import {expect, describe, it} from "vitest";
import {solvePart1, solvePart2} from "./day04.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Finds xmases", async () => {
        const lines = new Sequence([
            "..XMAS...XS.X...",
            "..SAMX...MA..M..",
            ".........AM...A.",
            ".........SX....S",
        ]);
        expect(await solvePart1(lines)).toBe(5);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "MMMSXXMASM",
            "MSAMXMSMSA",
            "AMXSXMAAMM",
            "MSAMASMSMX",
            "XMASAMXAMM",
            "XXAMMXXAMA",
            "SMSMSASXSS",
            "SAXAMASAAA",
            "MAMMMXMMMM",
            "MXMXAXMASX",
        ])
        expect(await solvePart1(lines)).toBe(18);
    });
});

describe("Part 2", () => {
    it("Finds x-mases", async () => {
        const lines = new Sequence([
            "M.S",
            ".A.",
            "M.S"
        ]);
        expect(await solvePart2(lines)).toBe(1);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            ".M.S......",
            "..A..MSMS.",
            ".M.S.MAA..",
            "..A.ASMSM.",
            ".M.S.M....",
            "..........",
            "S.S.S.S.S.",
            ".A.A.A.A..",
            "M.M.M.M.M.",
            "..........",
        ]);
        expect(await solvePart2(lines)).toBe(9);
    });
});
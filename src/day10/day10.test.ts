import {expect, describe, it} from "vitest";
import {solvePart1, solvePart2} from "./day10.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Solves simple example", async () => {
        const lines = new Sequence([
            "...0...",
            "...1...",
            "...2...",
            "6543456",
            "7.....7",
            "8.....8",
            "9.....9",
        ]);
        expect(await solvePart1(lines)).toBe(2);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "89010123",
            "78121874",
            "87430965",
            "96549874",
            "45678903",
            "32019012",
            "01329801",
            "10456732",
        ]);
        expect(await solvePart1(lines)).toBe(36);
    });
});

describe("Part 2", () => {
    it("Solves example", async () => {
        const lines = new Sequence([
            "89010123",
            "78121874",
            "87430965",
            "96549874",
            "45678903",
            "32019012",
            "01329801",
            "10456732",
        ]);
        expect(await solvePart2(lines)).toBe(81);
    });
});
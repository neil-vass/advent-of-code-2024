import {expect, describe, it} from "vitest";
import {solvePart1, solvePart2} from "./day12.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Solves tiny example", async () => {
        const lines = new Sequence([
            "AA"
        ]);
        expect(await solvePart1(lines)).toBe(12);
    });

    it("Solves small example", async () => {
        const lines = new Sequence([
            "AAAA",
            "BBCD",
            "BBCC",
            "EEEC",
        ]);
        expect(await solvePart1(lines)).toBe(140);
    });

    it("Solves for enclosed regions", async () => {
        const lines = new Sequence([
            "OOOOO",
            "OXOXO",
            "OOOOO",
            "OXOXO",
            "OOOOO",
        ]);
        expect(await solvePart1(lines)).toBe(772);
    });

});


describe("Part 2", () => {
    it("Solves tiny example", async () => {
        const lines = new Sequence([
            "AA"
        ]);
        expect(await solvePart2(lines)).toBe(8);
    });

    it("Solves first example", async () => {
        const lines = new Sequence([
            "AAAA",
            "BBCD",
            "BBCC",
            "EEEC",
        ]);
        expect(await solvePart2(lines)).toBe(80);
    });

    it("Solves E-shaped example", async () => {
        const lines = new Sequence([
            "EEEEE",
            "EXXXX",
            "EEEEE",
            "EXXXX",
            "EEEEE",
        ]);
        expect(await solvePart2(lines)).toBe(236);
    });

    it("Solves Möbius example", async () => {
        const lines = new Sequence([
            "AAAAAA",
            "AAABBA",
            "AAABBA",
            "ABBAAA",
            "ABBAAA",
            "AAAAAA",
        ]);
        expect(await solvePart2(lines)).toBe(368);
    });

    it("Solves larger example", async () => {
        const lines = new Sequence([
            "RRRRIICCFF",
            "RRRRIICCCF",
            "VVRRRCCFFF",
            "VVRCCCJFFF",
            "VVVVCJJCFE",
            "VVIVCCJJEE",
            "VVIIICJJEE",
            "MIIIIIJJEE",
            "MIIISIJEEE",
            "MMMISSJEEE",
        ]);
        expect(await solvePart2(lines)).toBe(1206);
    });

    it("Solves edge case", async () => {
        // Early version was failing on this.
        const lines = new Sequence([
            "AAAA",
            "...A",
            ".A.A",
            ".AAA",
            ".A__",
        ]);
        expect(await solvePart2(lines)).toBe(196);
    });
});
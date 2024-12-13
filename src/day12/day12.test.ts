import {expect, describe, it} from "vitest";
import {solvePart1} from "./day12.js";
import {Sequence} from "generator-sequences";

describe("Part 2", () => {
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
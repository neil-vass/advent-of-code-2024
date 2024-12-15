import {expect, describe, it} from "vitest";
import {solvePart1, solvePart2, Warehouse} from "./day15.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Solves smaller example", async () => {
        const lines = new Sequence([
            "########",
            "#..O.O.#",
            "##@.O..#",
            "#...O..#",
            "#.#.O..#",
            "#...O..#",
            "#......#",
            "########",
            "",
            "<^^>>>vv<v>>v<<"
        ]);
        expect(await solvePart1(lines)).toBe(2028);
    });
});

describe("Part 2", () => {
    it("Solves smaller example", async () => {
        const lines = new Sequence([
            "#######",
            "#...#.#",
            "#.....#",
            "#..OO@#",
            "#..O..#",
            "#.....#",
            "#######",
            "",
            "<vv<<^^<<^^"
        ]);
        expect(await solvePart2(lines)).toBe(0); // not sure what to expect
    });
});
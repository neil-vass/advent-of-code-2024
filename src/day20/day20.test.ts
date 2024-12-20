import {expect, describe, it, beforeEach} from "vitest";
import {Racetrack, solvePart1} from "./day20.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    let lines: Sequence<string>;
    beforeEach(() => {
        lines = new Sequence([
            "###############",
            "#...#...#.....#",
            "#.#.#.#.#.###.#",
            "#S#...#.#.#...#",
            "#######.#.#.###",
            "#######.#.#...#",
            "#######.#.###.#",
            "###..E#...#...#",
            "###.#######.###",
            "#...###...#...#",
            "#.#####.#.###.#",
            "#.#...#.#.#...#",
            "#.#.#.#.#.#.###",
            "#...#...#...###",
            "###############",
        ]);
    })

    it("Finds distance without cheats", async () => {
        const racetrack = await Racetrack.buildFromDescription(lines);
        expect(racetrack.distance()).toBe(84);
    });

    it("Finds cheats", async () => {
        const racetrack = await Racetrack.buildFromDescription(lines);
        const minSavingRequired = 12;
        expect(racetrack.findCheats(12)).toBe(8);
    });
});
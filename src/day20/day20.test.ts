import {expect, describe, it} from "vitest";
import {Racetrack, solvePart1} from "./day20.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Finds distance without cheats", async () => {
        const lines = new Sequence([
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
        const racetrack = await Racetrack.buildFromDescription(lines);
        return racetrack.distance();
    });
});
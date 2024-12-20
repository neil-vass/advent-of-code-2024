import {expect, describe, it, beforeEach} from "vitest";
import {Racetrack} from "./day20.js";
import {Sequence} from "generator-sequences";

describe("Both parts!", () => {
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

    it("Finds cheats (part 1)", async () => {
        const racetrack = await Racetrack.buildFromDescription(lines);
        const minSavingRequired = 12;
        expect(racetrack.findCheats(minSavingRequired)).toBe(8);
    });

    it("Finds big cheats (part 2)", async () => {
        const racetrack = await Racetrack.buildFromDescription(lines);
        const minSavingRequired = 72;
        const maxCheatDistance = 20;
        expect(racetrack.findCheats(minSavingRequired, maxCheatDistance)).toBe(29);
    });
});
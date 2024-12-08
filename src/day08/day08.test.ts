import {describe, expect, it} from "vitest";
import {AntennaAnalyser, pairsWithSignificantOrder, solvePart1, solvePart2} from "./day08.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Provides pairs", () => {
        expect([...pairsWithSignificantOrder([0,1,2])]).toStrictEqual([
            [0,1],
            [0,2],
            [1,0],
            [1,2],
            [2,0],
            [2,1]
        ])
    });

    it("Solves for 2 matching antennas", async () => {
        const lines = new Sequence([
            "..........",
            "..........",
            "..........",
            "....a.....",
            "..........",
            ".....a....",
            "..........",
            "..........",
            "..........",
            "..........",
        ]);
        const sut = await AntennaAnalyser.buildFromDescription(lines);
        expect(sut.findAntinodeLocations()).toStrictEqual(
            [{x:3, y:1}, {x:6, y:7}]);
    });

    it("Solves for 3 matching antennas", async () => {
        const lines = new Sequence([
            "..........",
            "..........",
            "..........",
            "....a.....",
            "........a.",
            ".....a....",
            "..........",
            "..........",
            "..........",
            "..........",
        ]);
        const sut = await AntennaAnalyser.buildFromDescription(lines);
        expect(sut.findAntinodeLocations().length).toBe(4);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "............",
            "........0...",
            ".....0......",
            ".......0....",
            "....0.......",
            "......A.....",
            "............",
            "............",
            "........A...",
            ".........A..",
            "............",
            "............",
        ]);
        expect(await solvePart1(lines)).toBe(14);
    });
});


describe("Part 2", () => {
    it("Solves for 3 matching antennas", async () => {
        const lines = new Sequence([
            "T.........",
            "...T......",
            ".T........",
            "..........",
            "..........",
            "..........",
            "..........",
            "..........",
            "..........",
            "..........",
        ]);
        expect(await solvePart2(lines)).toBe(9);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "............",
            "........0...",
            ".....0......",
            ".......0....",
            "....0.......",
            "......A.....",
            "............",
            "............",
            "........A...",
            ".........A..",
            "............",
            "............",
        ]);
        expect(await solvePart2(lines)).toBe(34);
    });
});
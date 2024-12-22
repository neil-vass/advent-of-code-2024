import {describe, expect, it} from "vitest";
import {directionKeymap, enterCode, Keypad, numericKeymap, reversePath, solvePart1} from "./day21.js";
import {Sequence} from "generator-sequences";


describe("Part 1", () => {
    it("Reverses paths", () => {
        expect(reversePath("^^<")).toBe("vv>");
        expect(reversePath(">>v<")).toBe("<<^>");
    });

    it("Knows paths between buttons", () => {
        const nums = new Keypad(numericKeymap);
        expect(nums.currentKey).toBe("A");
        expect(nums.shortestPathsTo("0")).toStrictEqual(["<"]);
        nums.currentKey = "5";
        expect(nums.shortestPathsTo("3")).toStrictEqual(["v>", ">v"]);
    });

    it("Finds shortest path for chain of keypads", () => {
        const chain = [
            new Keypad(directionKeymap), // me
            new Keypad(directionKeymap), // robot
            new Keypad(directionKeymap), // robot
            new Keypad(numericKeymap) // robot at the door
        ];
        const presses = enterCode("029A", chain);
        expect(presses[0].length).toBe(68);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "029A",
            "980A",
            "179A",
            "456A",
            "379A",
        ]);
        expect(await solvePart1(lines)).toBe(126384);
    });
});
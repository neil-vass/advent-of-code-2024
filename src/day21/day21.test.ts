import {describe, expect, it} from "vitest";
import {
    costToEnterCode,
    directionKeymap,
    Keypad,
    numericKeymap,
    reversePath,
    solve
} from "./day21.js";
import {Sequence} from "generator-sequences";


describe("Part 1", () => {
    it("Reverses paths", () => {
        expect(reversePath("^^<")).toBe(">vv");
        expect(reversePath(">>v<")).toBe(">^<<");
    });

    it("Knows paths between buttons", () => {
        const nums = new Keypad(numericKeymap);
        expect(nums.currentKey).toBe("A");
        expect(nums.shortestPathsTo("0")).toStrictEqual(["<"]);
        nums.currentKey = "5";
        expect(nums.shortestPathsTo("3")).toStrictEqual([">v", "v>"]);
    });

    it("Finds length of shortest sequence for 1 keypad", () => {
        const chain = [
            new Keypad(numericKeymap), // robot at the door
        ];
        const presses = costToEnterCode("029A", chain);
        expect(presses).toBe(12);
    });

    it("Finds length of shortest sequence for 2 keypads", () => {
        const chain = [
            new Keypad(numericKeymap), // robot at the door
            new Keypad(directionKeymap), // robot
        ];
        const presses = costToEnterCode("029A", chain);
        expect(presses).toBe(28);
    });

    it("Finds length of shortest sequence for chain of keypads", () => {
        const chain = [
            new Keypad(numericKeymap), // robot at the door
            new Keypad(directionKeymap), // robot
            new Keypad(directionKeymap), // robot
        ];
        const presses = costToEnterCode("029A", chain);
        expect(presses).toBe(68);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "029A",
            "980A",
            "179A",
            "456A",
            "379A",
        ]);
        expect(await solve(lines)).toBe(126384);
    });
});
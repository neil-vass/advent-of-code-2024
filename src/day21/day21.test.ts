import {describe, expect, it} from "vitest";
import {
    directionKeymap,
    enterCode,
    Keypad,
    numericKeymap,
    reversePath,
    sequenceNeededToEnterCode,
    solvePart1
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

    it("Finds shortest sequence for 1 keypad", () => {
        const chain = [
            new Keypad(numericKeymap), // robot at the door
        ];
        const presses = sequenceNeededToEnterCode("029A", chain);
        expect(presses.length).toBe(12);
        expect(presses).toBe("<A^A^^>AvvvA"); // Not the same as example, but same length and outcome.
    });

    it("Finds shortest sequence for 2 keypads", () => {
        const chain = [
            new Keypad(numericKeymap), // robot at the door
            new Keypad(directionKeymap), // robot
        ];
        const presses = sequenceNeededToEnterCode("029A", chain);
        expect(presses.length).toBe(28);
        expect(presses).toBe("v<<A>>^A<A>A<AAv>A^Av<AAA>^A"); // Not the same as example, but same length and outcome.
    });

    // v<<A >>^A <A >A <A A v>A ^A v<A A A >^A
    //     +---+---+
    //     | ^ | A |
    // +---+---+---+
    // | < | v | > |
    // +---+---+---+
    // <A^A^^>AvvvA
    // <A^A^^>AvvvA

    it("Finds shortest path for chain of keypads", () => {
        const chain = [
            new Keypad(numericKeymap), // robot at the door
            new Keypad(directionKeymap), // robot
            new Keypad(directionKeymap), // robot
        ];
        const presses = sequenceNeededToEnterCode("029A", chain);
        expect(presses.length).toBe(68); // Mine's 1 char longer. *SO*, correct implementation but not choosing shortest.
        expect(presses).toBe("<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A");
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
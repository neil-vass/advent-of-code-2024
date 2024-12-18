import {expect, describe, it} from "vitest";
import {Computer, solvePart1, solvePart2} from "./day17.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Runs bst", async () => {
        const lines = new Sequence([
            "Register A: 0",
            "Register B: 0",
            "Register C: 9",
            "",
            "Program: 2,6",
        ]);
        const computer = await Computer.buildFromDescription(lines);
        computer.run();
        expect(computer.getRegisterValues().b).toBe(1);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "Register A: 729",
            "Register B: 0",
            "Register C: 0",
            "",
            "Program: 0,1,5,4,3,0",
        ]);
        expect(await solvePart1(lines)).toBe("4,6,3,5,6,3,5,2,1,0");
    });
});

describe("Part 2", () => {
    it("Solves example", async () => {
        const lines = new Sequence([
            "Register A: 2024",
            "Register B: 0",
            "Register C: 0",
            "",
            "Program: 0,3,5,4,3,0",
        ]);
        expect(await solvePart2(lines)).toBe(117440);
    });
});
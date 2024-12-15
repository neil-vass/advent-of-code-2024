import {expect, describe, it} from "vitest";
import {Machine, solvePart1} from "./day13.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Creates machine", () => {
        const lines = [
            "Button A: X+94, Y+34",
            "Button B: X+22, Y+67",
            "Prize: X=8400, Y=5400",
        ];
        const machine = Machine.buildFromDescription(lines);
        expect(machine.canWin).toBe(true);
        expect(machine.cheapestWin).toBe(280);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "Button A: X+94, Y+34",
            "Button B: X+22, Y+67",
            "Prize: X=8400, Y=5400",
            "",
            "Button A: X+26, Y+66",
            "Button B: X+67, Y+21",
            "Prize: X=12748, Y=12176",
            "",
            "Button A: X+17, Y+86",
            "Button B: X+84, Y+37",
            "Prize: X=7870, Y=6450",
            "",
            "Button A: X+69, Y+23",
            "Button B: X+27, Y+71",
            "Prize: X=18641, Y=10279",
        ]);
        expect(await solvePart1(lines)).toBe(480);
    });
});
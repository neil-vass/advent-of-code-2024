import {expect, describe, it} from "vitest";
import {singleStoneBlink, solvePart1, stonesAfter} from "./day11.js";

describe("Part 1", () => {
    it("Uses single stone rules", async () => {
        expect(singleStoneBlink(0)).toStrictEqual([1]);
        expect(singleStoneBlink(1)).toStrictEqual([2024]);
        expect(singleStoneBlink(10)).toStrictEqual([1, 0]);
        expect(singleStoneBlink(99)).toStrictEqual([9, 9]);
        expect(singleStoneBlink(999)).toStrictEqual([2021976]);
        expect(singleStoneBlink(253000)).toStrictEqual([253, 0]);
    });

    it("Runs multiple blinks", async () => {
        expect(stonesAfter([125, 17], 6)).toBe(22);
    });

    it("Solves example", async () => {
        expect(solvePart1("125 17", 25)).toBe(55312);
    });
});
import {describe, expect, it} from "vitest";
import {add, con, couldBeTrue, mul, parseLine, solvePart1, solvePart2} from "./day07.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Parses lines", () => {
        expect(parseLine("190: 10 19")).toStrictEqual([190, [10,19]]);
    });

    it("Checks single equations", () => {
        expect(couldBeTrue(190, [10,19], [add, mul])).toBe(true);
        expect(couldBeTrue(3267, [81, 40, 27], [add, mul])).toBe(true);
        expect(couldBeTrue(83, [17, 5], [add, mul])).toBe(false);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "190: 10 19",
            "3267: 81 40 27",
            "83: 17 5",
            "156: 15 6",
            "7290: 6 8 6 15",
            "161011: 16 10 13",
            "192: 17 8 14",
            "21037: 9 7 18 13",
            "292: 11 6 16 20",
        ]);
        expect(await solvePart1(lines)).toBe(3749);
    });
});

describe("Part 2", () => {
    it("Applies concatenation", () => {
        const ops = [add, mul, con];
        expect(couldBeTrue(156, [15, 6], ops)).toBe(true);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "190: 10 19",
            "3267: 81 40 27",
            "83: 17 5",
            "156: 15 6",
            "7290: 6 8 6 15",
            "161011: 16 10 13",
            "192: 17 8 14",
            "21037: 9 7 18 13",
            "292: 11 6 16 20",
        ]);
        expect(await solvePart2(lines)).toBe(11387);
    });
});
import {describe, expect, it} from "vitest";
import {pricesAndChanges, secret, solvePart1, solvePart2} from "./day22.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Finds secret numbers", () => {
        expect(secret(123)).toBe(15887950);
        expect(secret(123, 10)).toBe(5908254);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "1",
            "10",
            "100",
            "2024",
        ]);
        expect(await solvePart1(lines)).toBe(37327623);
    });
});

describe("Part 2", () => {
    it("Finds prices and changes", () => {
        expect(pricesAndChanges(123, 10)).toStrictEqual([
            [3, null],
            [0, -3],
            [6, 6],
            [5, -1],
            [4, -1],
            [4, 0],
            [6, 2],
            [4, -2],
            [4, 0],
            [2, -2],
        ]);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "1",
            "10",
            "100",
            "2024",
        ]);
        expect(await solvePart2(lines)).toBe(23);
    });
});


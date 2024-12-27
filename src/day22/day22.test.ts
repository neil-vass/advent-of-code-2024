import {describe, expect, it} from "vitest";
import {populateDiffMap, secret, solvePart1, solvePart2} from "./day22.js";
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
        const diffMap = new Map<string, number>();
        populateDiffMap(123, 5, diffMap);
        expect([...diffMap]).toStrictEqual([
            ["[-3,6,-1,-1]", 4],
            ["[6,-1,-1,0]", 4],
        ]);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "1",
            "2",
            "3",
            "2024",
        ]);
        expect(await solvePart2(lines)).toBe(23);
    });
});


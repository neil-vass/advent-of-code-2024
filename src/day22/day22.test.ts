import {describe, expect, it} from "vitest";
import {secret, solvePart1} from "./day22.js";
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
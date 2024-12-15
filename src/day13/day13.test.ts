import {expect, describe, it} from "vitest";
import {solvePart1} from "./day13.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Solves example", async () => {
        const lines = new Sequence([]);
        expect(await solvePart1(lines)).toBe("a real test");
    });
});
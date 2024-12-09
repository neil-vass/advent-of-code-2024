import {describe, expect, it} from "vitest";
import {checksumFor} from "./day09.js";


describe("Part 1", () => {
    it("Solves example", async () => {
        const diskMap = "2333133121414131402";
        expect(checksumFor(diskMap)).toBe(1928);
    });
});

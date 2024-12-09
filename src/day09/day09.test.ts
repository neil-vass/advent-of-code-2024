import {describe, expect, it} from "vitest";
import {checksumFor, checksumForV2} from "./day09.js";


describe("Part 1", () => {
    it("Solves example", async () => {
        const diskMap = "2333133121414131402";
        expect(checksumFor(diskMap)).toBe(1928);
    });
});


describe("Part 2", () => {
    it("Solves example", async () => {
        const diskMap = "2333133121414131402";
        expect(checksumForV2(diskMap)).toBe(2858);
    });

    it("Edge case", async () => {
        const diskMap = "12345";
        expect(checksumForV2(diskMap)).toBe(132);
    });
});
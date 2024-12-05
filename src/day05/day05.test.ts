import {expect, describe, it} from "vitest";
import {correctOrdering, solvePart1, solvePart2} from "./day05.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Solves example", async () => {
        const lines = new Sequence([
            "47|53",
            "97|13",
            "97|61",
            "97|47",
            "75|29",
            "61|13",
            "75|53",
            "29|13",
            "97|29",
            "53|29",
            "61|53",
            "97|53",
            "61|29",
            "47|13",
            "75|47",
            "97|75",
            "47|61",
            "75|61",
            "47|29",
            "75|13",
            "53|13",
            "",
            "75,47,61,53,29",
            "97,61,53,29,13",
            "75,29,13",
            "75,97,47,61,53",
            "61,13,29",
            "97,13,75,29,47",
        ]);
        expect(await solvePart1(lines)).toBe(143);
    });
});

describe("Part 2", () => {
    it("Corrects ordering", () => {
        const ordering = {
            '29': new Set(['13']),
            '47': new Set(['53', '13', '61', '29']),
            '53': new Set(['29', '13']),
            '61': new Set(['13', '53', '29']),
            '75': new Set(['29', '53', '47', '61', '13']),
            '97': new Set(['13', '61', '47', '29', '53', '75'])
    }
        expect(correctOrdering(["75","97","47","61","53"], ordering)).toStrictEqual(
            ["97","75","47","61","53"]);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "47|53",
            "97|13",
            "97|61",
            "97|47",
            "75|29",
            "61|13",
            "75|53",
            "29|13",
            "97|29",
            "53|29",
            "61|53",
            "97|53",
            "61|29",
            "47|13",
            "75|47",
            "97|75",
            "47|61",
            "75|61",
            "47|29",
            "75|13",
            "53|13",
            "",
            "75,47,61,53,29",
            "97,61,53,29,13",
            "75,29,13",
            "75,97,47,61,53",
            "61,13,29",
            "97,13,75,29,47",
        ]);
        expect(await solvePart2(lines)).toBe(123);
    });
});
import {expect, describe, it, beforeEach} from "vitest";
import {solvePart1, solvePart2} from "./day23.js";
import {Sequence} from "generator-sequences";
import {before} from "node:test";

describe("Both parts", () => {
    let lines: Sequence<string>;
    beforeEach(() => {
        lines = new Sequence([
            "kh-tc",
            "qp-kh",
            "de-cg",
            "ka-co",
            "yn-aq",
            "qp-ub",
            "cg-tb",
            "vc-aq",
            "tb-ka",
            "wh-tc",
            "yn-cg",
            "kh-ub",
            "ta-co",
            "de-co",
            "tc-td",
            "tb-wq",
            "wh-td",
            "ta-ka",
            "td-qp",
            "aq-cg",
            "wq-ub",
            "ub-vc",
            "de-ta",
            "wq-aq",
            "wq-vc",
            "wh-yn",
            "ka-de",
            "kh-ta",
            "co-tc",
            "wh-qp",
            "tb-vc",
            "td-yn",
        ]);
    });

    it("Solves part 1 example", async () => {
        expect(await solvePart1(lines)).toBe(7);
    });

    it("Solves part 2 example", async () => {
        expect(await solvePart2(lines)).toBe("co,de,ka,ta");
    });
});
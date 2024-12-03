import {describe, expect, it} from "vitest";
import {sumOfMuls, sumOfMulsWithConditionals} from "./day03.js";

describe("Part 1", () => {
    it("Solves example", () => {
        const line = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";
        expect(sumOfMuls(line)).toBe(161);
    });
});

describe("Part 2", () => {
    it("Solves example", () => {
        const line = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";
        expect(sumOfMulsWithConditionals(line)).toBe(48);
    });
});

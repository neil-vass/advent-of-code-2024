import {describe, expect, it} from "vitest";
import {sumOfMuls} from "./day03.js";

describe("Part 1", () => {
    it("Solves example", () => {
        const line = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";
        expect(sumOfMuls(line)).toBe(161);
    });
});
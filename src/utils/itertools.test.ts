import {describe, expect, it} from "vitest";
import {combinations} from "./itertools.js";

describe("combinations", () => {
    it("Provides pairs", () => {
        expect([...combinations([0, 1, 2], 2)]).toStrictEqual([
            [0, 1],
            [0, 2],
            [1, 2]
        ])
    });
});
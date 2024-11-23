import {expect, describe, it} from "vitest";
import {fn} from "./day01.js";

describe("#fn", () => {
    it("runs", () => {
        expect(fn("")).toBe("a real test");
    });
});
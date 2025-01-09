import {expect, describe, it} from "vitest";
import {Circuit} from "./delete.js";

const sampleInput = [
    "123 -> x",
    "456 -> y",
    "x AND y -> d",
    "x OR y -> e",
    "x LSHIFT 2 -> f",
    "y RSHIFT 2 -> g",
    "NOT x -> h",
    "NOT y -> i"
]

describe("Circuit class logic components for unsigned 16 bit integers", () => {
    it("#andGate", () => {
        expect(Circuit.andGate(123, 456)).toBe(72);
    });

    it("#orGate", () => {
        expect(Circuit.orGate(123, 456)).toBe(507);
    });

    it("#lshift", () => {
        expect(Circuit.lshift(123, 2)).toBe(492);
    });

    it("#rshift", () => {
        expect(Circuit.rshift(456, 2)).toBe(114);
    });

    it("#notGate", () => {
        expect(Circuit.notGate(123)).toBe(65412);
        expect(Circuit.notGate(456)).toBe(65079);
    });
});

describe("Circuit class", () => {
    it("Sets signals", () => {
        const circuit = new Circuit();
        circuit.connect("123 -> x");
        circuit.connect("456 -> y");

        expect(circuit.signalOn("x")).toBe(123);
        expect(circuit.signalOn("y")).toBe(456);
    });

    it("Applies AND gates", () => {
        const circuit = new Circuit();
        circuit.connect("123 -> x");
        circuit.connect("456 -> y");
        circuit.connect("x AND y -> d");
        expect(circuit.signalOn("d")).toBe(72);
    });

    it("Builds a complete circuit", async () => {
        const circuit = new Circuit();
        await circuit.build([
            "123 -> x",
            "456 -> y",
            "x AND y -> d",
            "x OR y -> e",
            "x LSHIFT 2 -> f",
            "y RSHIFT 2 -> g",
            "NOT x -> h",
            "NOT y -> i"
        ]);

        expect(circuit.signalOn("d")).toBe(72);
        expect(circuit.signalOn("e")).toBe(507);
        expect(circuit.signalOn("f")).toBe(492);
        expect(circuit.signalOn("g")).toBe(114);
        expect(circuit.signalOn("h")).toBe(65412);
        expect(circuit.signalOn("i")).toBe(65079);
        expect(circuit.signalOn("x")).toBe(123);
        expect(circuit.signalOn("y")).toBe(456);
    });
});


import {expect, describe, it} from "vitest";
import {Computer, solvePart1, solvePart2} from "./day17.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Runs bst", async () => {
        const lines = new Sequence([
            "Register A: 0",
            "Register B: 0",
            "Register C: 9",
            "",
            "Program: 2,6",
        ]);
        const computer = await Computer.buildFromDescription(lines);
        computer.run();
        expect(computer.getRegisterValues().b).toBe(1);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "Register A: 729",
            "Register B: 0",
            "Register C: 0",
            "",
            "Program: 0,1,5,4,3,0",
        ]);
        expect(await solvePart1(lines)).toBe("4,6,3,5,6,3,5,2,1,0");
    });
});

describe("Part 2", () => {
    it("Runs binary operations", async () => {
        const lines = new Sequence([
            "Register A: 0",
            "Register B: 0",
            "Register C: 0",
            "",
            "Program: 2,4,1,3,7,5,1,5,0,3,4,2,5,5,3,0",
        ]);
        const computer = await Computer.buildFromDescription(lines);
        const bVals = computer.getProgram().split(",").map(Number).map(n => n.toString(2).padStart(3,"0"))
        console.log(bVals.join("\n"))
        // let val = 0b0;
        // for (const i of [0b111111,0b100100, 0b101010]) {
        //     const thisNum = val+i;
        //     const asStr = thisNum.toString(2).padStart(3,"0");
        //     computer.setRegisterValues({a: thisNum, b:thisNum, c:0});
        //     computer.bst(5);
        //     const reg = computer.getRegisterValues().b.toString(2).padStart(6,"0");
        //     console.log(`${thisNum}: ${asStr}, ${reg}`)
        // }

    });
});
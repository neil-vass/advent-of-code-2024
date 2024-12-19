import {linesFromFile, Sequence} from "generator-sequences";

export class Computer {
    private instructionPointer = 0;
    private output: number[] = [];

    private constructor(private a: number,
                        private b: number,
                        private c: number,
                        readonly instructions: number[]) {}

    static async buildFromDescription(lines: Sequence<string>) {
        const linesArray = await lines.toArray();

        const a = +(linesArray[0].split(": ")[1]);
        const b = +(linesArray[1].split(": ")[1]);
        const c = +(linesArray[2].split(": ")[1]);

        const program = linesArray[4].split(": ")[1];
        const instructions = program.split(",").map(Number);
        return new Computer(a, b, c, instructions);
    }

    getRegisterValues() {
        return { a: this.a, b: this.b, c: this.c };
    }

    setRegisterValues(values: {a: number, b: number, c: number}) {
        this.a = values.a;
        this.b = values.b;
        this.c = values.c;
    }

    getProgram() {
        return this.instructions.join(",");
    }


    run(abortIfDoesntMatchProgram = false) {
        this.instructionPointer = 0;
        this.output = [];

        while (this.instructionPointer < this.instructions.length-1) {
            const opcode = this.instructions[this.instructionPointer];
            const operand = this.instructions[this.instructionPointer+1];
            switch(opcode) {
                case 0: this.adv(operand); break;
                case 1: this.bxl(operand); break;
                case 2: this.bst(operand); break;
                case 3: this.jnz(operand); break;
                case 4: this.bxc(operand); break;
                case 5: this.out(operand); break;
                case 6: this.bdv(operand); break;
                case 7: this.cdv(operand); break;
                default: throw new Error(`Invalid opcode`);
            }

            if (opcode === 5 && abortIfDoesntMatchProgram) {
                const idx = this.output.length -1;
                if (this.output[idx] !== this.instructions[idx]) {
                    return "no match"
                }
            }
        }

        return this.output.join(",");
    }

    adv(operand: number) {
        const comboOperand = this.combo(operand);
        const denominator = Math.pow(2, comboOperand);
        this.a = Math.floor(this.a/denominator);
        this.instructionPointer += 2;
    }

    bxl(operand: number) {
        this.b = Number(BigInt(this.b) ^ BigInt(operand));
        this.instructionPointer += 2;
    }

    bst(operand: number) {
        const comboOperand = this.combo(operand);
        this.b = comboOperand & 7;
        this.instructionPointer += 2;
    }

    jnz(operand: number) {
        if (this.a === 0) {
            this.instructionPointer += 2;
        } else {
            this.instructionPointer = operand;
        }
    }

    bxc(operand: number) {
        this.b = Number(BigInt(this.b) ^ BigInt(this.c));
        this.instructionPointer += 2;
    }

    out(operand: number) {
        const comboOperand = this.combo(operand);
        this.output.push(comboOperand & 7);
        this.instructionPointer += 2;
    }

    bdv(operand: number) {
        const comboOperand = this.combo(operand);
        const denominator = Math.pow(2, comboOperand);
        this.b = Math.floor(this.a/denominator);
        this.instructionPointer += 2;
    }

    cdv(operand: number) {
        const comboOperand = this.combo(operand);
        const denominator = Math.pow(2, comboOperand);
        this.c = Math.floor(this.a/denominator);
        this.instructionPointer += 2;
    }

    combo(operand: number) {
        switch(operand) {
            case 0:
            case 1:
            case 2:
            case 3:
                return operand;
            case 4:
                return this.a;
            case 5:
                return this.b;
            case 6:
                return this.c;
            default:
                throw new Error(`Invalid operand: ${operand}`);
        }
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const computer = await Computer.buildFromDescription(lines);
    return computer.run();
}

export async function solvePart2(lines: Sequence<string>) {
    const computer = await Computer.buildFromDescription(lines);
    let aSoFar = 0;

    for (let i=0; i< computer.instructions.length; i++) {
        let foundMatch = false;
        for (let octet=0; octet<8; octet++) {
            const candidate = (aSoFar << 3) + octet;
            computer.setRegisterValues({a: candidate, b: 0, c: 0});
            const output = computer.run();
            const expected = computer.instructions.slice(-(i+1)).join(",");
            const trying = candidate.toString(2).padStart(3*(i+1), "0");
            console.log(`${i}: trying ${trying} gets output: ${output} ... expected: ${expected}`)
            if(output === expected) {
                foundMatch = true;
                aSoFar = candidate;
                break;
            }
        }
        if (!foundMatch) throw new Error(`Didn't work!`)
    }
    return aSoFar;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day17.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
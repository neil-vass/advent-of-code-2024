import {linesFromFile, Sequence} from "generator-sequences";

export class Gate {
    constructor(readonly input1: string,
                readonly operation: string,
                readonly input2: string,
                readonly output: string) {}

    run(signal1: boolean, signal2: boolean): boolean {
        switch(this.operation) {
            case "AND": return signal1 && signal2;
            case "OR": return signal1 || signal2;
            case "XOR": return signal1 !== signal2;
            default: throw new Error(`Unknown gate type`);
        }
    }
}

export class Device {
    private signals = new Map<string, boolean>();
    private gates: Gate[] = [];
    private constructor() {}

    static async buildFromDescription(lines: Sequence<string>) {
        const device = new Device();

        for await (const line of lines) {
            const signalMatch = line.match(/^(\w+): (1|0)$/);
            if (signalMatch) {
                const [, wire, signal] = signalMatch;
                device.signals.set(wire, signal === "1");
                continue;
            }

            const gateMatch = line.match(/^(\w+) (AND|OR|XOR) (\w+) -> (\w+)$/);
            if (gateMatch) {
                const [, input1, operation, input2, output] = gateMatch;
                device.gates.push(new Gate(input1, operation, input2, output));
            }
        }
        device.run();
        return device;
    }

    private run() {
        const gatesStillToRun = new Set(Array.from(this.gates, (_, idx) => idx));
        while (gatesStillToRun.size > 0) {
            for (const idx of gatesStillToRun) {
                const gate = this.gates[idx];
                const inSignal1 = this.signals.get(gate.input1);
                const inSignal2 = this.signals.get(gate.input2);
                if (inSignal1 !== undefined && inSignal2 !== undefined) {
                    const outSignal = gate.run(inSignal1, inSignal2);
                    this.signals.set(gate.output, outSignal);
                    gatesStillToRun.delete(idx);
                }
            }
        }
    }

    getOverallOutput() {
        const zLabels = [...this.signals.keys()].filter(k => k.startsWith("z"));
        zLabels.sort();
        let result = 0;
        for (let i = 0; i < zLabels.length; i++) {
            if (this.signals.get(zLabels[i])) {
                result += Math.pow(2, i);
            }
        }
        return result;
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const device = await Device.buildFromDescription(lines);
    return device.getOverallOutput();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day24.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
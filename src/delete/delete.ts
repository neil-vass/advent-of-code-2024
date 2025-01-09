import {linesFromFile} from "generator-sequences";


// The circuits can be large and complicated, and when evaluating the outputs the code
// can end up looping round recalculating the same signals again and again. There's lots
// of solutions to that - one is to memoize the "getValue" method (cache the result each
// time it's called, and use the cached value if it gets called again with the same parameters).
//
// I've tried doing this using a decorator, to mimic the Python functools "@cache" decorator.
// That's because:
// 1. It's neater code (method can just do its work, with caching logic elsewhere)
// 2. I'm keen to learn lots of TypeScript (haven't seen decorators before).
// This is using the official decorators from TypeScript 5, not the experimental ones available
// in earlier versions.
// See https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators
function memoize(decoratedMethod: Function, context: ClassMethodDecoratorContext) {
    const cacheCollection = new WeakMap<object, Map<string, any>>();

    if (context.kind === "method") {
        return function (...args: any[]) {
            // @ts-ignore : caller could be any type of object; I'm not sure how
            // to tell TS that's fine.
            const callingObject = this;
            if (!cacheCollection.has(callingObject)) {
                cacheCollection.set(callingObject, new Map<string, any>());
            }
            const cache = cacheCollection.get(callingObject)!;
            const hashKey = args.join("-$-") // very much not a production-quality hash key.

            if (cache.has(hashKey)) {
                return cache.get(hashKey);
            } else {
                const result = decoratedMethod.apply(callingObject, args);
                cache.set(hashKey, result);
                return result;
            }
        }
    }
}

export class Circuit {

    static andGate(leftSignal: number, rightSignal: number) { return leftSignal & rightSignal }
    static orGate(leftSignal: number, rightSignal: number) { return leftSignal | rightSignal }
    static lshift(signal: number, numBits: number) { return signal << numBits }
    static rshift(signal: number, numBits: number) { return (signal >> numBits) & 0xFFFF }

    static notGate(signal: number) { return ~signal & 0xFFFF }

    private components = new Map<string, string[]>();

    connect(command: string) {
        const setSignalMatch = command.match(/^(\w+) -> (\w+)$/);
        if (setSignalMatch) {
            const [signal, target] = setSignalMatch.slice(1);
            this.components.set(target, [signal]);
            return;
        }

        const unaryOpMatch = command.match(/^(NOT) (\w+) -> (\w+)$/);
        if (unaryOpMatch) {
            const [op, arg, target] = unaryOpMatch.slice(1);
            this.components.set(target, [op, arg]);
            return;
        }

        const binaryOpMatch = command.match(/^(\w+) (AND|OR|LSHIFT|RSHIFT) (\w+) -> (\w+)$/);
        if (binaryOpMatch) {
            const [left, op, right, target] = binaryOpMatch.slice(1);
            this.components.set(target, [op, left, right]);
            return;
        }

        throw new Error(`Can't understand command: "${command}"`);
    }

    async build(instructions: Iterable<string> | AsyncIterable<string>) {
        for await (const i of instructions)
            this.connect(i);
    }

    @memoize
    private getValue(str: string) {
        if (str.match(/^\d+$/)) {
            return +str;
        } else {
            const result = this.calculateSignal(str);
            return result;
        }
    }

    private calculateSignal(target: string) : number {
        const inputs = this.components.get(target)!;
        if (inputs.length === 1) {
            return this.getValue(inputs[0]);
        }

        if (inputs.length === 2) {
            const [opName, arg] = inputs;
            const op = Circuit.notGate;
            const argSignal = this.getValue(arg);
            return op(argSignal);
        }

        if (inputs.length === 3) {
            const [opName, left, right] = inputs;
            const op = {
                "AND": Circuit.andGate,
                "OR": Circuit.orGate,
                "LSHIFT": Circuit.lshift,
                "RSHIFT": Circuit.rshift
            }[opName]!;

            const leftSignal = this.getValue(left);
            const rightSignal = this.getValue(right);
            return op(leftSignal, rightSignal);
        }

        throw new Error(`Wire '${target}' set up incorrectly`);
    }

    signalOn(wire: string)  {
        return this.calculateSignal(wire);
    }
}

async function part1(filepath: string) {
    const circuit = new Circuit();
    await circuit.build(linesFromFile(filepath));
    return circuit.signalOn('a');
}

async function part2(filepath: string, overrideForWireB: number) {
    const circuit = new Circuit();
    const commands = linesFromFile(filepath).map(line =>
        (line.match(/^\d+ -> b$/)) ? `${overrideForWireB} -> b` : line
    );
    await circuit.build(commands);
    return circuit.signalOn('a');
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./delete.input.txt";

    const signalOnWireA = await part1(filepath);
    console.log(`part 1: ${signalOnWireA}`);

    const updatedSignalOnWireA = await part2(filepath, signalOnWireA);
    console.log(`part 2: ${updatedSignalOnWireA}`);
}


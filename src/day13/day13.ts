import {linesFromFile, Sequence} from "generator-sequences";

export type XY = {x: number, y: number};

export class Machine {
    private constructor(private readonly aMove: XY,
                        private readonly bMove: XY,
                        private readonly prize: XY) {}

    static buildFromDescription(lines: string[]) {
        const up = new Error(`Unexpected format: ${lines}`);

        const aMatch = lines[0].match(/^Button A: X\+(\d+), Y\+(\d+)$/);
        if (!aMatch) throw up;
        const aMove = {x: +aMatch[1], y: +aMatch[2]};

        const bMatch = lines[1].match(/^Button B: X\+(\d+), Y\+(\d+)$/);
        if (!bMatch) throw up;
        const bMove = {x: +bMatch[1], y: +bMatch[2]};

        const prizeMatch = lines[2].match(/^Prize: X=(\d+), Y=(\d+)$/);
        if (!prizeMatch) throw up;
        const prize = {x: +prizeMatch[1], y: +prizeMatch[2]};

        return new Machine(aMove, bMove, prize);
    }

    canWin(): any {
        throw new Error("Method not implemented.");
    }

    cheapestWin(): any {
        throw new Error("Method not implemented.");
    }
}
export async function solvePart1(lines: Sequence<string>) {
    return "Hello, World!";
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day13.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
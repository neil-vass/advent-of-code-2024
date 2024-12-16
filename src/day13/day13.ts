import {linesFromFile, Sequence} from "generator-sequences";

export type XY = {x: number, y: number};

export class Machine {
    readonly canWin: boolean;
    readonly cheapestWin: number;

    private constructor(readonly aMove: XY,
                        readonly bMove: XY,
                        readonly prize: XY) {

        // Cross multiplication method
        const [a1, b1, c1] = [aMove.x, bMove.x, -prize.x];
        const [a2, b2, c2] = [aMove.y, bMove.y, -prize.y];
        const aPushes = (b1*c2 - b2*c1) / (a1*b2 - a2*b1);
        const bPushes = (c1*a2 - c2*a1) / (a1*b2 - a2*b1);

        if(aPushes > Number.MAX_SAFE_INTEGER || bPushes > Number.MAX_SAFE_INTEGER) {
            throw new Error(`Numbers are too big to handle`);
        }

        if(Number.isInteger(aPushes) && Number.isInteger(bPushes)) {
            this.canWin = true;
            this.cheapestWin = aPushes * 3 + bPushes;
        } else {
            this.canWin = false;
            this.cheapestWin = Infinity;
        }
    }

    static buildFromDescription(lines: string[], offset=0) {
        const up = new Error(`Unexpected format: ${lines}`);

        const aMatch = lines[0].match(/^Button A: X\+(\d+), Y\+(\d+)$/);
        if (!aMatch) throw up;
        const aMove = {x: +aMatch[1], y: +aMatch[2]};

        const bMatch = lines[1].match(/^Button B: X\+(\d+), Y\+(\d+)$/);
        if (!bMatch) throw up;
        const bMove = {x: +bMatch[1], y: +bMatch[2]};

        const prizeMatch = lines[2].match(/^Prize: X=(\d+), Y=(\d+)$/);
        if (!prizeMatch) throw up;
        const prize = {x: +prizeMatch[1] + offset, y: +prizeMatch[2] + offset};

        return new Machine(aMove, bMove, prize);
    }
}


export async function solvePart1(lines: Sequence<string>, offset=0) {
    const lineArray = await lines.toArray();
    const machines: Machine[] = [];
    for (let i = 0; i < lineArray.length;) {
        const description = lineArray.slice(i, i+3);
        machines.push(Machine.buildFromDescription(description, offset));
        i += 4;
    }
    const winnable = machines.filter(m => m.canWin);
    return winnable.reduce((acc, val) => acc + val.cheapestWin, 0);
}

export async function solvePart2(lines: Sequence<string>) {
    return solvePart1(lines, 10000000000000);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day13.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
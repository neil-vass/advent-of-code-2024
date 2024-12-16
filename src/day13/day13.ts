import {linesFromFile, Sequence} from "generator-sequences";

export type XY = {x: number, y: number};

export class Machine {
    readonly canWin: boolean;
    readonly cheapestWin: number;

    private constructor(readonly aMove: XY,
                        readonly bMove: XY,
                        readonly prize: XY) {

        const candidates: {aPushes: number, bPushes: number}[] = [];
        for (let aPushes = 0; aPushes <= 100; aPushes++) {
            const aContribution = aPushes * aMove.x;
            if (aContribution > prize.x) break;

            for (let bPushes = 0; bPushes <= 100; bPushes++) {
                const bContribution = bPushes * bMove.x;
                if (aContribution + bContribution > prize.x) break;
                if (aContribution + bContribution === prize.x) {
                    if (aPushes * aMove.y + bPushes * bMove.y === prize.y) {
                        candidates.push({aPushes, bPushes});
                    }
                }
            }
        }

        this.canWin = candidates.length > 0;
        const costs = candidates.map(({aPushes, bPushes}) => aPushes * 3 + bPushes);
        this.cheapestWin = Math.min(...costs);
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


export async function solvePart1(lines: Sequence<string>) {
    const lineArray = await lines.toArray();
    const machines: Machine[] = [];
    for (let i = 0; i < lineArray.length;) {
        const description = lineArray.slice(i, i+3);
        machines.push(Machine.buildFromDescription(description));
        i += 4;
    }
    const winnable = machines.filter(m => m.canWin);
    return winnable.reduce((acc, val) => acc + val.cheapestWin, 0);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day13.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
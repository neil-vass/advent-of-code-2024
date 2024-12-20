import {linesFromFile, Sequence} from "generator-sequences";

type Pos = {row: number, col: number};
const save = (p: Pos) => JSON.stringify(p)
const load = (s: string) => JSON.parse(s) as Pos;

export class Racetrack {
    private route = new Map<string, number>(); // position, time reached

    private constructor(readonly grid: string[],
                        readonly start: Pos,
                        readonly end: Pos) {
        this.findRoute();
    }

    private findRoute() {
        let current = this.start;
        let steps = 0;
        this.route.set(save(current), steps);
        while(save(current) !== save(this.end)) {
            current = this.nextStep(current);
            steps++;
            this.route.set(save(current), steps);
        }
    }

    nextStep(current: Pos) {
        const {row,col} = current;
        const neighbours = [
            {row: row-1, col},
            {row: row+1, col},
            {row, col: col-1},
            {row, col: col+1},
        ];
        for (const n of neighbours) {
            if (this.isClear(n) && !this.route.has(save(n))) return n;
        }
        throw new Error(`Blocked at ${current}`);
    }

    private isClear(p: Pos) {
        return this.grid[p.row][p.col] === ".";
    }

    static async buildFromDescription(lines: Sequence<string>) {
        const grid: string[] = [];
        let start = {row:0, col:0};
        let end = {row:0, col:0};
        let row = 0;
        for await (let line of lines) {
            let startCol = line.indexOf("S");
            if (startCol >= 0) {
                start = {row, col: startCol};
                line = line.replace("S", ".");
            }
            let endCol = line.indexOf("E");
            if (endCol >= 0) {
                end = {row, col: endCol};
                line = line.replace("E", ".");
            }
            grid.push(line);
            row++;
        }
        return new Racetrack(grid, start, end);
    }

    distance() {
        return this.route.size-1;
    }

    findCheats(minSavingRequired: number) {
        let numCheats = 0;
        // We know there's a wall round the outside
        for (let row = 1; row < this.grid.length-1; row++) {
            for (let col = 1; col < this.grid[0].length-1; col++) {

                if(this.grid[row].slice(col, col+3) === ".#.") {
                    // let's cheat!
                    const oneSide = this.route.get(save({row,col}))!;
                    const otherSide = this.route.get(save({row,col: col+2}))!;
                    // Instead of all the steps in between these points, we only take 2.
                    const saving = Math.abs(oneSide - otherSide) - 2;
                    if (saving >= minSavingRequired) numCheats++;
                } else if (this.grid[row-1][col] === "." && this.grid[row][col] === "#" && this.grid[row+1][col] === ".") {
                    // let's cheat!
                    const oneSide = this.route.get(save({row: row-1, col}))!;
                    const otherSide = this.route.get(save({row: row+1, col}))!;
                    // Instead of all the steps in between these points, we only take 2.
                    const saving = Math.abs(oneSide - otherSide) - 2;
                    if (saving >= minSavingRequired) numCheats++;
                }
            }
        }
        return numCheats;
    }
}
export async function solvePart1(lines: Sequence<string>) {
    const racetrack = await Racetrack.buildFromDescription(lines);
    return racetrack.findCheats(100);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day20.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
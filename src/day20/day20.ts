import {linesFromFile, Sequence} from "generator-sequences";

type Pos = {row: number, col: number};
const save = (p: Pos) => JSON.stringify(p)
const load = (s: string) => JSON.parse(s) as Pos;

export class Racetrack {
    private route = new Map<string, number>();

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

}
export async function solvePart1(lines: Sequence<string>) {
    const racetrack = await Racetrack.buildFromDescription(lines);
    return racetrack.distance();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day20.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
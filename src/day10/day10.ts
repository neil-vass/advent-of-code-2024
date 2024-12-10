import {linesFromFile, Sequence} from "generator-sequences";
import {FifoQueue, Graph} from "../utils/graphSearch.js";

type Pos = {x: number, y: number};

export class TrailMap {
    private constructor(private grid: Array<Array<number>>) {}

    static async buildFromDescription(lines: Sequence<string>) {
        const grid = new Array<Array<number>>();
        for await (const line of lines) {
            grid.push([...line].map(c => c === "." ? Infinity : +c));
        }

        return new TrailMap(grid);
    }

    height(p: Pos) {
        return this.grid[p.y][p.x];
    }

    *trailheads() {
        // We could note the 0's in the initial setup, will change if it matters.
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[0].length; x++) {
                const p = {x, y};
                if (this.height(p) === 0) {
                    yield p;
                }
            }
        }
    }

    countTrails() {
        let pathCount = 0;
        for (const p of this.trailheads()) {
            pathCount += this.countTrailsFrom(p);
        }
        return pathCount;
    }

    private countTrailsFrom(start: Pos) {
        // Objects will be saved for comparisons.
        type SavedNode = string;
        const save = (n: Pos): SavedNode => JSON.stringify(n);
        const load = (s: SavedNode): Pos => JSON.parse(s);

        const frontier = new FifoQueue<SavedNode>();
        const reachableGoals = new Set<SavedNode>();

        const savedStart = save(start);
        frontier.push(savedStart);

        while (!frontier.isEmpty()) {
            const current = frontier.pull()!;
            for (const n of this.neighbours(load(current))) {
                if (this.height(n) === 9) {
                    reachableGoals.add(save(n));
                } else {
                    frontier.push(save(n));
                }
            }
        }
        return reachableGoals.size;
    }

    private *neighbours(p: Pos) {
        const currentHeight = this.height(p);
        const pointsToCheck = [
            {x:p.x-1, y:p.y},
            {x:p.x+1, y:p.y},
            {x:p.x, y:p.y-1},
            {x:p.x, y:p.y+1}
        ];
        for (const n of pointsToCheck) {
            if (this.isInBounds(n) && this.height(n) === currentHeight+1) {
                yield n;
            }
        }
    }

    private isInBounds(p: Pos) {
        return (p.x >= 0 && p.x < this.grid[0].length &&
            p.y >= 0 && p.y < this.grid.length);
    }
}
export async function solvePart1(lines: Sequence<string>) {
    const trailMap = await TrailMap.buildFromDescription(lines);
    return trailMap.countTrails();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day10.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
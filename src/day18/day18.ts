import {linesFromFile, Sequence} from "generator-sequences";
import {A_starSearch, WeightedGraph} from "../utils/graphSearch.js";

type Pos = {x: number, y: number};

export class Pushdown implements WeightedGraph<Pos> {
    readonly fallenBytes: Set<string>;

    private constructor(private readonly allBytes: Pos[],
                        private readonly goal: Pos,
                        private nextByteIdx: number) {

        const fallenSoFar = allBytes.slice(0, nextByteIdx);
        this.fallenBytes = new Set(fallenSoFar.map(b => JSON.stringify(b)));
    }

    static async buildFromDescription(lines: Sequence<string>,
                                      goal: Pos,
                                      initialByteLimit: number) {

        function toPos(line: string) {
            const [x,y] = line.split(",").map(Number);
            return {x,y};
        }

        const bytes = await lines.map(toPos).toArray();
        return new Pushdown(bytes, goal, initialByteLimit);
    }

    *neighboursWithCosts(currentNode: Pos): Iterable<{ node: Pos; cost: number; }> {
        const neighbours = [
            {x: currentNode.x+1, y: currentNode.y},
            {x: currentNode.x-1, y: currentNode.y},
            {x: currentNode.x, y: currentNode.y+1},
            {x: currentNode.x, y: currentNode.y-1},
        ];
        for (const n of neighbours) {
            if (this.isInBounds(n) && !this.fallenBytes.has(JSON.stringify(currentNode))) {
                yield { node: n, cost: 1 };
            }
        }
    }

    heuristic(from: Pos, to: Pos): number {
        return Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
    }

    isAtGoal(candidate: Pos, goal: Pos): boolean {
        return candidate.x === goal.x && candidate.y === goal.y;
    }

    private isInBounds(p: Pos) {
        return p.x >= 0 && p.y >= 0 && p.x <= this.goal.x && p.y <= this.goal.y;
    }

    shortestPathToGoal() {
        const path = A_starSearch(this, {x:0, y:0}, this.goal);
        return path.cost;
    }

    firstBlocker() {
        // A_starSearch throws an error when there's no possible path.
        while (this.nextByteIdx < this.allBytes.length) {
            try {
                const byte = this.allBytes[this.nextByteIdx];
                this.fallenBytes.add(JSON.stringify(byte));
                this.shortestPathToGoal();
                this.nextByteIdx++;
            } catch(e) {
                if (e instanceof Error &&
                    e.message === "No path to the goal was found.") {
                    const blocker = this.allBytes[this.nextByteIdx];
                    return `${blocker.x},${blocker.y}`;
                }
                else {
                    // Did not expect this!
                    throw e;
                }
            }
        }
        return "No blockers found";
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const goal = {x: 70, y: 70};
    const byteLimit = 1024;
    const pushdown = await Pushdown.buildFromDescription(lines, goal, byteLimit);
    return pushdown.shortestPathToGoal();
}

export async function solvePart2(lines: Sequence<string>) {
    const goal = {x: 70, y: 70};
    const initialByteLimit = 1024;
    const pushdown = await Pushdown.buildFromDescription(lines, goal, initialByteLimit);
    return pushdown.firstBlocker();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day18.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
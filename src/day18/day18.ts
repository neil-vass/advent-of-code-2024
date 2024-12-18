import {linesFromFile, Sequence} from "generator-sequences";
import {A_starSearch, WeightedGraph} from "../utils/graphSearch.js";

type Pos = {x: number, y: number};

export class Pushdown implements WeightedGraph<Pos> {
    readonly bytesSet: Set<string>;
    private constructor(readonly bytes: Pos[],
                        readonly goal: Pos) {
        this.bytesSet = new Set(bytes.map(b => JSON.stringify(b));

    }

    static async buildFromDescription(lines: Sequence<string>,
                                      goal: Pos,
                                      byteLimit=1024) {
        const bytes: Pos[] = [];
        let bytesCollected = 0;
        for await (const line of lines) {
            const [x,y] = line.split(",").map(Number);
            bytes.push({x,y});
            bytesCollected++;
            if (bytesCollected === byteLimit) break;
        }
        return new Pushdown(bytes, goal);
    }

    *neighboursWithCosts(currentNode: Pos): Iterable<{ node: Pos; cost: number; }> {
        const neighbours = [
            {x: currentNode.x+1, y: currentNode.y},
            {x: currentNode.x-1, y: currentNode.y},
            {x: currentNode.x, y: currentNode.y+1},
            {x: currentNode.x, y: currentNode.y-1},
        ];
        for (const n of neighbours) {
            if (this.isInBounds(n) && !this.bytesSet.has(JSON.stringify(currentNode))) {
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
}

export async function solvePart1(lines: Sequence<string>, goal: Pos, byteLimit=1024) {
    const pushdown = await Pushdown.buildFromDescription(lines, goal, byteLimit);
    return pushdown.shortestPathToGoal();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day18.input.txt`;
    const lines = linesFromFile(filepath)
    const goal = {x: 70, y: 70};
    const byteLimit = 1024;
    console.log(await solvePart1(lines, goal, byteLimit));
}
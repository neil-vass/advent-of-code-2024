import {linesFromFile, Sequence} from "generator-sequences";
import {A_starSearch, FifoQueue, MinPriorityQueue, Stack, WeightedGraph} from "../utils/graphSearch.js";

type Pos = {row: number, col: number};
type Reindeer = Pos & {dir: string};

const WALL = "#";
const CLEAR = ".";
const START = "S";
const END = "E"

export class ReindeerMaze implements WeightedGraph<Reindeer> {
    private constructor(private readonly grid: string[],
                        private readonly start: Pos) {}

    static async buildFromDescription(lines: Sequence<string>) {
        const grid: string[] = [];
        let start = {row: 0, col: 0};
        let rowNum = 0;
        for await (const line of lines) {
            const startCol = line.indexOf(START);
            if (startCol > -1) start = {row: rowNum, col: startCol};
            grid.push(line);
            rowNum++;
        }
        return new ReindeerMaze(grid, start);
    }

    findBestPathCost() {
        let reindeer = {row: this.start.row, col: this.start.col, dir: ">"};
        let placeholderGoal = {row: -1, col: -1, dir: ""};
        const result = A_starSearch(this, reindeer, placeholderGoal);
        return result.cost;
    }

    findSeatsForAllBestPaths() {
        const bestPathCost = this.findBestPathCost();

        type path = {visited: Set<string>, reindeer: Reindeer, cost: number};

        const frontier = new FifoQueue<path>();
        const reached = new Map<string, number>();
        let positionsOnBestPaths = new Set<string>();

        const reindeer = {row: this.start.row, col: this.start.col, dir: ">"};
        const placeholderGoal = {row: -1, col: -1, dir: ""}; // we'll work on this.
        const start = {visited: new Set<string>(), reindeer, cost: 0};
        frontier.push(start);
        reached.set(JSON.stringify(reindeer), 0);

        while (!frontier.isEmpty()) {
            const current = frontier.pull()!;
            for (const n of this.neighboursWithCosts(current.reindeer)) {
                const costToThisStep = current.cost + n.cost;
                if (costToThisStep > bestPathCost) continue;

                const oldCostToThisStep = reached.get(JSON.stringify(n.node));
                if (oldCostToThisStep !== undefined && costToThisStep > oldCostToThisStep) continue;

                if (costToThisStep === bestPathCost && this.isAtGoal(n.node, placeholderGoal)) {
                    positionsOnBestPaths = positionsOnBestPaths.union(current.visited);
                    positionsOnBestPaths.add(JSON.stringify([current.reindeer.row, current.reindeer.col]));
                    positionsOnBestPaths.add(JSON.stringify([n.node.row, n.node.col]))
                } else {
                    // Make a new path, and push it.
                    const branchVisited = new Set(current.visited);
                    branchVisited.add(JSON.stringify([current.reindeer.row, current.reindeer.col]));
                    const branch = {visited: branchVisited, reindeer: n.node, cost: costToThisStep};
                    frontier.push(branch);
                    reached.set(JSON.stringify(n.node), costToThisStep);
                }
            }
        }

        return positionsOnBestPaths.size;
    }

    *neighboursWithCosts(currentNode: Reindeer): Iterable<{ node: Reindeer; cost: number; }> {
        const forward = this.adjacentPos(currentNode);
        if ([END, CLEAR].includes(this.grid[forward.row][forward.col])) {
            yield { node: forward, cost: 1 };
        }

        const turnsFrom: {[dir: string]: string} = { ">": "^v", "^": "<>", "<": "^v", "v": "<>" };
        for (const newFacing of turnsFrom[currentNode.dir]) {
            yield {
                node: {row: currentNode.row, col: currentNode.col, dir: newFacing},
                cost: 1000
            }
        }
    }

    heuristic(from: Reindeer, to: Reindeer): number {
        return 0;
    }

    isAtGoal(candidate: Reindeer, goal: Reindeer): boolean {
        const {row, col} = candidate;
        return this.grid[row][col] === END;
    }

    private adjacentPos(current: Reindeer): Reindeer {
        const {dir} = current;
        switch(dir) {
            case "<": return { row: current.row, col: current.col-1, dir };
            case "^": return { row: current.row-1, col: current.col, dir };
            case ">": return { row: current.row, col: current.col+1, dir };
            case "v": return { row: current.row+1, col: current.col, dir };
            default: throw new Error(`Unknown direction: ${dir}`);
        }
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const maze = await ReindeerMaze.buildFromDescription(lines);
    return maze.findBestPathCost();
}

export async function solvePart2(lines: Sequence<string>) {
    const maze = await ReindeerMaze.buildFromDescription(lines);
    return maze.findSeatsForAllBestPaths();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day16.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
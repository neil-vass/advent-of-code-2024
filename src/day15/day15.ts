import {linesFromFile, Sequence} from "generator-sequences";
import {con} from "../day07/day07.js";
import {FifoQueue} from "../utils/graphSearch.js";

const WALL = "#";
const BOX = "O";
const ROBOT = "@";
const CLEAR = ".";
const BOX_LEFT = "[";
const BOX_RIGHT = "]";

type Pos = { row: number, col: number };

export class Warehouse {
    private robotPos: Pos;

    private constructor(private readonly grid: string[][],
                        private readonly robotMoves: string,
                        robotStart: Pos) {
        this.robotPos = robotStart;
    }

    static async buildFromDescription(lines: Sequence<string>, wide=false) {
        const grid: string[][] = [];
        let robotStart = {row:0, col: 0};

        const linesArray = await lines.toArray();
        let rowNum = 0;

        while (linesArray[rowNum] !== "") {
            let currRow = linesArray[rowNum].split("");
            if (wide) currRow = currRow.flatMap(Warehouse.widen);

            grid.push(currRow);
            let botIdx = currRow.indexOf(ROBOT);
            if (botIdx !== -1) {
                robotStart = {row: rowNum, col: botIdx};
                currRow[botIdx] = CLEAR;
            }
            rowNum++;
        }

        const robotMoves = linesArray.slice(rowNum+1).join("");
        return new Warehouse(grid, robotMoves, robotStart);
    }

    static async buildWideFromDescription(lines: Sequence<string>) {
        return Warehouse.buildFromDescription(lines, true);
    }

    private static widen(content: string) {
        switch(content) {
            case WALL: return [WALL, WALL];
            case BOX: return [BOX_LEFT, BOX_RIGHT];
            case CLEAR: return [CLEAR, CLEAR];
            case ROBOT: return [ROBOT, CLEAR];
            default: throw new Error(`Unknown content: ${content}`);
        }
    }

    display() {
        this.setContentsAt(this.robotPos, ROBOT);
        const result = this.grid.map(row => row.join(""));
        this.setContentsAt(this.robotPos, CLEAR);
        return result;
    }

    runRobot() {
        for (const dir of this.robotMoves) {
            const target = this.adjacentPos(this.robotPos, dir);
            const inTheWay = this.contentsAt(target);

            if (inTheWay === WALL) continue;
            if (inTheWay === CLEAR) this.moveRobotTo(target);
            if (inTheWay === BOX) this.tryToPush(target, dir);

            if ([BOX_LEFT, BOX_RIGHT].includes(inTheWay)) {
                if ("<>".includes(dir)) this.tryToPushWideAlongRow(target, dir);
                else this.tryToPushWideAlongCol(target, dir);
            }
        }
    }

    private contentsAt(target: Pos) {
        return this.grid[target.row][target.col];
    }

    private setContentsAt(target: Pos, contents: string) {
        this.grid[target.row][target.col] = contents;
    }

    private moveRobotTo(target: Pos) {
        this.robotPos = target;
    }

    private tryToPush(target: Pos, dir: string) {
        let gapScan = this.adjacentPos(target, dir);
        while (this.contentsAt(gapScan) === BOX) {
            gapScan = this.adjacentPos(gapScan, dir);
        }
        switch(this.contentsAt(gapScan)) {
            case WALL: break;
            case CLEAR:
                this.setContentsAt(gapScan, BOX);
                this.setContentsAt(target, CLEAR);
                this.moveRobotTo(target);
        }
    }

    private tryToPushWideAlongRow(target: Pos, dir: any) {
        let gapScan = this.adjacentPos(target, dir);
        while ([BOX_LEFT, BOX_RIGHT].includes(this.contentsAt(gapScan))) {
            // Step twice, past the wide box.
            gapScan = this.adjacentPos(gapScan, dir);
            gapScan = this.adjacentPos(gapScan, dir);
        }
        switch(this.contentsAt(gapScan)) {
            case WALL: break;
            case CLEAR:
                // Shuffle everything, we can't just take the first
                // and pop it on the end.
                let shuffleContent = this.contentsAt(target);
                let shuffleTarget = this.adjacentPos(target, dir);
                this.setContentsAt(target, CLEAR);
                this.moveRobotTo(target);
                while(shuffleContent !== CLEAR) {
                    let nextShuffleContent = this.contentsAt(shuffleTarget);
                    this.setContentsAt(shuffleTarget, shuffleContent);
                    shuffleContent = nextShuffleContent;
                    shuffleTarget = this.adjacentPos(shuffleTarget, dir);
                }
        }
    }

    private tryToPushWideAlongCol(target: Pos, dir: string) {
        const save = (p: Pos) => JSON.stringify(p);
        const load = (s: string) => JSON.parse(s) as Pos;

        const toCheck = new FifoQueue<Pos>();
        toCheck.push(target);
        const canMoveIfNoBlockersFound = new Set<string>();

        while (!toCheck.isEmpty()) {
            const thisHalf = toCheck.pull()!;
            const otherHalf = this.otherHalfOfBox(thisHalf);

            for (const halfBox of [thisHalf, otherHalf]) {
                const posThisNeedsToMoveInto = this.adjacentPos(halfBox, dir);
                const inTheWay = this.contentsAt(posThisNeedsToMoveInto);
                if (inTheWay === WALL) return;
                if (inTheWay === CLEAR) continue;
                if ([BOX_LEFT, BOX_RIGHT].includes(inTheWay)) {
                    toCheck.push(posThisNeedsToMoveInto);
                }
            }
            canMoveIfNoBlockersFound.add(save(thisHalf));
            canMoveIfNoBlockersFound.add(save(otherHalf));
        }

        // Got here? Then no blockers were found!
        const letsMove = [...canMoveIfNoBlockersFound].map(load);
        const letsMoveInOrder = letsMove.sort((a,b) => a.row - b.row);
        for (const halfBoxPos of letsMoveInOrder) {
            const moveTo = this.adjacentPos(halfBoxPos, dir);
            this.setContentsAt(moveTo, this.contentsAt(halfBoxPos));
            this.setContentsAt(halfBoxPos, CLEAR);
        }
        this.moveRobotTo(target);
    }

    private otherHalfOfBox(target: Pos) {
        const col = this.contentsAt(target) === "[" ? target.col+1 : target.col-1;
        return {row: target.row, col};
    }

    private adjacentPos(current: Pos, dir: string) {
        switch(dir) {
            case "<": return { row: current.row, col: current.col-1 };
            case "^": return { row: current.row-1, col: current.col };
            case ">": return { row: current.row, col: current.col+1 };
            case "v": return { row: current.row+1, col: current.col };
            default: throw new Error(`Unknown direction: ${dir}`);
        }
    }

    sumOfBoxCoordinates() {
        let total = 0;
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                if ([BOX, BOX_LEFT].includes(this.contentsAt({row, col}))) {
                    total += (row * 100) + col;
                }
            }
        }
        return total;
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const warehouse = await Warehouse.buildFromDescription(lines);
    warehouse.runRobot();
    return warehouse.sumOfBoxCoordinates();
}

export async function solvePart2(lines: Sequence<string>) {
    const warehouse = await Warehouse.buildWideFromDescription(lines);
    warehouse.runRobot();
    console.log(warehouse.display());
    return warehouse.sumOfBoxCoordinates();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day15.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
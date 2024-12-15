import {linesFromFile, Sequence} from "generator-sequences";
import {con} from "../day07/day07.js";

const WALL = "#";
const BOX = "O";
const ROBOT = "@";
const CLEAR = ".";

type Pos = { row: number, col: number };

export class Warehouse {
    private robotPos: Pos;

    private constructor(private readonly grid: string[][],
                        private readonly robotMoves: string,
                        robotStart: Pos) {
        this.robotPos = robotStart;
    }

    static async buildFromDescription(lines: Sequence<string>) {
        const grid: string[][] = [];
        let robotStart = {row:0, col: 0};

        const linesArray = await lines.toArray();
        let rowNum = 0;

        while (linesArray[rowNum] !== "") {
            const currRow = linesArray[rowNum].split("");
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

    runRobot() {
        for (const dir of this.robotMoves) {
            const target = this.adjacentPos(this.robotPos, dir);
            switch(this.contentsAt(target)) {
                case WALL: break;
                case CLEAR:
                    this.moveRobotTo(target);
                    break;
                case BOX:
                    this.tryToPush(target, dir);
                    break;
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
                if (this.contentsAt({row, col}) === BOX) {
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

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day15.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
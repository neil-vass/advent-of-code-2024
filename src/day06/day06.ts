import {linesFromFile, Sequence} from "generator-sequences";

type Pos = {x: number, y: number};
const DIRECTIONS = "^>v<";
type Dir = "^" | ">" | "v" | "<";
type Guard = { pos: Pos, dir: Dir };

export class Lab {
    private constructor(private blocks: Array<Pos>,
                        private xLength: number,
                        private yLength: number,
                        private guard: Guard) {}

    static async buildFromDescription(lines: Sequence<string>) {
        const blocks = new Array<Pos>();
        let initialGuard: Guard | null = null;
        let xLength = 0;
        let y = 0;
        for await (const line of lines) {
            xLength = line.length;
            for(let x = 0; x < xLength; x++) {
                if (line[x] === "#") {
                    blocks.push({x,y});
                } else if (DIRECTIONS.includes(line[x])) {
                    initialGuard = { pos: {x,y}, dir: line[x] as Dir };
                }
            }
            y++;
        }

        if (!initialGuard) throw new Error(`No guard found`);
        return new Lab(blocks, xLength, y, initialGuard);
    }

    locationsCoveredOnPatrol() {
        const locations = new Set<string>();
        locations.add(JSON.stringify(this.guard.pos));
        let exited = false;

        while(!exited) {
            const {x,y} = this.guard.pos;

            if (this.guard.dir === ">") {
                const blocksInPath = this.blocks.filter(b => b.x > x && b.y === y);
                let blockedBy = 0;
                if (blocksInPath.length) {
                    blockedBy = blocksInPath.sort((a, b) => a.x - b.x)[0].x;
                } else {
                    blockedBy = this.xLength;
                    exited = true;
                }

                for (let i = x+1; i < blockedBy; i++) {
                    locations.add(JSON.stringify({x:i, y}));
                }
                this.guard = { dir: "v", pos: {x: blockedBy-1, y}};

            } else if (this.guard.dir === "v") {
                const blocksInPath = this.blocks.filter(b => b.x === x && b.y > y);
                let blockedBy = 0;
                if (blocksInPath.length) {
                    blockedBy = blocksInPath.sort((a, b) => a.y - b.y)[0].y;
                } else {
                    blockedBy = this.yLength;
                    exited = true;
                }

                for (let i = y+1; i < blockedBy; i++) {
                    locations.add(JSON.stringify({x, y:i}));
                }
                this.guard = { dir: "<", pos: {x, y: blockedBy-1}};
            } else if (this.guard.dir === "<") {
                const blocksInPath = this.blocks.filter(b => b.x < x && b.y === y);
                let blockedBy = 0;
                if (blocksInPath.length) {
                    blockedBy = blocksInPath.sort((a, b) => b.x - a.x)[0].x;
                } else {
                    blockedBy = -1;
                    exited = true;
                }

                for (let i = x-1; i > blockedBy; i--) {
                    locations.add(JSON.stringify({x:i, y}));
                }
                this.guard = { dir: "^", pos: {x: blockedBy+1, y}};
            } else if (this.guard.dir === "^") {
                const blocksInPath = this.blocks.filter(b => b.x === x && b.y < y);
                let blockedBy = 0;
                if (blocksInPath.length) {
                    blockedBy = blocksInPath.sort((a, b) => b.y - a.y)[0].y;
                } else {
                    blockedBy = -1;
                    exited = true;
                }

                for (let i = y-1; i > blockedBy; i--) {
                    locations.add(JSON.stringify({x, y:i}));
                }
                this.guard = { dir: ">", pos: {x, y: blockedBy+1}};
            }
        }

        return locations;
    }

    private draw(locations: Set<string>) {
        const blockstrings = this.blocks.map(b => JSON.stringify(b));
        for (let y = 0; y < this.yLength; y++) {
            let line = "";
            for (let x = 0; x < this.xLength; x++) {
                const pos = JSON.stringify({x, y});
                if (blockstrings.includes(pos)) {
                    if (locations.has(pos)) throw new Error(`Aha! ${pos}`)
                    line += "#";
                } else if (locations.has(pos)) {
                    line += "X";
                } else {
                    line += ".";
                }
            }
            console.log(line);
        }
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const lab = await Lab.buildFromDescription(lines);
    return lab.locationsCoveredOnPatrol().size;
}

export async function solvePart2(lines: Sequence<string>) {
    const lab = await Lab.buildFromDescription(lines);
    return lab.locationsCoveredOnPatrol().size;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day06.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
import {linesFromFile, Sequence} from "generator-sequences";

type Pos = {x: number, y: number};
type Dir = "^" | ">" | "v" | "<";
type Guard = { pos: Pos, dir: Dir };

export class Lab {
    // We know we're in a loop if we try to enter a guardHistory that's already in here.
    readonly guardHistory = new Array<Guard>();
    readonly loopOpportunities = new Set<string>();
    patrolReachesExit = false;

    private constructor(private blocks: Array<Pos>,
                        private xLength: number,
                        private yLength: number,
                        private guard: Guard,
                        searchForLoopOpportunities = true) {
        this.runPatrol();
        if (searchForLoopOpportunities) {
            this.noteLoopOpportunities();
        }
    }

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
                } else if ("^>v<".includes(line[x])) {
                    initialGuard = { pos: {x,y}, dir: line[x] as Dir };
                }
            }
            y++;
        }

        if (!initialGuard) throw new Error(`No guard found`);
        return new Lab(blocks, xLength, y, initialGuard);
    }

    private runPatrol() {
        this.guardHistory.push(this.guard);
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
                    this.guard = { dir: ">", pos: {x:i, y}};
                    if (this.isRepeatVisit()) return;
                    this.guardHistory.push(this.guard);
                }
                this.guard = { dir: "v", pos: {x:blockedBy-1, y}};

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
                    this.guard = { dir: "v", pos: {x, y:i}};
                    if (this.isRepeatVisit()) return;
                    this.guardHistory.push(this.guard);
                }
                this.guard = { dir: "<", pos: {x, y:blockedBy-1}};

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
                    this.guard = { dir: "<", pos: {x:i, y}};
                    if (this.isRepeatVisit()) return;
                    this.guardHistory.push(this.guard);
                }
                this.guard = { dir: "^", pos: {x:blockedBy+1, y}};

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
                    this.guard = { dir: "^", pos: {x, y:i}};
                    if (this.isRepeatVisit()) return;
                    this.guardHistory.push(this.guard);
                }
                this.guard = { dir: ">", pos: {x, y:blockedBy+1}};
            }
        }

        this.patrolReachesExit = true;
    }

    private isRepeatVisit() {
        return this.guardHistory.filter(g =>
            g.dir === this.guard.dir &&
            g.pos.x === this.guard.pos.x &&
            g.pos.y === this.guard.pos.y).length > 0;
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

    private noteLoopOpportunities() {
        const initialGuard = this.guardHistory[0];

        for (const guard of this.guardHistory.slice(1)) {
            let newBlock = guard.pos;

            const otherBlocks = [...this.blocks, newBlock];
            const otherLab = new Lab(otherBlocks, this.xLength, this.yLength, initialGuard, false);
            if (!otherLab.patrolReachesExit) {
                this.loopOpportunities.add(JSON.stringify(newBlock));
            }
        }
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const lab = await Lab.buildFromDescription(lines);
    const locationsCoveredOnPatrol = lab.guardHistory.map(g => JSON.stringify(g.pos));
    return new Set(locationsCoveredOnPatrol).size;
}

export async function solvePart2(lines: Sequence<string>) {
    const lab = await Lab.buildFromDescription(lines);
    return lab.loopOpportunities.size;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day06.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
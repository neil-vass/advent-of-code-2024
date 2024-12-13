import {linesFromFile, Sequence} from "generator-sequences";

type Region = { area: number, perimeter: number }

export class Garden {
    private constructor(readonly plots: string[]) {}

    static async buildFromDescription(lines: Sequence<string>) {
        const plots = await lines.toArray();
        return new Garden(plots);
    }

    isInBounds(row: number, col: number) {
        return row >= 0 && col >= 0 &&
            row < this.plots.length &&
            col < this.plots[0].length;
    }

    exploreRegion(row: number, col: number, reached: Set<string>): Region {
        if (reached.has(JSON.stringify([row, col]))) {
            return {area: 0, perimeter: 0};
        }
        reached.add(JSON.stringify([row, col]));

        const neighbours = [
            [row-1, col], [row+1, col], [row, col-1], [row, col+1]
        ]
        let fences = 4;
        let area = 1;
        for (const [nRow, nCol] of neighbours) {
             if (this.isInBounds(nRow, nCol) &&
                 this.plots[nRow][nCol] === this.plots[row][col]) {
                    // Take down this fence and go exploring.
                    fences--;
                    const details = this.exploreRegion(nRow, nCol, reached);
                    area += details.area;
                    fences += details.perimeter;
            }
        }
        return { area: area, perimeter: fences };
    }

    totalFenceCost() {
        const reached = new Set<string>();
        let fenceCost = 0;

        for (let row = 0; row < this.plots.length; row++) {
            for (let col = 0; col < this.plots[0].length; col++) {
                const {area, perimeter} = this.exploreRegion(row, col, reached);
                fenceCost += area * perimeter;
            }
        }

        return fenceCost;
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const garden = await Garden.buildFromDescription(lines);
    return garden.totalFenceCost();
}

export async function solvePart2(lines: Sequence<string>) {
    const garden = await Garden.buildFromDescription(lines);
    return garden.totalFenceCost();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day12.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
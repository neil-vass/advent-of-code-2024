import {linesFromFile, Sequence} from "generator-sequences";


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

    exploreRegion(row: number, col: number, reached: Set<string>) {
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
                    if (!reached.has(JSON.stringify([nRow, nCol]))) {
                        const details = this.exploreRegion(nRow, nCol, reached);
                        area += details.area;
                        fences += details.perimeter;
                    }
            }
        }
        return { area: area, perimeter: fences };
    }

    totalFenceCost() {
        type Region = { area: number, perimeter: number }
        const regions = new Array<Region>();
        const reached = new Set<string>();

        for (let row = 0; row < this.plots.length; row++) {
            for (let col = 0; col < this.plots[0].length; col++) {

                if (reached.has(JSON.stringify([row, col]))) continue;
                regions.push(this.exploreRegion(row, col, reached));
            }
        }

        return regions.reduce((acc, val) => acc + val.area * val.perimeter, 0);
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const garden = await Garden.buildFromDescription(lines);
    return garden.totalFenceCost();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day12.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
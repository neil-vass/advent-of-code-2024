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

    fenceForPlot(row: number, col: number) {
        const neighbours = [
            [row-1, col], [row+1, col], [row, col-1], [row, col+1]
        ]
        let fences = 4;
        for (const [nRow, nCol] of neighbours) {
             if (this.isInBounds(nRow, nCol) &&
                this.plots[nRow][nCol] === this.plots[row][col]) {
                    fences--;
            }
        }
        return fences;
    }

    totalFenceCost() {
        type Region = { area: number, perimeter: number }
        const cropDetails = new Map<string, Region>();

        for (let row = 0; row < this.plots.length; row++) {
            for (let col = 0; col < this.plots[0].length; col++) {
                const crop = this.plots[row][col];
                let details = cropDetails.get(crop);
                if (details === undefined) {
                    details = { area: 0, perimeter: 0};
                    cropDetails.set(crop, details);
                }
                details.area++;
                details.perimeter += this.fenceForPlot(row, col);
            }
        }

        return [...cropDetails.values()].reduce((acc, val) => acc + val.area * val.perimeter, 0);
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
import {linesFromFile, Sequence} from "generator-sequences";

type Region = { area: number, perimeter: number };

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

    exploreRegion(row: number, col: number, reached: Set<string>, fences: Set<string>[][]): Region {
        if (reached.has(JSON.stringify([row, col]))) {
            return {area: 0, perimeter: 0};
        }
        reached.add(JSON.stringify([row, col]));

        const neighbours = [
            {dir: "^", nRow: row-1, nCol: col },
            {dir: "v", nRow: row+1, nCol: col },
            {dir: "<", nRow: row, nCol: col-1 },
            {dir: ">", nRow: row, nCol: col+1 },
        ];
        const toExplore = new Array<{nRow: number, nCol: number}>();
        let fencesOnThisPlot = new Set<string>();
        for (const {dir, nRow, nCol} of neighbours) {
             if (this.isInBounds(nRow, nCol) && this.plots[nRow][nCol] === this.plots[row][col]) {
                 toExplore.push({nRow, nCol});
            } else {
                 fencesOnThisPlot.add(dir);
            }
        }

        let area = 1;
        let perimeter = fencesOnThisPlot.size;
        for (const n of toExplore) {
            const details = this.exploreRegion(n.nRow, n.nCol, reached, fences);
            area += details.area;
            perimeter += details.perimeter;
        }
        fences[row][col] = fencesOnThisPlot;

        return {area, perimeter};
    }

    totalFenceCost(costCalculator: (r: Region) => number) {
        const reached = new Set<string>();
        const fences = Array.from(this.plots, r => Array.from(this.plots[0], c => new Set<string>()));
        let fenceCost = 0;

        for (let row = 0; row < this.plots.length; row++) {
            for (let col = 0; col < this.plots[0].length; col++) {
                const region = this.exploreRegion(row, col, reached, fences);
                if (region.area !== 0) console.log(this.plots[row][col], region)
                fenceCost += costCalculator(region);
            }
        }
        console.log(fences)
        return fenceCost;
    }
}


export async function solvePart1(lines: Sequence<string>) {
    const garden = await Garden.buildFromDescription(lines);
    const costCalculator = (r: Region) => r.area * r.perimeter;
    return garden.totalFenceCost(costCalculator);
}

export async function solvePart2(lines: Sequence<string>) {
    const garden = await Garden.buildFromDescription(lines);
    const costCalculator = (r: Region) => 1;
    return garden.totalFenceCost(costCalculator);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day12.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
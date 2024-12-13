import {linesFromFile, Sequence} from "generator-sequences";

type Region = { area: number, perimeter: number, sides: number };

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

    exploreRegion(row: number, col: number, reached: Set<string>, fencesOnNeighbours: Set<string>[][]|null=null): Region {
        if (reached.has(JSON.stringify([row, col]))) {
            return {area: 0, perimeter: 0, sides: 0};
        }
        reached.add(JSON.stringify([row, col]));

        if (fencesOnNeighbours === null) {
            fencesOnNeighbours = Array.from(this.plots, r => Array.from(this.plots[0], c => new Set<string>()));
        }

        const neighbours = [
            {dir: "^", nRow: row-1, nCol: col },
            {dir: "v", nRow: row+1, nCol: col },
            {dir: "<", nRow: row, nCol: col-1 },
            {dir: ">", nRow: row, nCol: col+1 },
        ];
        const toExplore = new Array<{nRow: number, nCol: number}>();
        let fences = new Set<string>();
        for (const {dir, nRow, nCol} of neighbours) {
             if (this.isInBounds(nRow, nCol) && this.plots[nRow][nCol] === this.plots[row][col]) {
                 toExplore.push({nRow, nCol});
            } else {
                 fences.add(dir);
            }
        }


        let area = 1;
        let perimeter = fences.size;
        let sides = 0;
        let sidesNotCountedByNeighbours = fences;
        for (const n of toExplore) {
            const details = this.exploreRegion(n.nRow, n.nCol, reached, fencesOnNeighbours);
            area += details.area;
            perimeter += details.perimeter;
            sides += details.sides;
            sidesNotCountedByNeighbours = sidesNotCountedByNeighbours.difference(fencesOnNeighbours[n.nRow][n.nCol]);
        }
        sides += sidesNotCountedByNeighbours.size;
        fencesOnNeighbours[row][col] = fences;

        return {area, perimeter, sides};
    }

    totalFenceCost(costCalculator: (r: Region) => number) {
        const reached = new Set<string>();
        let fenceCost = 0;

        for (let row = 0; row < this.plots.length; row++) {
            for (let col = 0; col < this.plots[0].length; col++) {
                const region = this.exploreRegion(row, col, reached);
                if (region.area !== 0) console.log(this.plots[row][col], region)
                fenceCost += costCalculator(region);
            }
        }

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
    const costCalculator = (r: Region) => r.area * r.sides;
    return garden.totalFenceCost(costCalculator);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day12.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
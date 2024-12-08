import {linesFromFile, Sequence} from "generator-sequences";

type Pos = {x: number, y: number};

export function* pairsWithSignificantOrder<T>(iterable: Iterable<T>) {
    const pool = [...iterable];
    for (let i = 0; i < pool.length; i++) {
        for (let j = 0; j < pool.length; j++) {
            if (i !== j) {
                yield [pool[i], pool[j]];
            }
        }
    }
}

export class AntennaAnalyser {
    private constructor(private grid: string[],
                        private antennaMap: Map<string, Array<Pos>>) {}

    static async buildFromDescription(lines: Sequence<string>) {
        const grid = new Array<string>();
        const antennaMap = new Map<string, Array<Pos>>();

        for await (const line of lines) {
            for (const [x, char] of [...line].entries()) {
                if (char !== ".") {
                    if(!antennaMap.has(char)) {
                        antennaMap.set(char, []);
                    }
                    antennaMap.get(char)!.push({x, y:grid.length});
                }
            }
            grid.push(line);
        }
        return new AntennaAnalyser(grid, antennaMap)
    }

    findAntinodeLocations(usingHarmonics=false) {
        const antinodes = new Array<Pos>();
        for (const locations of this.antennaMap.values()) {
            for (const [a, b] of pairsWithSignificantOrder(locations)) {

                if (!usingHarmonics) {
                    const antinode = {
                        x: a.x + (a.x - b.x),
                        y: a.y + (a.y - b.y)
                    };
                    if (this.isInBounds(antinode)) {
                        antinodes.push(antinode);
                    }
                } else {
                    let pos = {x: a.x, y: a.y};
                    while (this.isInBounds(pos)) {
                        antinodes.push(pos);
                        pos = {x: pos.x + (a.x - b.x), y: pos.y + (a.y - b.y)};
                    }
                }
            }
        }
        return antinodes;
    }

    private isInBounds(pos: Pos) {
        return (pos.x >= 0 && pos.x < this.grid[0].length &&
                pos.y >= 0 && pos.y < this.grid.length);
    }
}


export async function solvePart1(lines: Sequence<string>) {
    const analyser = await AntennaAnalyser.buildFromDescription(lines);
    const antinodes = analyser.findAntinodeLocations();
    const unique = new Set(antinodes.map(a => JSON.stringify(a)));
    return unique.size;
}

export async function solvePart2(lines: Sequence<string>) {
    const analyser = await AntennaAnalyser.buildFromDescription(lines);
    const antinodes = analyser.findAntinodeLocations(true);
    const unique = new Set(antinodes.map(a => JSON.stringify(a)));
    return unique.size;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day08.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}

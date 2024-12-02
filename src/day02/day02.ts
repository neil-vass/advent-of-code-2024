import {linesFromFile, Sequence} from "generator-sequences";

export function parseReport(line: string) {
    return line.split(" ").map(Number);
}

export function isSafe(report: number[], canUseDampener=false): boolean {
    if (report.length < 2) return true;

    const isIncreasing = report[0] < report[1];
    for (let i = 0; i < report.length-1; i++) {
        const diff = report[i+1] - report[i];

        if ((isIncreasing && diff <= 0) ||
           (!isIncreasing && diff >= 0) ||
           (Math.abs(diff) > 3)) {

            // We have one chance.
            if (canUseDampener) {
                for (let remove = 0; remove < report.length; remove++) {
                    if (isSafe(report.toSpliced(remove, 1), false)) return true;
                }
            }
            return false;
        }
    }
    return true;
}
export async function solvePart1(input: Sequence<string>) {
    const safeReports = input.map(parseReport).filter(isSafe);
    return await Sequence.count(safeReports);
}

export async function solvePart2(input: Sequence<string>) {
    const safeReports = input.map(parseReport).filter(r => isSafe(r, true));
    return await Sequence.count(safeReports);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day02.input.txt`;
    const input = linesFromFile(filepath);
    console.log(await solvePart2(input));
}
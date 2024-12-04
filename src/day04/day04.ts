import {linesFromFile, Sequence} from "generator-sequences";

export function isTargetWord(wordsearch: string[],
                             row: number,
                             col: number,
                             targetWord: string,
                             rowIncrement: number,
                             colIncrement: number)  {

    const endRow = row + (targetWord.length-1) * rowIncrement;
    if (endRow < 0 || endRow >= wordsearch.length) return false;

    const endCol = col + (targetWord.length-1) * colIncrement;
    if (endCol < 0 || endCol >= wordsearch[0].length) return false;

    for (const letter of targetWord) {
        if(wordsearch[row][col] !== letter)
            return false;
        row += rowIncrement;
        col += colIncrement;
    }
    return true;
}

export function countXmasesFrom(wordsearch: string[], row: number, col: number) {
    const dirFunction = isTargetWord.bind(undefined, wordsearch, row, col, "XMAS");
    const directions = [
        dirFunction(0, +1),
        dirFunction(0, -1),
        dirFunction(+1, 0),
        dirFunction(-1, 0),
        dirFunction(+1, +1),
        dirFunction(+1, -1),
        dirFunction(-1, +1),
        dirFunction(-1, -1),
    ]
    return directions.filter(d => d).length;
}

export function isTopLeftOfCross(wordsearch: string[], row: number, col: number) {
    const matchFromTopLeft = isTargetWord.bind(undefined, wordsearch, row, col);
    if (matchFromTopLeft("MAS", +1, +1) || matchFromTopLeft("SAM", +1, +1)) {
        const matchFromTopRight = isTargetWord.bind(undefined, wordsearch, row, col+2);
        if (matchFromTopRight("MAS", +1, -1) || matchFromTopRight("SAM", +1, -1)) {
            return true;
        }
    }
    return false;
}

export async function solvePart1(lines: Sequence<string>) {
    let xmasCount = 0;
    const wordsearch = await lines.toArray();
    for (let row = 0; row < wordsearch.length; row++) {
        for (let col = 0; col < wordsearch[row].length; col++) {
            if (wordsearch[row][col] === "X") {
                xmasCount += countXmasesFrom(wordsearch, row, col);
            }
        }
    }
    return xmasCount;
}

export async function solvePart2(lines: Sequence<string>) {
    let xmasCount = 0;
    const wordsearch = await lines.toArray();
    for (let row = 0; row < wordsearch.length-2; row++) {
        for (let col = 0; col < wordsearch[row].length-2; col++) {
            if (isTopLeftOfCross(wordsearch, row, col)) {
                xmasCount++;
            }
        }
    }
    return xmasCount;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day04.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
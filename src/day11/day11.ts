import {singleLineFromFile} from "generator-sequences";

// After one blink, what collection of stones does this single stone turn into?
export function singleStoneBlink(stone: number): number[] {
    if (stone === 0) return [1];

    const digits = Math.floor(Math.log10(stone)) +1;
    if (digits % 2 === 0) {
        const splitVal = Math.pow(10, digits/2);
        return [Math.floor(stone / splitVal), (stone % splitVal)];
    }

    return [stone * 2024];
}

const cache = new Map<string, number>();

// After multiple blinks, how many stones do we end up with from this single stone?
export function stoneCountFromSingleStone(stone: number, blinks: number): number {
    let result = cache.get(JSON.stringify([stone, blinks]));
    if (result === undefined) {

        const stonesAfterThisBlink = singleStoneBlink(stone);
        if (blinks === 1) {
            result = stonesAfterThisBlink.length;
        } else {
            result = stoneCountFromStoneCollection(stonesAfterThisBlink, blinks-1);
        }

        cache.set(JSON.stringify([stone, blinks]), result);
    }
    return result;
}

// After multiple blinks, how many stones do we end up with from this collection?
export function stoneCountFromStoneCollection(stones: number[], blinks: number): number {
    return stones.reduce((acc, val) => acc + stoneCountFromSingleStone(val, blinks), 0);
}

export function solvePart1(line: string, blinks: number) {
    const stones = line.split(" ").map(Number);
    return stoneCountFromStoneCollection(stones, blinks);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day11.input.txt`;
    console.log(solvePart1(singleLineFromFile(filepath), 75));
}
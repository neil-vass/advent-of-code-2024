import {singleLineFromFile} from "generator-sequences";

export function singleStoneBlink(stone: number) {
    if (stone === 0) return [1];

    const digits = Math.floor(Math.log10(stone)) +1;
    if (digits % 2 === 0) {
        const splitVal = Math.pow(10, digits/2);
        return [Math.floor(stone / splitVal), (stone % splitVal)];
    }

    return [stone * 2024];
}

const cache = new Map<string, number>();

export function oneStoneTurnsInto(stone: number, blinks: number): number {
    let retval = cache.get(JSON.stringify([stone, blinks]));
    if (retval === undefined) {
        if (blinks === 1) {
            retval = singleStoneBlink(stone).length;
        } else {
            retval =  stonesAfter(singleStoneBlink(stone), blinks - 1);
        }
        cache.set(JSON.stringify([stone, blinks]), retval);
    }
    return retval;
}

export function stonesAfter(stones: number[], blinks: number) {
    return stones.reduce((acc, val) => acc + oneStoneTurnsInto(val, blinks), 0);
}

export function solvePart1(line: string, blinks: number) {
    const stones = line.split(" ").map(Number);
    return stonesAfter(stones, blinks);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day11.input.txt`;
    console.log(solvePart1(singleLineFromFile(filepath), 75));
}
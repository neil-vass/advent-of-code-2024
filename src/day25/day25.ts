import {linesFromFile, Sequence} from "generator-sequences";

async function parseLocksAndKeys(lines: Sequence<string>) {
    const linesArray = await lines.toArray();
    const locks: number[][] = [];
    const keys: number[][] = [];

    for (let i = 0; i < linesArray.length; i += 8) {
        const schematic = linesArray.slice(i, i + 7);
        const pins = [0, 0, 0, 0, 0];
        for (const row of schematic.slice(1, -1)) {
            for (let col = 0; col < row.length; col++) {
                if (row[col] === "#") pins[col]++;
            }
        }
        if (schematic[0] === "#####") {
            locks.push(pins);
        } else {
            keys.push(pins);
        }
    }
    return {locks, keys};
}

function fits(lock: number[], key: number[]) {
    for (let pin = 0; pin < lock.length; pin++) {
        if (lock[pin] + key[pin] > 5) return false;
    }
    return true;
}

export async function solvePart1(lines: Sequence<string>) {
    const {locks, keys} = await parseLocksAndKeys(lines);

    let fitCount = 0;
    for (const lock of locks) {
        for (const key of keys) {
            if (fits(lock, key)) fitCount++;
        }
    }
    return fitCount;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day25.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
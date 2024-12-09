import {singleLineFromFile} from "generator-sequences";

type File = { id: number, length: number };

export function checksumFor(diskMap: string) {
    const files = new Array<File>();
    const gaps = new Array<number>();
    for (let i = 0; i < diskMap.length; i += 2) {
        files.push({id: i / 2, length: +diskMap[i]});
        if (i + 1 === diskMap.length) break;
        gaps.push(+diskMap[i + 1]);
    }

    let outputIdx = 0;
    let checksum = 0;
    let filler = new Array<number>();
    while (files.length) {
        const frontFile = files.shift()!;

        for (let i = 0; i < frontFile.length; i++) {
            checksum += outputIdx * frontFile.id;
            outputIdx++;
        }

        const nextGapSize = gaps.shift();
        if (nextGapSize === undefined) continue;

        for (let i = 0; i < nextGapSize; i++) {
            if (filler.length === 0) {
                const backFile = files.pop();
                if (backFile === undefined) continue;
                filler.push(...Array.from(backFile, () => backFile.id));
            }
            checksum += outputIdx * filler.shift()!;
            outputIdx++;
        }
    }

    // Final tidy up!
    for (const val of filler) {
        checksum += outputIdx * val;
        outputIdx++;
    }

    return checksum;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day09.input.txt`;
    console.log(checksumFor(singleLineFromFile(filepath)));
}

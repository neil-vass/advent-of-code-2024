import {singleLineFromFile} from "generator-sequences";

type FileInfo = { id: number, length: number };

function findFilesAndGaps(diskMap: string) {
    const files = new Array<FileInfo>();
    const gaps = new Array<number>();
    for (let i = 0; i < diskMap.length; i += 2) {
        files.push({id: i / 2, length: +diskMap[i]});
        if (i + 1 === diskMap.length) break;
        gaps.push(+diskMap[i + 1]);
    }
    return {files, gaps};
}

export function checksumFor(diskMap: string) {
    const {files, gaps} = findFilesAndGaps(diskMap);

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

type ExtendedFileInfo = FileInfo & {initialIdx: number};
type GapInfo = { initialIdx: number, length: number };

function findFilesAndGapsV2(diskMap: string) {
    const files = new Array<ExtendedFileInfo>();
    const gaps = new Array<GapInfo>();
    let position = 0;
    for (let i = 0; i < diskMap.length; i += 2) {
        const fileLength = +diskMap[i];
        files.push({id: i / 2, length: fileLength, initialIdx: position});
        position += fileLength;

        if (i+1 === diskMap.length) break;
        const gapLength = +diskMap[i+1]
        gaps.push({initialIdx: position, length: gapLength});
        position += gapLength;
    }
    return {files, gaps};
}

export function checksumForV2(diskMap: string) {
    const {files, gaps} = findFilesAndGapsV2(diskMap);
    const unmovedFiles = [files[0]];

    let checksum = 0;
    for (let fileIdx = files.length-1; fileIdx > 0; fileIdx--) {
        const file = files[fileIdx];
        const gapIdx = gaps.findIndex(g => g.length >= file.length && g.initialIdx < file.initialIdx);
        if(gapIdx === -1) {
            unmovedFiles.push(file);
            continue;
        }
        const gap = gaps[gapIdx];
        for (let blockNum = 0; blockNum < file.length; blockNum++) {
            checksum += gap.initialIdx * file.id;
            gap.initialIdx++;
            gap.length--;
        }
    }

    for (const file of unmovedFiles) {
        for (let blockNum = 0; blockNum < file.length; blockNum++) {
            checksum += file.initialIdx * file.id;
            file.initialIdx++;
        }
    }
    return checksum;
}


// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day09.input.txt`;
    console.log(checksumForV2(singleLineFromFile(filepath)));
}

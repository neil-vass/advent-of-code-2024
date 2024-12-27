import {linesFromFile, Sequence} from "generator-sequences";

export function secret(n: number, repeat=1) {
    const mix = (secret: number, val: number) => secret ^ val;
    const prune = (secret: number) => secret & (16777216-1);

    let updatedSecret = n;
    for (let i=0; i < repeat; i++) {
        // * 64 is << 6
        updatedSecret = mix(updatedSecret, (updatedSecret << 6));
        updatedSecret = prune(updatedSecret);

        // / 32 is >> 5
        updatedSecret = mix(updatedSecret, (updatedSecret >> 5));
        updatedSecret = prune(updatedSecret);

        // * 2048 is << 11
        updatedSecret = mix(updatedSecret, (updatedSecret << 11));
        updatedSecret = prune(updatedSecret);
    }

    return updatedSecret;
}

export function populateDiffMap(initial: number, numSecrets: number, diffMap: Map<string, number>) {
    let [prevNum, prevPrice] = [initial, initial % 10];
    let diffs: number[] = [];
    const seen = new Set<string>();

    for (let i=0; i < numSecrets; i++) {
        const currNum = secret(prevNum);
        const currPrice = currNum % 10;
        const currDiff = currPrice - prevPrice;

        if (diffs.length === 4) diffs = diffs.slice(1);
        diffs.push(currDiff);

        if (diffs.length === 4) {
            const key = JSON.stringify(diffs);
            if (!seen.has(key)) {
                const total = (diffMap.get(key) || 0) + currPrice;
                diffMap.set(key, total);
                seen.add(key);
            }
        }

        [prevNum, prevPrice] = [currNum, currPrice];
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const secrets = lines.map(Number).map(n => secret(n, 2000));
    return Sequence.sum(secrets);
}

export async function solvePart2(lines: Sequence<string>) {
    const diffMap = new Map<string, number>();
    for await (const n of lines.map(Number)) {
        populateDiffMap(n, 2000, diffMap);
    }
    return Math.max(...diffMap.values());
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day22.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}


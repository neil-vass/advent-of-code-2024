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

export async function solvePart1(lines: Sequence<string>) {
    const secrets = lines.map(Number).map(n => secret(n, 2000));
    return Sequence.sum(secrets);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day22.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}


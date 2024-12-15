import {linesFromFile, Sequence} from "generator-sequences";

export async function solvePart1(lines: Sequence<string>) {
    return "Hello, World!";
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day13.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
import {linesFromFile, Sequence} from "generator-sequences";

function isValid(pages: string[], ordering: { [p: string]: Set<string> }) {
    const soFar = new Set<string>();
    let isValid = true;
    for (const p of pages) {
        soFar.add(p);
        if (ordering[p]) {
            if (ordering[p].intersection(soFar).size !== 0) {
                isValid = false;
                break;
            }
        }
    }
    return isValid;
}

function noteOrdering(line: string, ordering: { [p: string]: Set<string> }) {
    const [before, after] = line.split("|");
    if (ordering[before] === undefined) {
        ordering[before] = new Set<string>();
    }
    ordering[before].add(after);
}

export async function solvePart1(lines: Sequence<string>) {
    let sumOfMiddles = 0;
    let ordering: { [key: string]: Set<string>} = {};

    for await (const line of lines) {
        if (line.includes("|")) {
            noteOrdering(line, ordering);
        } else if (line.includes(",")) {
            const pages = line.split(",");

            if (isValid(pages, ordering)) {
                const middleIdx = Math.floor((pages.length-1)/2);
                sumOfMiddles += +pages[middleIdx];
            }
        }
    }
    return sumOfMiddles;
}

export function correctOrdering(pages: string[], ordering: {[key: string]: Set<string> }) {

    // Which of these pages depend on other pages in this list?
    const pageDependencies: {[key: string]: Set<string> } = {}
    for (const [key, values] of Object.entries(ordering)) {
        if (!pages.includes(key)) continue;
        for (const v of values) {
            if (!pages.includes(v)) continue;
            if (pageDependencies[v] === undefined) {
                pageDependencies[v] = new Set<string>();
            }
            pageDependencies[v].add(key);
        }
    }

    // Topological sort: start from pages that have no dependencies,
    // add them to the start of the sorted list, and see which dependencies
    // that resolves. Eventually all the pages will be in the list.
    const pagesWithNoDependencies = new Set(pages);
    Object.entries(pageDependencies).forEach(([key, val]) => { if(val.size) pagesWithNoDependencies.delete(key) });

    const sortedList = new Array<string>();
    while(pagesWithNoDependencies.size > 0) {
        const [current] = pagesWithNoDependencies;
        pagesWithNoDependencies.delete(current);
        sortedList.push(current);

        for (const [key, val] of Object.entries(pageDependencies)) {
            val.delete(current);
            if (val.size === 0) {
                pagesWithNoDependencies.add(key);
                delete pageDependencies[key];
            }
        }
    }

    // There should be nothing left...
    Object.values(pageDependencies).forEach(val => { if(val.size) throw new Error(`Cyclic dependencies!`) });
    return sortedList;
}

export async function solvePart2(lines: Sequence<string>) {
    let sumOfMiddles = 0;
    let ordering: {[key: string]: Set<string>} = {};

    for await (const line of lines) {
        if (line.includes("|")) {
            noteOrdering(line, ordering);
        } else if (line.includes(",")) {
            const pages = line.split(",");

            if (!isValid(pages, ordering)) {
                const updated = correctOrdering(pages, ordering);
                const middleIdx = Math.floor((updated.length-1)/2);
                sumOfMiddles += +updated[middleIdx];
            }
        }
    }
    return sumOfMiddles;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day05.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
import {linesFromFile, Sequence} from "generator-sequences";
import {combinations} from "../utils/itertools.js";

export async function solvePart1(lines: Sequence<string>) {
    const connections = new Set<string>();
    const t_nodes = new Map<string, Set<string>>();

    for await (const line of lines) {
        const [left, right] = line.split("-");
        for (const [a, b] of [[left, right], [right, left]]) {
            if (a.startsWith("t")) {
                if (!t_nodes.has(a)) {
                    t_nodes.set(a, new Set<string>());
                }
                t_nodes.get(a)!.add(b);
            }
            connections.add(`${a}-${b}`);
        }
    }

    const triples = new Set<string>();

    for (const [t, connectedToThisT] of t_nodes) {
        // for each connection: if they're connected to one another, that's a triple!
        for (const pair of combinations(connectedToThisT, 2)) {
            const savedPair = pair.join("-")
            if (connections.has(savedPair)) {
                // save triples alphabetically, so we avoid counting duplicates.
                triples.add([t, ...pair].sort().join(","));
            }
        }
    }

    return triples.size;
}

// This could do with rearranging into easy to read separate functions...
// But it works!
export async function solvePart2(lines: Sequence<string>) {
    const directConnections = new Map<string, Set<string>>();

    for await (const line of lines) {
        const [left, right] = line.split("-");
        for (const [a, b] of [[left, right], [right, left]]) {
            if (!directConnections.has(a)) {
                directConnections.set(a, new Set<string>());
            }
            directConnections.get(a)!.add(b);
        }
    }

    let bestSoFar = new Set<string>();

    for (const [anchor, connections] of directConnections) {
        const toCheck = new Set(connections);
        while(toCheck.size >= bestSoFar.size) {
            const cluster = new Set<string>();
            for (const a of toCheck) {
                const aConn = directConnections.get(a)!;
                let connectedToAll = true;
                for (const b of cluster) {
                    if (!aConn.has(b)) {
                        connectedToAll = false;
                        break;
                    }
                }
                if (connectedToAll) {
                    cluster.add(a);
                    toCheck.delete(a);
                }
            }
            cluster.add(anchor);
            if (cluster.size > bestSoFar.size) {
                bestSoFar = cluster;
            }
        }
    }

    return [...bestSoFar].sort().join(",");
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day23.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}
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

export async function solvePart2(lines: Sequence<string>) {
    const separateClusters = new Set<Set<string>>();
    for await (const line of lines) {
        const [a, b] = line.split("-");

        let clusterWithA = null;
        let clusterWithB = null;
        for (const cluster of separateClusters) {
            if (cluster.has(a)) {
                clusterWithA = cluster;
            } else if (cluster.has(b)) {
                clusterWithB = cluster;
            }
            if (clusterWithA !== null && clusterWithB !== null) break;
        }

        if (clusterWithA === null && clusterWithB === null) {
            separateClusters.add(new Set([a, b]));
        } else if (clusterWithA !== null && clusterWithB === null) {
            clusterWithA.add(b);
        } else if (clusterWithA === null && clusterWithB !== null) {
            clusterWithB.add(a);
        } else if (clusterWithA !== null && clusterWithB !== null) {
            const superCluster = clusterWithA.union(clusterWithB);
            separateClusters.delete(clusterWithA);
            separateClusters.delete(clusterWithB);
            separateClusters.add(superCluster);
        }
    }

    let maxCluster = new Set<string>();
    for (const cluster of separateClusters) {
        if (cluster.size > maxCluster.size) maxCluster = cluster;
    }

    return [...maxCluster].sort().join(",");
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day23.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}
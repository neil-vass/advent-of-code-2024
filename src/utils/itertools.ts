
// I'm missing Python's itertools.combinations().
// Made this function by following its pseudocde:
// https://docs.python.org/3/library/itertools.html#itertools.combinations
export function* combinations<T>(iterable: Iterable<T>, r: number) {
    const pool = [...iterable];
    const n = pool.length;
    if (r > n) return;
    const indices = Array.from({length: r}, (_,idx) => idx);

    yield indices.map(idx => pool[idx]);
    while (true) {
        let i = r-1;
        let didBreak = false;
        for (; i >= 0; i--) {
            if (indices[i] != i + n -r) {
                didBreak = true;
                break;
            }
        }
        if (!didBreak) return;

        indices[i]++;
        for (let j= i+1; j < r; j++) {
            indices[j] = indices[j-1] + 1
        }
        yield indices.map(idx => pool[idx]);
    }
}

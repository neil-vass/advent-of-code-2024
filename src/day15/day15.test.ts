import {expect, describe, it} from "vitest";
import {solvePart1, solvePart2, Warehouse} from "./day15.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Solves smaller example", async () => {
        const lines = new Sequence([
            "########",
            "#..O.O.#",
            "##@.O..#",
            "#...O..#",
            "#.#.O..#",
            "#...O..#",
            "#......#",
            "########",
            "",
            "<^^>>>vv<v>>v<<"
        ]);
        expect(await solvePart1(lines)).toBe(2028);
    });
});

describe("Part 2", () => {
    it("Solves smaller example", async () => {
        const lines = new Sequence([
            "#######",
            "#...#.#",
            "#.....#",
            "#..OO@#",
            "#..O..#",
            "#.....#",
            "#######",
            "",
            "<vv<<^^<<^^"
        ]);
        expect(await solvePart2(lines)).toBe(105 + 207 + 306);
    });

    it("Solves larger example", async () => {
        const lines = new Sequence([
            "##########",
            "#..O..O.O#",
            "#......O.#",
            "#.OO..O.O#",
            "#..O@..O.#",
            "#O#..O...#",
            "#O..O..O.#",
            "#.OO.O.OO#",
            "#....O...#",
            "##########",
            "",
            "<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^",
            "vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v",
            "><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<",
            "<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^",
            "^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><",
            "^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^",
            ">^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^",
            "<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>",
            "^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>",
            "v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^",
        ]);
        const warehouse = await Warehouse.buildWideFromDescription(lines);
        warehouse.runRobot();
        expect(warehouse.display()).toStrictEqual([
            "####################",
            "##[].......[].[][]##",
            "##[]...........[].##",
            "##[]........[][][]##",
            "##[]......[]....[]##",
            "##..##......[]....##",
            "##..[]............##",
            "##..@......[].[][]##",
            "##......[][]..[]..##",
            "####################",
        ]);
    });
});
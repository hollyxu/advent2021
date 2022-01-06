import fs from 'fs'
import { reduce, sum } from 'lodash';

// Where 0 is nothing, and 1 indicates a dot
type Grid = number[][];

type Coordinate = {
    x: number;
    y: number;
}

type FoldInstruction = {
    direction: string;
    coordinate: number;
}

function countDots(grid: Grid) {
    return reduce(grid, (sumSoFar, line) => {
        return sumSoFar + sum(line);
    }, 0)

}

function makeGrid(maxX: number, maxY: number): Grid {
    const grid = new Array(maxY + 1);
    for (var y = 0; y < grid.length; y++) {
        const newArr = new Array(maxX + 1).fill(0);
        grid[y] = newArr;
    }

    return grid;
}

function foldPaper(instruction: FoldInstruction, grid: Grid): Grid {
    const { direction, coordinate } = instruction;
    const newMaxX = direction === 'x' ? coordinate : grid[0].length;
    const newMaxY = direction === 'y' ? coordinate : grid.length;

    let newGrid = makeGrid(newMaxX, newMaxY);

    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
            if (!grid[y][x]) {
                continue;
            }

            if (direction === 'x' && x > coordinate) {
                const mirrorX = 2 * coordinate - x;
                newGrid[y][mirrorX] = 1;
            } else if (direction === 'y' && y > coordinate) {
                const mirrorY = 2 * coordinate - y;
                newGrid[mirrorY][x] = 1;
            } else {
                newGrid[y][x] = 1;
            }
        }
    }

    return newGrid;
}

function printGrid(grid: Grid) {
    for (const line of grid) {
        let newLine = '';
        for (const maybeDot of line) {
            newLine += maybeDot === 1 ? '#' : ' ';
        }
        console.log(newLine);
    }
}

function solve(foldInstructions: FoldInstruction[], coordinates: Coordinate[], maxX: number, maxY: number) {
    let grid: Grid = makeGrid(maxX, maxY);
    for (const coord of coordinates) {
        const { x, y } = coord;
        grid[y][x] = 1;
    }

    for (var i = 0; i < foldInstructions.length; i++) {
        grid = foldPaper(foldInstructions[i], grid);
        console.log(`has ${countDots(grid)} visible dots after ${i + 1} folds.`)
    }

    printGrid(grid);
}

try {
    const input = fs.readFileSync('./in/input13.txt', 'utf8');
    const rawData = input.split('\n');

    let isFoldingInstructions = false;
    let coordinates = [];
    let maxX = 0;
    let maxY = 0;
    let foldInstructions = [];
    for (const line of rawData) {
        if (line.length === 0) {
            isFoldingInstructions = true;
            continue;
        }

        if (!isFoldingInstructions) {
            const coord = line.split(',').map(item => parseInt(item, 10));
            coordinates.push({
                x: coord[0],
                y: coord[1]
            })
            if (coord[0] > maxX) {
                maxX = coord[0]
            }
            if (coord[1] > maxY) {
                maxY = coord[1]
            }
        } else {
            const instruction = line.split('=');
            const direction = instruction[0].split(' ')[2];
            const coordinate = parseInt(instruction[1], 10);

            foldInstructions.push({
                direction,
                coordinate
            });
        }
    }

    solve(foldInstructions, coordinates, maxX, maxY);
} catch (err) {
    console.error(err);
}

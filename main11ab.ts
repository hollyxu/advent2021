import fs from 'fs'
import { cloneDeep, find } from 'lodash';

type Grid = number[][];

type GridAndCount = {
    count: number,
    grid: Grid
}

function advanceGrid(grid: Grid): GridAndCount {
    let newGrid = grid;
    let flashQueue: { row: number, col: number }[] = [];

    for (var row = 0; row < grid.length; row++) {
        for (var col = 0; col < grid[row].length; col++) {
            grid[row][col] += 1;
            if (grid[row][col] > 9) {
                flashQueue.push({ row, col })
            }
        }
    }

    let i: number = 0;
    while (i < flashQueue.length) {
        const square = flashQueue[i];
        for (var y = Math.max(0, square.row - 1); y <= Math.min(grid.length - 1, square.row + 1); y++) {
            for (var x = Math.max(0, square.col - 1); x <= Math.min(grid[square.row].length - 1, square.col + 1); x++) {
                grid[y][x] += 1;
                const maybeSquare = { row: y, col: x };
                if (grid[y][x] > 9 && !find(flashQueue, maybeSquare)) {
                    flashQueue.push(maybeSquare)
                }
            }
        }
        i++;
    }

    for (let j = 0; j < flashQueue.length; j++) {
        const { row, col } = flashQueue[j];
        grid[row][col] = 0;
    }

    return {
        grid: newGrid,
        count: flashQueue.length,
    };
}

/**
 * Get number of times flashed after N turns
 */
function countNumberOfFlashes(initialGrid: Grid, turns: number): number {
    let flashCount = 0;
    let updatedGrid = cloneDeep(initialGrid);
    for (var t = 0; t < turns; t++) {
        const { count, grid } = advanceGrid(updatedGrid);
        updatedGrid = grid;
        flashCount += count;
    }

    return flashCount;
}

/**
 * Find first turn where all octopi flashed
 */
function findFirstAllFlash(initialGrid: Grid): number {
    let turn = 0;
    let flashCount = 0;
    let updatedGrid = cloneDeep(initialGrid);

    // Assuming a rectangular grid
    const numSquares = initialGrid.length * initialGrid[0].length;
    while (flashCount < numSquares) {
        turn += 1;
        const { count, grid } = advanceGrid(updatedGrid);
        updatedGrid = grid;
        flashCount = count;
    }

    return turn;
}

try {
    const input = fs.readFileSync('./in/input11.txt', 'utf8');
    const octopiGrid = input.split('\n').map(line => {
        const numArray = [];
        for (var i = 0; i < line.length; i++) {
            numArray.push(parseInt(line[i], 10))
        }
        return numArray;
    });

    const numTurns = 100;

    console.log(`Flashed ${countNumberOfFlashes(octopiGrid, numTurns)} times after ${numTurns} turns`);
    console.log(`First all-synchro flash is after ${findFirstAllFlash(octopiGrid)} turns`)
} catch (err) {
    console.error(err);
}


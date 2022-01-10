import fs from 'fs'

type Grid<T> = T[][];

type Coord = number[];

function makeEmptyGrid<T>(maxX: number, maxY: number, defaultValue: T): Grid<T> {
    const grid = new Array(maxY);
    for (var y = 0; y < grid.length; y++) {
        const newArr = new Array(maxX).fill(defaultValue);
        grid[y] = newArr;
    }

    return grid;
}

function makeNeighbours(grid: Grid<number>, x: number, y: number, visited: Grid<boolean>): Coord[] {
    let validNeighbours: Coord[] = [];
    const proposedNeighbours: Coord[] = [[x, y+1], [x, y-1], [x-1, y], [x+1, y]];

    for (const neighbour of proposedNeighbours) {
        const [x, y] = neighbour;

        if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) {
            continue;
        }
        if (visited[y][x]) {
            continue;
        }

        validNeighbours.push(neighbour);
    }

    return validNeighbours;
}

function isInQueue(queue: Coord[], coord: Coord) {
    for (const item of queue) {
        if (item[0] === coord[0] && item[1] === coord[1]) {
            return true;
        }
    }

    return false;
}

/** Mutates the array. It'd be faster if we used a priority queue */
function getMinCostNode(queue: Coord[], grid: Grid<number>): Coord {
    let minCost = Number.POSITIVE_INFINITY;
    let minCostIndex = 0;

    for (var i = 0; i < queue.length; i++) {
        const [x, y] = queue[i];
        const cost = grid[y][x];
        if (cost < minCost) {
            minCost = cost;
            minCostIndex = i;
        }
    }

    const coord = queue[minCostIndex];

    queue.splice(minCostIndex, 1);

    return coord;
}

function solve(grid: Grid<number>) {
    const maxX = grid[0].length;
    const maxY = grid.length;

    const costSoFar = makeEmptyGrid<number>(maxX, maxY, Number.POSITIVE_INFINITY);
    const visited = makeEmptyGrid<boolean>(maxX, maxY, false);

    const visitQueue: Coord[] = [[0, 0]];
    costSoFar[0][0] = 0;

    while (visitQueue.length > 0) {
        const next = getMinCostNode(visitQueue, costSoFar);
        const [x, y] = next;

        const neighbours = makeNeighbours(grid, x, y, visited);

        for (const neighbour of neighbours) {
            const [nX, nY] = neighbour;
            const proposedCost = costSoFar[y][x] + grid[nY][nX];
            if (proposedCost < costSoFar[nY][nX]) {
                costSoFar[nY][nX] = proposedCost;
            }
            if (!isInQueue(visitQueue, neighbour)) {
                visitQueue.push(neighbour);
            }
        }

        visited[y][x] = true;
    }

    console.log(costSoFar[maxY-1][maxX-1]);
}

try {
    const input = fs.readFileSync('./in/input15.txt', 'utf8');

    const grid: Grid<number> = [];
    input.split('\n').map(line => {
        const gridLine = line.split("").map(num => parseInt(num, 10))
        grid.push(gridLine);
    });

    solve(grid);
} catch (err) {
    console.error(err);
}

import fs from 'fs'
import { isEmpty, reject, chunk } from 'lodash';

type VentCoord = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

function countDangerousPoints(grid: number[][]) {
    let result = 0;
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j] >= 2) {
                result += 1;
            }

        }
    }
    return result;
}

function getRise(start: number, end: number) {
    if (start === end) {
        return 0;
    } else if (start < end) {
        return 1;
    } else {
        return -1;
    }
}

function getMaxStep(pt: VentCoord) {
    const stepX = Math.abs(pt.endX - pt.startX);
    const stepY = Math.abs(pt.endY - pt.startY);

    return Math.max(stepX, stepY);
}

/**
 * Return number of points with >= two lines over them.
 */
function solver(vents: VentCoord[], maxX: number, maxY: number): number {
    // The grid is not in cartesian format, when printed
    let grid = chunk(Array((maxX + 1) * (maxY + 1)).fill(0), maxX + 1);

    for (var v = 0; v < vents.length; v++) {
        const pt = vents[v];

        const riseX = getRise(pt.startX, pt.endX);
        const riseY = getRise(pt.startY, pt.endY);
        const maxStep = getMaxStep(pt);

        for (var step = 0; step <= maxStep; step++) {
            const curX = pt.startX + riseX * step;
            const curY = pt.startY + riseY * step;

            grid[curX][curY] += 1;
        }

    }

    return countDangerousPoints(grid);
}

try {
    const input = fs.readFileSync('./in/input5.txt', 'utf8');
    const semiRawData = reject(input.split('\n'), isEmpty);

    let maxX = 0;
    let maxY = 0;

    const vents = semiRawData.map((line: string): VentCoord => {
        const rawCoordinate = line.split(" -> ").map(coord => coord.split(','))
        const startX = parseInt(rawCoordinate[0][0], 10);
        const startY = parseInt(rawCoordinate[0][1], 10);
        const endX = parseInt(rawCoordinate[1][0], 10);
        const endY = parseInt(rawCoordinate[1][1], 10);

        maxX = Math.max(maxX, startX, endX);
        maxY = Math.max(maxY, startY, endY);

        return {
            startX,
            startY,
            endX,
            endY
        }
    })

    // Ignore vents that are not horizontal / vertical
    const filteredVents = vents.filter(coordinate => {
        return coordinate.startX === coordinate.endX || coordinate.startY === coordinate.endY
    })

    const majorVentCount = solver(filteredVents, maxX, maxY);
    const majorVentCountUnfiltered = solver(vents, maxX, maxY);

    console.log(`${majorVentCount} if horizontal only, ${majorVentCountUnfiltered} including diagonals.`);

} catch (err) {
    console.error(err);
}


import fs from 'fs'
import { every, reduce } from 'lodash';

function getNeighbourHeights(heightMap: number[][], row: number, col: number) {
    const neighbours = [];

    if (row - 1 >= 0) {
        neighbours.push(heightMap[row - 1][col])
    }
    if (row + 1 < heightMap.length) {
        neighbours.push(heightMap[row + 1][col])
    }
    if (col - 1 >= 0) {
        neighbours.push(heightMap[row][col - 1]);
    }
    if (col + 1 < heightMap[row].length) {
        neighbours.push(heightMap[row][col + 1])
    }

    return neighbours;
}

function calculateRisk(heights: number[]) {
    return reduce(heights, (sumSoFar, height) => sumSoFar + height + 1, 0)
}

/**
 * Get risky areas and calculate risk level
 */
function solver(heightMap: number[][]): number {
    const riskyHeights = [];
    for (var i = 0; i < heightMap.length; i++) {
        for (var j = 0; j < heightMap[i].length; j++) {
            const currentHeight = heightMap[i][j];
            const neighbourHeights = getNeighbourHeights(heightMap, i, j);

            if (every(neighbourHeights, (nHeight) => nHeight > currentHeight)) {
                riskyHeights.push(currentHeight);
            }
        }
    }

    return calculateRisk(riskyHeights);
}

try {
    const input = fs.readFileSync('./in/input9.txt', 'utf8');
    const heightMap = input.split('\n').map(
        lineStr => lineStr.split("").map(
            num => parseInt(num, 10)
        )
    );

    const riskLevel = solver(heightMap);

    console.log(`Risk ${riskLevel}`);

} catch (err) {
    console.error(err);
}


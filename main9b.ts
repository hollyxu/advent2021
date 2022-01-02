import fs from 'fs'
import { every, forEach, reduce } from 'lodash';

type Tile = {
    height: number;
    row: number;
    col: number;
}

function getNeighbours(heightMap: Tile[][], currentTile: Tile) {
    const neighbours = [];
    const { row, col } = currentTile;

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


function getLowestTiles(heightMap: Tile[][]): Tile[] {
    const lowestTiles = [];
    for (var i = 0; i < heightMap.length; i++) {
        for (var j = 0; j < heightMap[i].length; j++) {
            const currentTile = heightMap[i][j];
            const neighbourHeights = getNeighbours(heightMap, currentTile);

            if (every(neighbourHeights, (tile) => tile.height > currentTile.height)) {
                lowestTiles.push(currentTile);
            }
        }
    }

    return lowestTiles;
}

function getBasin(basinMin: Tile, heightMap: Tile[][]): Tile[] {
    const searchedTiles: Tile[] = [];
    const tilesToSearch: Tile[] = [basinMin];

    while (tilesToSearch.length > 0) {
        const currentTile = tilesToSearch.pop();
        if (currentTile) {
            searchedTiles.push(currentTile);
        } else {
            break;
        }

        const neighbours = getNeighbours(heightMap, currentTile);
        forEach(neighbours, (neighbour) => {
            if (neighbour.height < 9
                && !searchedTiles.includes(neighbour)
                && !tilesToSearch.includes(neighbour)
            ) {
                tilesToSearch.push(neighbour);
            }
        })
    }

    return searchedTiles;
}

/**
 * Get 3 largest "basins" and multiply their sizes together.
 * To find the basins, start from each "low point", and do depth first search.
 */
function solver(heightMap: Tile[][]): number {
    const lowestTiles = getLowestTiles(heightMap);

    const basins: Tile[][] = [];
    forEach(lowestTiles, (tile) => {
        basins.push(getBasin(tile, heightMap));
    })

    // sort basins by size, descending order
    basins.sort((basinA, basinB) => basinB.length - basinA.length);

    return basins[0].length * basins[1].length * basins[2].length;
}

try {
    const input = fs.readFileSync('./in/input9.txt', 'utf8');
    const heightMap = input.split('\n').map(
        (lineStr, row) => lineStr.split("").map(
            (num, col) => ({
                height: parseInt(num, 10),
                row,
                col
            })
        )
    );

    const riskLevel = solver(heightMap);

    console.log(`Risk ${riskLevel}`);

} catch (err) {
    console.error(err);
}


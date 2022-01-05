import fs from 'fs'
import { last, toUpper } from 'lodash';

type PathMap = {
    [origin: string]: string[]
}

function makePathMap(paths: string[][]): PathMap {
    const map: PathMap = {};
    for (const path of paths) {
        const pathStart = path[0];
        const pathEnd = path[1];

        if (map[pathStart]) {
            map[pathStart].push(pathEnd);
        } else {
            map[pathStart] = [pathEnd]
        }

        if (map[pathEnd]) {
            map[pathEnd].push(pathStart);
        } else {
            map[pathEnd] = [pathStart]
        }
    }

    return map;
}

/**
 * (For part 2): fulfills requirements of visiting at most 1 small cave twice, 
 * all other small caves once
 */
function isValidPath(pathList: string[]): boolean {
    const visitCount: { [key: string]: number } = {};
    for (const pos of pathList) {
        if (visitCount[pos] === undefined) {
            visitCount[pos] = 1;
        } else {
            visitCount[pos] += 1;
        }
    }

    let visitedSmallCaveTwice = false;
    for (const pos in visitCount) {
        if (pos === 'start' && visitCount[pos] > 1) {
            return false;
        }
        if (pos === 'end' && visitCount[pos] > 1) {
            return false;
        }
        if (pos !== toUpper(pos)) {
            if (visitCount[pos] > 2) {
                return false
            }
            if (visitCount[pos] === 2) {
                if (!visitedSmallCaveTwice) {
                    visitedSmallCaveTwice = true;
                } else {
                    return false;
                }
            }
        }
    }

    return true;
}

/** 
 * Recursive function finding the paths given the available map and current visited path 
 * Visits one small caves at most TWICE, the other small caves at most ONCE.
 * */
function findPaths2(pathMap: PathMap, pathSoFar: string): string[] {
    let paths: string[] = [];

    const pathSoFarList = pathSoFar.split(',');
    const currentPos = last(pathSoFarList);

    if (currentPos === undefined) {
        console.error('Unexpected: could not find current position.')
        return [];
    }

    if (currentPos === 'end') {
        return [pathSoFar];
    }

    if (!isValidPath(pathSoFarList)) {
        return [];
    }

    const nextSteps = pathMap[currentPos] || [];

    for (const nextStep of nextSteps) {
        const nextPath = `${pathSoFar},${nextStep}`;
        paths = paths.concat(findPaths2(pathMap, nextPath));
    }

    return paths;
}


function solve(paths: string[][]) {
    const pathMap = makePathMap(paths);
    const allPaths2 = findPaths2(pathMap, "start");

    console.log(`Found ${allPaths2.length} paths that visit the small caves at most twice`)
}

try {
    const input = fs.readFileSync('./in/input12.txt', 'utf8');
    const paths = input.split('\n').map(line => line.split('-'));

    solve(paths);
} catch (err) {
    console.error(err);
}

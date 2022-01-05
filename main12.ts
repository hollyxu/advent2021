import fs from 'fs'
import { countBy, groupBy, last, omit, omitBy, some, toUpper } from 'lodash';

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
 * Recursive function finding the paths given the available map and current visited path 
 * Visits the small caves at most once.
 * */
function findPaths(pathMap: PathMap, pathSoFar: string): string[] {
    let paths: string[] = [];

    const currentPos = last(pathSoFar.split(','));

    if (currentPos === undefined) {
        console.error('Could not find current position?')
        return [];
    }

    if (currentPos === 'end') {
        return [pathSoFar];
    }

    const nextSteps = pathMap[currentPos];

    if (!nextSteps) {
        // Not a valid path
        return [];
    }

    const updatedPathMap = toUpper(currentPos) === currentPos ? pathMap : omit(pathMap, currentPos);

    for (const nextStep of nextSteps) {
        const nextPath = `${pathSoFar},${nextStep}`;
        paths = paths.concat(findPaths(updatedPathMap, nextPath));
    }

    return paths;
}

function solve(paths: string[][]) {
    const pathMap = makePathMap(paths);
    const allPaths = findPaths(pathMap, "start");
    console.log(`Found ${allPaths.length} paths that visit the small caves at most once`)
}

try {
    const input = fs.readFileSync('./in/input12.txt', 'utf8');
    const paths = input.split('\n').map(line => line.split('-'));

    solve(paths);
} catch (err) {
    console.error(err);
}

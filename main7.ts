import fs from 'fs'
import { min } from 'lodash';

/**
 * Return the min number of fuel for the crabs.
 */
function solver(locations: number[]): number {
    const sortedLocations = [...locations].sort((a,b) => a-b);

    const middleCrabIndex = [];
    if (locations.length % 2 === 0) {
        middleCrabIndex.push(locations.length/2-1);
        middleCrabIndex.push(locations.length/2);
    } else {
        middleCrabIndex.push(locations.length/2-1);
    }

    const results: number[] = [];
    for (var i = 0; i < middleCrabIndex.length; i++) {
        let sum = 0;
        const middleCrabPos = sortedLocations[middleCrabIndex[i]];
        for (var j= 0; j < sortedLocations.length; j++) {
            sum += Math.abs(middleCrabPos - sortedLocations[j]);
        }
        results.push(sum)
    }

    return min(results) as number;
}

try {
    const input = fs.readFileSync('./in/input7.txt', 'utf8');
    const crabLocations = input.split(',').map(num => parseInt(num, 10));

    const minFuel = solver(crabLocations);

    console.log(`Min fuel is ${minFuel}`);

} catch (err) {
    console.error(err);
}


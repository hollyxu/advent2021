import fs from 'fs'
import { min, reduce, sum } from 'lodash';

function findCost(locations: number[], proposedLocation: number) {
    return reduce(locations, (sumSoFar, currentLocation) => {
        const distance = Math.abs(currentLocation - proposedLocation);
        const cost = distance * (distance + 1) / 2;
        return sumSoFar + cost;
    }, 0)
}

/**
 * Return the min number of fuel for the crabs.
 */
function solver(locations: number[]): number {
    const sortedLocations = [...locations].sort((a, b) => a - b);

    // Try all solutions, finding minimum.

    let minSolution = findCost(sortedLocations, sortedLocations[0]);
    
    for (var j = sortedLocations[0]; j < sortedLocations[sortedLocations.length-1]; j++) {
        const newCost = findCost(sortedLocations, j)
        minSolution = Math.min(minSolution, newCost);
    }

    return minSolution;
}

try {
    const input = fs.readFileSync('./in/input7.txt', 'utf8');
    const crabLocations = input.split(',').map(num => parseInt(num, 10));

    const minFuel = solver(crabLocations);

    console.log(`Min fuel is ${minFuel}`);

} catch (err) {
    console.error(err);
}


import fs from 'fs'
import { isEmpty, reject, chunk } from 'lodash';

const REPRODUCE_RATE = 7;

/**
 * Return the number of fish after N days. Better iterative solution
 */
function solver(initialFishTimer: number[], days: number): number {
    // Example, for initialFishTimer of 3,4,3,1,2 yields array => [0,1,1,2,1,0,0,0,0]
    const fishByTimeToBreed = new Array(REPRODUCE_RATE + 2).fill(0);

    // Seed array
    for (var i = 0; i < initialFishTimer.length; i++) {
        fishByTimeToBreed[initialFishTimer[i]] += 1;
    }

    // Step through days
    for (var i = 0; i < days; i++) {
        const fishBreedingToday = fishByTimeToBreed[0];
        fishByTimeToBreed.shift();
        fishByTimeToBreed[REPRODUCE_RATE-1] += fishBreedingToday;
        fishByTimeToBreed.push(fishBreedingToday)
    }

    let totalFish = 0;

    for (var i = 0; i < fishByTimeToBreed.length; i++) {
        totalFish += fishByTimeToBreed[i];
    }

    return totalFish;
}

try {
    const input = fs.readFileSync('./in/input6.txt', 'utf8');
    const initialFishTimer = input.split(',').map(num => parseInt(num, 10));

    const numDays = 256;
    const numFish = solver(initialFishTimer, numDays);

    console.log(`After ${numDays} days, there's ${numFish} fish.`);

} catch (err) {
    console.error(err);
}


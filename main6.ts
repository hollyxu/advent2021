import fs from 'fs'
import { isEmpty, reject, chunk } from 'lodash';

const REPRODUCE_RATE = 7;

/**
 * Return the number of fish after N days
 */
function solver(initialFishTimer: number[], days: number): number {
    let fishTimer = [...initialFishTimer];
    console.log(fishTimer);
    for (var d = 0; d < days; d++) {
        let newFish = [];
        for (var i = 0; i < fishTimer.length; i++) {
            fishTimer[i] -= 1;
            if (fishTimer[i] === -1) {
                fishTimer[i] = REPRODUCE_RATE - 1;
                newFish.push((REPRODUCE_RATE - 1) + 2);
            }
        }
        fishTimer = fishTimer.concat(newFish);

        console.log(`Day ${d} ${fishTimer}`)
    }

    return fishTimer.length;
}

try {
    const input = fs.readFileSync('./in/input6.txt', 'utf8');
    const initialFishTimer = input.split(',').map(num => parseInt(num, 10));

    const numDays = 80;
    const numFish = solver(initialFishTimer, numDays);

    console.log(`After ${numDays} days, there's ${numFish} fish.`);

} catch (err) {
    console.error(err);
}


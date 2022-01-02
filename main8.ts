import fs from 'fs'
import { isEmpty, min, reduce, reject, sum } from 'lodash';

type Flash = {
    // sequence of observed flashes
    input: string[],
    // 4 "digit" output flash
    output: string[]
}

/**
 * Count strings with # 2, 3, 4, 7
 */
function solver(flashes: Flash[]): number {
    let count1478 = 0;
    for (var i = 0; i < flashes.length; i++) {
        const outputFlashes = flashes[i].output;
        for (var j = 0; j < outputFlashes.length; j++) {
            const flashLength = outputFlashes[j].length;
            if (flashLength === 2 || flashLength === 4 || flashLength === 3 || flashLength === 7) {
                count1478 += 1;
            }
        }
    }

    return count1478;
}

function parseRawSignals(rawSignals: string[]): Flash[] {
    return rawSignals.map((line) => {
        const inputOutput = line.split('|').map(flashes => reject(flashes.split(' '), isEmpty));

        return {
            input: inputOutput[0],
            output: inputOutput[1]
        }
    })
}

try {
    const input = fs.readFileSync('./in/input8.txt', 'utf8');
    const signalLines = input.split('\n');
    const signals = parseRawSignals(signalLines);

    const count1478 = solver(signals);

    console.log(`Count ${count1478}`);

} catch (err) {
    console.error(err);
}


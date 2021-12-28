import fs from 'fs'
import { isEmpty, reject } from 'lodash';

try {
    const input = fs.readFileSync('./in/input3.txt', 'utf8');
    const binaries = reject(input.split('\n'), isEmpty);

    const zeroCount: number[] = Array(binaries[0].length).fill(0);

    binaries.forEach((binary) => {
        for (var i = 0; i < binary.length; i++) {
            if (binary[i] === '0') {
                zeroCount[i] += 1;
            }
        }
    })

    var mostCommon = '';
    var leastCommon = '';

    const majorityNeeded = binaries.length / 2;

    zeroCount.forEach((count: number) => {
        if (count > majorityNeeded) {
            mostCommon += '0';
            leastCommon += '1';
        } else {
            mostCommon += '1';
            leastCommon += '0';
        }
    })

    console.log(mostCommon);
    console.log(leastCommon);

    const multiplied = parseInt(mostCommon, 2) * parseInt(leastCommon, 2);

    console.log(multiplied);
} catch (err) {
    console.error(err);
}


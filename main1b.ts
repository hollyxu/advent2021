import fs from 'fs'
import { isEmpty, reject } from 'lodash';

try {
    const input = fs.readFileSync('./in/input1.txt', 'utf8');
    const depths = reject(input.split('\n'), isEmpty);
    const cleanedDepths = depths.map((str: string) => parseInt(str, 10));


    var growth = 0;

    for (var i = 0; i < cleanedDepths.length - 3; i++) {
        if (cleanedDepths[i + 3] > cleanedDepths[i]) {
            growth += 1;
        }
    }

    console.log(growth);
} catch (err) {
    console.error(err);
}


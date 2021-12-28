import fs from 'fs'
import { isEmpty, reject } from 'lodash';

try {
    const input = fs.readFileSync('./in/input4.txt', 'utf8');
    const binaries = reject(input.split('\n'), isEmpty);

} catch (err) {
    console.error(err);
}


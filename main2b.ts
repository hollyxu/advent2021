import fs from 'fs'
import { isEmpty, reject } from 'lodash';

try {
    const input = fs.readFileSync('./in/input2.txt', 'utf8');
    const commands = reject(input.split('\n'), isEmpty);

    var horizontal = 0;
    var depth = 0;
    var aim = 0;

    commands.forEach((command: string) => {
        const partialCommand = command.split(' ');
        const direction = partialCommand[0];
        const amount = parseInt(partialCommand[1], 10);

        if (direction === 'forward') {
            horizontal += amount; 
            depth += aim * amount;
        } else if (direction === 'down') {
            aim += amount;
        } else if (direction === 'up') {
            aim -= amount;
        } else {
            console.error(`bad command ${direction}`)
        }
    })

    const multiplied = horizontal * depth;

    console.log(multiplied);
} catch (err) {
    console.error(err);
}


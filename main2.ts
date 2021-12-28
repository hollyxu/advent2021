import fs from 'fs'
import { isEmpty, reject } from 'lodash';

try {
    const input = fs.readFileSync('./in/input2.txt', 'utf8');
    const commands = reject(input.split('\n'), isEmpty);

    var horizontal = 0;
    var vertical = 0;

    commands.forEach((command: string) => {
        const partialCommand = command.split(' ');
        const direction = partialCommand[0];
        const amount = parseInt(partialCommand[1], 10);

        if (direction === 'forward') {
            horizontal += amount; 
        } else if (direction === 'down') {
            vertical += amount;
        } else if (direction === 'up') {
            vertical -= amount;
        } else {
            console.error(`bad command ${direction}`)
        }
    })

    const multiplied = horizontal * vertical;

    console.log(multiplied);
} catch (err) {
    console.error(err);
}


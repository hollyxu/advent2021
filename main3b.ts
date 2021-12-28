import fs from 'fs'
import { isEmpty, reject } from 'lodash';

enum MostCommon {
    Zero = 0,
    One = 1,
    Neither = 2
};

enum Preference {
    Uncommon = 0,
    Common = 1,
}

/**
 * Determines if 1, 0, or neither is most common 
 * in the index of specified list of binaries
 */
function isMostCommon(list: string[], index: number): MostCommon {
    var zeroCount = 0;
    var oneCount = 0;

    for (var i = 0; i < list.length; i++) {
        if (list[i][index] === '0') {
            zeroCount += 1;
        } else {
            oneCount += 1;
        }
    }

    if (zeroCount > oneCount) {
        return MostCommon.Zero;
    } else if (oneCount > zeroCount) {
        return MostCommon.One;
    } else {
        return MostCommon.Neither;
    }
}

/**
 * Accepts a list of binary numbers and returns a list
 * Looks at the index of each number and keeps/rejects according to preference condition 
 */
function filterList(list: string[], index: number, preference: Preference): string[] {
    const mostCommonAtIndex = isMostCommon(list, index);

    let digitToKeep: number;

    if (mostCommonAtIndex === MostCommon.One) {
        digitToKeep = 1;
    } else if (mostCommonAtIndex === MostCommon.Zero) {
        digitToKeep = 0;
    } else {
        digitToKeep = 1;
    }

    // Reverse the digit to keep if preference is flipped
    if (preference === Preference.Uncommon) {
        digitToKeep = digitToKeep === 0 ? 1 : 0;
    }

    const filteredList = list.filter(binary => {
        return binary[index] === digitToKeep.toString();
    })

    return filteredList;
}

/**
 * Iterates through the indicies in order to filter initialList down to single number.
 */
function findLastNumber(initialList: string[], preference: Preference): string {
    let list = initialList;
    let index = 0;

    while (list.length > 1) {
        if (index === list[0].length) {
            console.error('Ran out of indicies to consider to narrow numbers');
            console.error(list);
            break;
        }
        list = filterList(list, index, preference);

        index ++;
    }

    return list[0];
}

try {
    const input = fs.readFileSync('./in/input3.txt', 'utf8');
    const binaries = reject(input.split('\n'), isEmpty);

    const oxygenNumber = parseInt(findLastNumber(binaries, Preference.Common), 2);
    const carbonNumber = parseInt(findLastNumber(binaries, Preference.Uncommon), 2);

    console.log( oxygenNumber * carbonNumber);
} catch (err) {
    console.error(err);
}


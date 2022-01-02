import fs from 'fs'
import { invert, isEmpty, map, min, reduce, reject, sum } from 'lodash';

type Flash = {
    // sequence of observed flashes
    input: string[],
    // 4 "digit" output flash
    output: string[]
}

type Digit2Signal = {
    [digit: number]: string
}

/** Helper function */
function signalDiff(signal: string, feature: string) {
    let newChar = "";

    for (var i = 0; i < signal.length; i++) {
        if (!feature.includes(signal[i])) {
            newChar += signal[i];
        }
    }

    return newChar;
}

/** Helper function */
function containsSignal(signal: string, feature: string) {
    for (var i = 0; i < feature.length; i++) {
        if (!signal.includes(feature[i])) {
            return false;
        }
    }

    return true;
}

/** Helper function */
function areEquivalent(signal: string, proposedSignal: string) {
    return signal.length === proposedSignal.length 
        && containsSignal(signal, proposedSignal);
}

function calc5(signals: string[], mappingNum: Digit2Signal): string {
    const fourLFeature = signalDiff(mappingNum[4], mappingNum[1]);
    for (var i = 0; i < signals.length; i++) {
        if (signals[i].length === 5 && containsSignal(signals[i], fourLFeature)) {
            return signals[i]
        }
    }

    console.error('Could not find 5');
    return "";
}

/** Requires 5 to be found */
function calc6(signals: string[], mappingNum: Digit2Signal) {
    const topRightStick = signalDiff(mappingNum[1], mappingNum[5]);
    const scrambled6 = signalDiff(mappingNum[8], topRightStick);
    for (var i = 0; i < signals.length; i++) {
        if (signals[i].length === 6 && areEquivalent(signals[i], scrambled6)) {
            return signals[i]
        }
    }

    console.error('Could not find 6');
    return "";
}

/** Requires 5, 6 to be found */
function calc2(signals: string[], mappingNum: Digit2Signal) {
    const bottomLeftStick = signalDiff(mappingNum[6], mappingNum[5]);

    for (var i = 0; i < signals.length; i++) {
        if (signals[i].length === 5 && containsSignal(signals[i], bottomLeftStick)) {
            return signals[i]
        }
    }

    console.error('Could not find 2');
    return "";
}

/** Requires 5, 6, 2 to be found */
function calc3(signals: string[], mappingNum: Digit2Signal) {
    for (var i = 0; i < signals.length; i++) {
        const sig = signals[i];
        if (sig.length === 5 && sig !== mappingNum[2] && sig !== mappingNum[5]) {
            return sig
        }
    }

    console.error('Could not find 3');
    return "";
}

/** Requires 5, 6, 2, 3 to be found */
function calc9(signals: string[], mappingNum: Digit2Signal) {
    for (var i = 0; i < signals.length; i++) {
        const sig = signals[i];
        if (sig.length === 6 && containsSignal(sig, mappingNum[3])) {
            return sig
        }
    }

    console.error('Could not find 9');
    return "";
}

/** Requires 5, 6, 2, 3, 9 to be found */
function calc0(signals: string[], mappingNum: Digit2Signal) {
    for (var i = 0; i < signals.length; i++) {
        const sig = signals[i];
        if (sig.length === 6 && sig !== mappingNum[6] && sig !== mappingNum[9]) {
            return sig
        }
    }

    console.error('Could not find 0');
    return "";
}

function findEquivalentSignal(mapping: Digit2Signal, digit: string): string {
    for (var num in mapping) {
        if (areEquivalent(mapping[num], digit)) {
            return num;
        }
    }

    console.error('Could not identify digit');
    console.log(digit);
    console.log(mapping);
    return ""
}

/**
 * Given a line, decode it to get the output
 * Unscramble starting flashes, then use mapping to return output
 */
function decodeOutput(flash: Flash): number {
    const mappingNum: Digit2Signal = {};

    for (var i = 0; i < flash.input.length; i++)  {
        const curr = flash.input[i];
        if (curr.length === 2) {
            mappingNum[1] = curr;
        } else if (curr.length === 3) {
            mappingNum[7] = curr;
        } else if (curr.length === 4) {
            mappingNum[4] = curr;
        } else if (curr.length === 7) {
            mappingNum[8] = curr;
        }
    }

    const num5Char = calc5(flash.input, mappingNum);
    mappingNum[5] = num5Char;

    const num6Char = calc6(flash.input, mappingNum);
    mappingNum[6] = num6Char;

    const num2Char = calc2(flash.input, mappingNum);
    mappingNum[2] = num2Char;

    const num3Char = calc3(flash.input, mappingNum);
    mappingNum[3] = num3Char;

    const num9Char = calc9(flash.input, mappingNum);
    mappingNum[9] = num9Char;

    const num0Char = calc0(flash.input, mappingNum);
    mappingNum[0] = num0Char;
    
    const outputString = reduce(flash.output, 
        (strSoFar, digit) => strSoFar += findEquivalentSignal(mappingNum, digit), 
        "")

    return parseInt(outputString, 10);
}

/**
 * Get sum of decoded outputs
 */
function solver(flashes: Flash[]): number {
    let outputSum = 0;
    for (var i = 0; i < flashes.length; i++) {
        outputSum += decodeOutput(flashes[i]);
    }

    return outputSum;
}

function parseRawSignals(rawSignals: string[]): Flash[] {
    return rawSignals.map((line) => {
        const inputOutput = line.split('|').map(
            flashes => reject(flashes.split(' '), isEmpty)
        );

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

    const sum = solver(signals);

    console.log(`Sum ${sum}`);

} catch (err) {
    console.error(err);
}


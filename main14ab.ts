import fs from 'fs'
import {} from 'lodash';

type PolymerMap = {
    [polymerPiece: string]: string
}

type PolymerPieces = {
    [polymerPiece: string]: number
}

type InputData = {
    initialPolymer: string;
    polymerMap: PolymerMap;
}

// Given initial polymer piece counter, iterate one step
function makePolymerPieces(pieces: PolymerPieces, polymerMap: PolymerMap): PolymerPieces {
    const newMap: PolymerPieces = {};

    for (const piecePair in pieces) {
        const middleElem = polymerMap[piecePair];
        const firstNewPair = piecePair[0] + middleElem;
        const secondNewPair = middleElem + piecePair[1];
        const count = pieces[piecePair];

        if (newMap[firstNewPair] === undefined) {
            newMap[firstNewPair] = count;
        } else {
            newMap[firstNewPair] += count;
        }

        if (newMap[secondNewPair] === undefined) {
            newMap[secondNewPair] = count;
        } else {
            newMap[secondNewPair] += count;
        }
    }

    return newMap;
}


// Takes initial polymer and converst to polymer piece-counting data structure
// Ex. NNNB => { [NN]: 2, [NB]: 1 }
function toPolymerPieces(polymer: string): PolymerPieces {
    const pieceCount: PolymerPieces = {};
    for (var i = 0; i < polymer.length - 1; i++) {
        const piece = polymer.substring(i, i+2);
        if (pieceCount[piece]) {
            pieceCount[piece] += 1;
        } else {
            pieceCount[piece] = 1;
        }
    }

    return pieceCount;
}

function calculateScore({initialPolymer, polymerMap}: InputData, steps: number): number {
    const firstElem = initialPolymer[0];
    const lastElem = initialPolymer[initialPolymer.length-1];

    let newPieces = toPolymerPieces(initialPolymer);
    for (var i = 0 ; i < steps; i++) {
        newPieces = makePolymerPieces(newPieces, polymerMap);
    }

    const elemCounter: PolymerPieces = {};

    for (const piece in newPieces) {
        const firstPiece = piece[0];
        const secondPiece = piece[1];
        const count = newPieces[piece];

        if (elemCounter[firstPiece] === undefined) {
            elemCounter[firstPiece] = count;
        } else {
            elemCounter[firstPiece] += count;
        }

        if (elemCounter[secondPiece] === undefined) {
            elemCounter[secondPiece] = count;
        } else {
            elemCounter[secondPiece] += count;
        }
    }

    // because we store pairs, each polymer element is duplicated with the exception of 
    // the first & last element, we "back fill" them so ALL elements are duplicated.
    elemCounter[firstElem] += 1;
    elemCounter[lastElem] += 1;

    // remembering to de-duplicate.
    let minCount = elemCounter[firstElem] / 2;
    let maxCount = elemCounter[firstElem] / 2;
    for (const key in elemCounter) {
        const count = elemCounter[key] / 2;
        if (count < minCount) {
            minCount = count;
        }
        if (count > maxCount) {
            maxCount = count;
        }
    }

    return maxCount - minCount;
}

function solve(inputData: InputData) {
    console.log(`Score after 10 runs is ${calculateScore(inputData, 10)}`);
    console.log(`Score after 40 runs is ${calculateScore(inputData, 40)}`);
}

function parseInput(input: string): InputData {
    const inputs = input.split('\n\n');
    const initialPolymer = inputs[0];
    const polymerStr = inputs[1].split('\n');

    const polymerMap: PolymerMap = {};

    for (const line of polymerStr) {
        const [from, to] = line.split(' -> ');
        polymerMap[from] = to;
    }

    return {
        initialPolymer,
        polymerMap
    }
}

try {
    const input = fs.readFileSync('./in/input14.txt', 'utf8');
    const parsedData = parseInput(input);

    solve(parsedData);
} catch (err) {
    console.error(err);
}

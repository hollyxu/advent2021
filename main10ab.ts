import fs from 'fs'
import { isEmpty, reduce } from 'lodash';

type BracketData = {
    [bracket: string]: {
        score: number,
        matchingBracket: string
    }
}

const CloseBracketScore: BracketData = {
    ")": {
        score: 3,
        matchingBracket: "("
    },
    "]": {
        score: 57,
        matchingBracket: "["
    },
    "}": {
        score: 1197,
        matchingBracket: "{"
    },
    ">": {
        score: 25137,
        matchingBracket: "<"
    }
}

const OpenBracketScore: BracketData = {
    "(": {
        score: 1,
        matchingBracket: ")"
    },
    "[": {
        score: 2,
        matchingBracket: "]"
    },
    "{": {
        score: 3,
        matchingBracket: "}"
    },
    "<": {
        score: 4,
        matchingBracket: ">"
    }
}

function bracketMatch(expectedOpen: string, expectedClose: string) {
    return CloseBracketScore[expectedClose]?.matchingBracket === expectedOpen;
}

function calculateErrorScore(line: string): number {
    const bracketQueue: string[] = [];

    for (var i = 0; i < line.length; i++) {
        const bracket = line[i];
        if (!(bracket in CloseBracketScore)) {
            // is an open bracket
            bracketQueue.push(bracket);
        } else {
            // is a closed bracket
            if (bracketQueue.length > 0) {
                // try to find matching opener
                const expectedOpening = bracketQueue.pop();
                if (!expectedOpening || !bracketMatch(expectedOpening, bracket)) {
                    return CloseBracketScore[bracket].score
                }
            } else {
                // if no opener exists, it's also an error
                return CloseBracketScore[bracket].score
            }
        }
    }

    if (bracketQueue.length > 0) {
        return 0;
    }

    return 0;
}

function calculateAutoCorrectLineScore(line: string): number {
    const bracketQueue: string[] = [];

    for (var i = 0; i < line.length; i++) {
        const bracket = line[i];
        if (!(bracket in CloseBracketScore)) {
            // is an open bracket
            bracketQueue.push(bracket);
        } else {
            // is a closed bracket
            if (bracketQueue.length > 0) {
                // try to find matching opener
                const expectedOpening = bracketQueue.pop();
                if (!expectedOpening || !bracketMatch(expectedOpening, bracket)) {
                    return 0;
                }
            } else {
                // if no opener exists, it's also an error
                return 0;
            }
        }
    }

    if (bracketQueue.length > 0) {
        let score = 0;
        for (var i = bracketQueue.length - 1; i >= 0; i--) {
            const openBracket = bracketQueue[i];
            score = score * 5 + OpenBracketScore[openBracket].score
        }
        return score;
    }

    // Otherwise, it's a correct line
    return 0;
}

/**
 * Get risky areas and calculate risk level
 */
function solver(lines: string[]) {
    const corruptScore = reduce(lines, (sumSoFar, currentLine) =>
        sumSoFar + calculateErrorScore(currentLine)
        , 0)

    const autoCorrectLineScores = lines
        .map(line => calculateAutoCorrectLineScore(line))
        .filter(score => score !== 0);

    autoCorrectLineScores.sort((a, b) => a - b);
    const autoCorrectScore = autoCorrectLineScores[Math.floor(autoCorrectLineScores.length / 2)];

    console.log(`Syntax Score for Corrupt Lines (part 1) ${corruptScore}`);
    console.log(`Syntax Score for Incomplete Lines (part 2) ${autoCorrectScore}`);
}

try {
    const input = fs.readFileSync('./in/input10.txt', 'utf8');
    const syntaxLines = input.split('\n');

    solver(syntaxLines);

} catch (err) {
    console.error(err);
}


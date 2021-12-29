import fs from 'fs'
import { chunk, isEmpty, range, reject } from 'lodash';

type Bingo = number[][];
type BingoState = boolean[][];

/**
 * Given a Bingo board state, determine if there is Bingo
 */
function isBingo(bingoState: BingoState): boolean {
    const len = 5;
    for (let i = 0; i < len; i++) {
        let verticalWin = true;
        let horizontalWin = true;
        for (let j = 0; j < len; j++) {
            if (bingoState[i][j] !== true) {
                horizontalWin = false;
            }
            if (bingoState[j][i] !== true) {
                verticalWin = false;
            }
        }
        if (horizontalWin || verticalWin) {
            return true;
        }
    }

    return false;
}

/**
 * Mutates input `state`. 
 */
function calculateNextState(bingoCall: number, state: BingoState, board: Bingo): BingoState {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === bingoCall) {
                state[i][j] = true;
                return state;
            }
        }
    }
    return state;
}

function getBoardScore(board: Bingo, state: BingoState, lastCalled: number): number {
    let unmarkedNumSum = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (!state[i][j]) {
                unmarkedNumSum += board[i][j];
            }
        }
    }

    return lastCalled * unmarkedNumSum;
}

/**
 * Calls numbers every round, and determine if any boards win.
 * Mutates bingo boards (Because they contain state).
 */
function solver(bingoCalls: number[], bingoBoards: Bingo[]): number {
    // To find the last board that wins, keep track of number of boards that already won.
    let winCount = 0;
    let bingoCallIndex = 0;

    let boardStates = [];
    let boardWinState = Array(bingoBoards.length).fill(false);

    // initialize bingo board states. lazy magic numbers
    for (let i = 0; i < bingoBoards.length; i++) {
        boardStates.push(chunk(Array(25).fill(false), 5));
    }

    while (winCount < bingoBoards.length) {
        if (bingoCallIndex === bingoCalls.length) {
            console.error("No solution found. Out of bingo calls");
            break;
        }

        const calledNumber = bingoCalls[bingoCallIndex];

        // Update state for each board
        for (let i = 0; i < bingoBoards.length; i++) {
            boardStates[i] = calculateNextState(calledNumber, boardStates[i], bingoBoards[i]);
            if (isBingo(boardStates[i]) && !boardWinState[i]) {
                winCount += 1;
                boardWinState[i] = true;
                if (winCount === bingoBoards.length) {
                    return getBoardScore(bingoBoards[i], boardStates[i], calledNumber);
                }
            }
        }

        bingoCallIndex++;
    }

    return 0;
}

try {
    const input = fs.readFileSync('./in/input4.txt', 'utf8');
    const semiRawData = reject(input.split('\n'), isEmpty);

    // first line is bingo calls
    const bingoCalls = semiRawData[0].split(',').map(bingoBall => parseInt(bingoBall, 10));

    // rest of the lines is bingo boards
    const boards: Bingo[] = [];
    const numberOfBoards = (semiRawData.length - 1) / 5

    for (let i = 0; i < numberOfBoards; i++) {
        const newBoard: Bingo = [];
        for (let line = 0; line < 5; line++) {
            const dataIndex = i * 5 + line + 1; // Remember to ignore first line
            const boardLine = reject(semiRawData[dataIndex].split(' '), isEmpty);
            newBoard.push(boardLine.map(num => parseInt(num, 10)));
        }
        boards.push(newBoard);
    }

    const bestScore = solver(bingoCalls, boards);
    console.log(bestScore);

} catch (err) {
    console.error(err);
}


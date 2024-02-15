/*
 * Created on Sun Feb 11 2024
 * Author: Connor Doman
 */

import { generate, count } from "random-words";
import chalk from "chalk";
import { DEVELOPMENT } from "@/lib/config";

export const WIDTH = 12;
export const HEIGHT = 12;
export const NUMBER_OF_WORDS = 20;
export const PLACEHOLDER = "_";
export const DEFAULT_FILL_WITH_RANDOM_LETTERS = true;
export const WORDSEARCH_DEBUG = DEVELOPMENT || false;

export function debug(...args: any[]) {
    if (WORDSEARCH_DEBUG) {
        console.log(...args);
    }
}

export interface WordPlacementCoords {
    row: number;
    col: number;
}

export interface WordPlacements {
    [word: string]: WordPlacementCoords[];
}

export interface WordSearchState {
    board: string[][];
    words: string[];
    width: number;
    height: number;
    randomLetters: string[][];
    wordPlacements: WordPlacements;
    foundWords: string[];
}

type WordPlacementAttempt = WordSearchState | false;

export type WordSearchGuess = WordPlacementCoords[];

function sortPlacementCoords(a: WordPlacementCoords, b: WordPlacementCoords): number {
    if (a.row === b.row) {
        return a.col - b.col;
    }
    return a.row - b.row;
}

export abstract class WordSearch {
    static createGame(words?: string[], width?: number, height?: number): WordSearchState {
        const w = width || WIDTH;
        const h = height || HEIGHT;
        const wordList = words || WordSearch.randomWordList(NUMBER_OF_WORDS);
        const board = WordSearch.createEmptyBoard(w, h);
        const randomLetters = WordSearch.generateRandomLetters(w, h);

        let game: WordSearchState = {
            board,
            words: wordList,
            width: w,
            height: h,
            randomLetters,
            wordPlacements: {},
            foundWords: [],
        };

        game = WordSearch.placeWords(game);
        WordSearch.printBoard(game, false, DEFAULT_FILL_WITH_RANDOM_LETTERS, false, false);

        return game;
    }

    static createEmptyBoard(width: number, height: number): string[][] {
        return Array.from({ length: height }, () => Array.from({ length: width }, () => "_"));
    }

    static guess(state: WordSearchState, letters: WordSearchGuess): WordSearchState | false {
        const { words, wordPlacements, foundWords } = state;

        letters = letters.sort(sortPlacementCoords);

        const compareGuess = (guess: WordSearchGuess, placement: WordPlacementCoords[]): boolean => {
            return (
                guess.length === placement.length &&
                guess.every((coord, i) => coord.row === placement[i].row && coord.col === placement[i].col)
            );
        };

        for (let word of words) {
            if (word in wordPlacements) {
                if (!compareGuess(letters, wordPlacements[word])) {
                    continue;
                }

                if (foundWords.includes(word)) {
                    console.log(`Word already found: ${word}`);
                    return state;
                }

                console.log(`Found word: ${word}`);
                const newFoundWords = [...foundWords, word];
                return { ...state, foundWords: newFoundWords };
            }
        }

        return false;
    }

    static placeWordAt(
        state: WordSearchState,
        row: number,
        col: number,
        word: string,
        reversed: boolean,
        direction: "horizontal" | "vertical" | "diagonal",
        diagonalDirection: 0 | 1 = 0
    ): WordSearchState {
        const { board, wordPlacements } = state;

        const letters = this.getLettersToCheck(word, reversed);

        wordPlacements[word] = wordPlacements[word] || [];

        // Random chance to reverse the word
        const wordCandidate = reversed ? word.split("").reverse().join("") : word;

        for (let i = 0; i < letters.length; i++) {
            let r = row;
            let c = col;
            if (direction === "horizontal") c = col + i;

            if (direction === "vertical") r = row + i;

            if (direction === "diagonal") {
                const offset = diagonalDirection ? word.length - i - 1 : i;
                r = row + i;
                c = col + offset;
            }

            wordPlacements[word].push({ row: r, col: c });
            board[r][c] = letters[i];
        }

        wordPlacements[word] = wordPlacements[word].sort(sortPlacementCoords);

        return { ...state, board, wordPlacements };
    }

    static placeWords(state: WordSearchState): WordSearchState {
        console.log("Placing words...");
        const { words, width, height } = state;
        const maxAttempts = WIDTH * HEIGHT;

        let newState = { ...state };

        let failedWords: string[] = [];

        words.forEach((word) => {
            console.log(`Placing word: ${word}...`);
            const isReversed = Math.random() > 0.3;
            let attempts = 0;
            let placed: WordSearchState | false = false;
            while (!placed) {
                const direction: number = Math.floor(Math.random() * 3); // Now 0, 1, or 2 for horizontal, vertical, or diagonal
                // const direction: number = 2;

                switch (direction) {
                    case 0:
                        placed = this.placeWordHorizontally(newState, word, isReversed);
                        break;
                    case 1:
                        placed = this.placeWordVertically(newState, word, isReversed);
                        break;
                    case 2:
                        placed = this.placeWordDiagonally(newState, word, isReversed);
                        break;
                }
                if (attempts > maxAttempts) {
                    console.error(`Failed to place word: ${word}`);
                    failedWords.push(word);
                    break;
                }
                attempts++;
            }

            // if the word was placed, update the state
            if (placed) {
                newState = { ...placed };
            }
        });

        newState.words = newState.words.filter((word) => !failedWords.includes(word));

        return newState;
    }

    static getLettersToCheck(word: string, reversed: boolean): string[] {
        const letters = word.split("").filter((letter) => letter !== " ");

        if (reversed) return letters.reverse();
        return letters;
    }

    static placeWordHorizontally(state: WordSearchState, word: string, reversed: boolean): WordPlacementAttempt {
        const { width, height, board, wordPlacements } = state;

        // preempt the word placement with a check for overlap
        const lettersToCheck = this.getLettersToCheck(word, reversed);

        const row = Math.floor(Math.random() * height);
        const col = Math.floor(Math.random() * (width - word.length));
        for (let i = 0; i < word.length; i++) {
            // if (board[row][col + i] !== PLACEHOLDER && board[row][col + i] !== lettersToCheck[i]) {
            //     return false; // Word overlaps incorrectly
            // }

            if (!this.checkLetterPlacement(lettersToCheck[i], board, row, col + i)) {
                debug("Failed to place word horizontally");
                return false;
            }
        }
        // Place the word
        return WordSearch.placeWordAt(state, row, col, word, reversed, "horizontal");
    }

    static placeWordVertically(state: WordSearchState, word: string, reversed: boolean): WordPlacementAttempt {
        const { width, height, board, wordPlacements } = state;

        // preempt the word placement with a check for overlap
        const lettersToCheck = this.getLettersToCheck(word, reversed);

        const row = Math.floor(Math.random() * (height - word.length));
        const col = Math.floor(Math.random() * width);
        for (let i = 0; i < word.length; i++) {
            // if (cell !== PLACEHOLDER && cell !== lettersToCheck[i]) {
            //     // debug(`Cell: ${cell}, Letter: ${lettersToCheck[i]} -> not allowed`);
            //     return false; // Word overlaps incorrectly
            // }
            // if (cell !== PLACEHOLDER) {

            // }
            if (!this.checkLetterPlacement(lettersToCheck[i], board, row + i, col)) {
                debug("Failed to place word vertically");
                return false;
            }
        }
        // Place the word
        return WordSearch.placeWordAt(state, row, col, word, reversed, "vertical");
    }

    static placeWordDiagonally(state: WordSearchState, word: string, reversed: boolean): WordPlacementAttempt {
        const { width, height, board, wordPlacements } = state;

        // preempt the word placement with a check for overlap
        const lettersToCheck = this.getLettersToCheck(word, reversed);

        // diagonal direction
        const direction = Math.random() > 0.5 ? 1 : 0; // 0 for down, 1 for up
        // const direction: 0 | 1 = 1;

        const maxStartRow = height - word.length;
        const maxStartCol = width - word.length;
        if (maxStartRow < 0 || maxStartCol < 0) return false; // Word too long to fit diagonally

        const row = Math.floor(Math.random() * (maxStartRow + 1));
        const col = Math.floor(Math.random() * (maxStartCol + 1));

        // diagonal up means you reflect on the x-axis and offset by the word length

        // Check if the word fits without incorrect overlap
        for (let i = 0; i < word.length; i++) {
            const offset = direction ? word.length - i - 1 : i;
            const r = row + i;
            const c = col + offset;

            // if (board[r][c] !== PLACEHOLDER && board[r][c] !== lettersToCheck[i]) {
            //     return false; // Word overlaps incorrectly
            // }

            if (!this.checkLetterPlacement(lettersToCheck[i], board, r, c)) {
                debug("Failed to place word diagonally " + (direction ? "up" : "down"));
                return false;
            }
        }

        // Place the word
        return WordSearch.placeWordAt(state, row, col, word, reversed, "diagonal", direction);
    }

    static getBoardWithRandomLetters(state: WordSearchState): string[][] {
        return state.board.map((row, r) =>
            row.map((cell, c) => (cell === "_" ? state.randomLetters[r][c] : cell.toUpperCase()))
        );
    }

    static colorizeBoard(state: WordSearchState): string[][] {
        return state.board.map((row) => row.map((cell) => chalk.blue(cell)));
    }

    static highlightWords(state: WordSearchState): string[][] {
        const { board, words, wordPlacements } = state;

        const highlightedBoard = board.map((row) => row.map((cell) => cell));
        words
            .flatMap((word) => {
                return wordPlacements[word];
            })
            .forEach((coords) => {
                const { row, col } = coords;
                highlightedBoard[row][col] = chalk.red(highlightedBoard[row][col]);
            });

        return highlightedBoard;
    }

    static printBoard(
        state: WordSearchState,
        showWordList = true,
        fillWithRandomLetters = true,
        colorize = true,
        highlightWords = true
    ) {
        let printableBoard: string[][] = [];

        if (fillWithRandomLetters) {
            printableBoard = WordSearch.getBoardWithRandomLetters(state);
        } else {
            printableBoard = state.board.map((row) => row.map((cell) => cell.toUpperCase()));
        }

        if (highlightWords) {
            printableBoard = WordSearch.highlightWords(state);
        }

        if (colorize) {
            printableBoard = WordSearch.colorizeBoard(state);
        }

        console.log(printableBoard.map((row) => row.join(" ")).join("\n"));

        if (showWordList) {
            console.log("\nWords:");
            console.log(state.words.join(", "));
        }
    }

    static getLetterAt(state: WordSearchState, index: number): string {
        const { width, randomLetters } = state;
        const row = Math.floor(index / width);
        const col = index % width;
        return WordSearch.getBoardWithRandomLetters(state)[row][col];
    }

    static randomWordList(length: number): string[] {
        return generate({ exactly: length, minLength: 4, maxLength: 11 }) as string[];
    }

    static generateRandomLetters(width: number, height: number): string[][] {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return Array.from({ length: height }).map((_) =>
            Array.from({ length: width }).map((_) => alphabet[Math.floor(Math.random() * alphabet.length)])
        );
    }

    static flattenBoard(state: WordSearchState): string[] {
        return WordSearch.getBoardWithRandomLetters(state).flat();
    }

    static flattenPlacements(state: WordSearchState): WordPlacementCoords[] {
        return Object.values(state.wordPlacements).flat();
    }

    static checkLetterPlacement(letter: string, board: string[][], row: number, col: number) {
        const cell = board[row][col];
        if (cell === letter || cell === PLACEHOLDER) {
            if (cell !== PLACEHOLDER) debug(`Allowed: Cell: ${cell} (${col},${row}), Letter: ${letter}`);
            return true;
        }
        debug(`Cell: ${cell} (${col},${row}), Letter: ${letter} -> not allowed`);

        return false;
    }
}

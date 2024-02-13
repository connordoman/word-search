/*
 * Created on Sun Feb 11 2024
 * Author: Connor Doman
 */

import { generate, count } from "random-words";
import chalk from "chalk";

export const WIDTH = 12;
export const HEIGHT = 12;
export const NUMBER_OF_WORDS = 20;
export const PLACEHOLDER = "_";
export const DEFAULT_FILL_WITH_RANDOM_LETTERS = true;

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

        console.table(game.wordPlacements);

        return game;
    }

    static createEmptyBoard(width: number, height: number): string[][] {
        return Array.from({ length: height }, () => Array.from({ length: width }, () => "_"));
    }

    static guess(state: WordSearchState, letters: WordSearchGuess): WordSearchState | false {
        const { words, wordPlacements, foundWords } = state;

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
        direction: string
    ): WordSearchState {
        const { board, wordPlacements } = state;

        wordPlacements[word] = wordPlacements[word] || [];

        // Random chance to reverse the word
        const wordCandidate = Math.random() > 0.3 ? word : word.split("").reverse().join("");

        for (let i = 0; i < wordCandidate.length; i++) {
            let r = row;
            let c = col;
            if (direction === "horizontal") c = col + i;

            if (direction === "vertical") r = row + i;

            if (direction === "diagonal") {
                r = row + i;
                c = col + i;
            }

            wordPlacements[word].push({ row: r, col: c });
            board[r][c] = wordCandidate[i];
        }

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
            let attempts = 0;
            let placed: WordSearchState | false = false;
            while (!placed) {
                const direction = Math.floor(Math.random() * 3); // Now 0, 1, or 2 for horizontal, vertical, or diagonal
                switch (direction) {
                    case 0:
                        placed = this.placeWordHorizontally(newState, word);
                        break;
                    case 1:
                        placed = this.placeWordVertically(newState, word);
                        break;
                    case 2:
                        placed = this.placeWordDiagonally(newState, word);
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

    static placeWordHorizontally(state: WordSearchState, word: string): WordPlacementAttempt {
        const { width, height, board, wordPlacements } = state;

        const row = Math.floor(Math.random() * height);
        const col = Math.floor(Math.random() * (width - word.length));
        for (let i = 0; i < word.length; i++) {
            if (board[row][col + i] !== "_" && board[row][col + i] !== word[i]) {
                return false; // Word overlaps incorrectly
            }
        }
        // Place the word
        return WordSearch.placeWordAt(state, row, col, word, "horizontal");
    }

    static placeWordVertically(state: WordSearchState, word: string): WordPlacementAttempt {
        const { width, height, board, wordPlacements } = state;

        const row = Math.floor(Math.random() * (height - word.length));
        const col = Math.floor(Math.random() * width);
        for (let i = 0; i < word.length; i++) {
            if (board[row + i][col] !== PLACEHOLDER && board[row + i][col] !== word[i]) {
                return false; // Word overlaps incorrectly
            }
        }
        // Place the word
        return WordSearch.placeWordAt(state, row, col, word, "vertical");
    }

    static placeWordDiagonally(state: WordSearchState, word: string): WordPlacementAttempt {
        const { width, height, board, wordPlacements } = state;

        const maxStartRow = height - word.length;
        const maxStartCol = width - word.length;
        if (maxStartRow < 0 || maxStartCol < 0) return false; // Word too long to fit diagonally

        const row = Math.floor(Math.random() * (maxStartRow + 1));
        const col = Math.floor(Math.random() * (maxStartCol + 1));

        // Check if the word fits without incorrect overlap
        for (let i = 0; i < word.length; i++) {
            if (board[row + i][col + i] !== "_" && board[row + i][col + i] !== word[i]) {
                return false; // Word overlaps incorrectly
            }
        }

        // Place the word
        return WordSearch.placeWordAt(state, row, col, word, "diagonal");
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
}

/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */

import { twMerge } from "tailwind-merge";

interface LetterButtonProps {
    row: number;
    col: number;
    letter: string;
    selected: boolean;
    correct: boolean;
    onClickLetter: (row: number, col: number) => void;
}

export const LetterButton = ({ row, col, letter, selected, correct, onClickLetter }: LetterButtonProps) => {
    return (
        <button
            className={twMerge(
                "transition-colors duration-200 text-xl aspect-square text-word-dark-grey dark:text-word-light-grey bg-word-light-grey dark:bg-word-dark-grey rounded active:text-word-grey active:bg-word-dark-grey dark:active:bg-word-button-active shadow",
                selected ? "border border-word-dark-grey dark:border-word-light-grey" : "",
                correct ? "bg-green-700 text-white dark:bg-green-900 dark:text-word-light-grey" : ""
            )}
            onClick={() => {
                onClickLetter(row, col);
            }}>
            {letter}
        </button>
    );
};

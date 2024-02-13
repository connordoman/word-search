/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */

interface LetterButtonProps {
    row: number;
    col: number;
    letter: string;
    onClickLetter: (row: number, col: number) => void;
}

export const LetterButton = ({ row, col, letter, onClickLetter }: LetterButtonProps) => {
    return (
        <button
            className="text-xl aspect-square text-word-dark-grey dark:text-word-light-grey bg-word-light-grey dark:bg-word-dark-grey rounded"
            onClick={() => {
                onClickLetter(row, col);
            }}>
            {letter}
        </button>
    );
};

/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */
"use client";

import { useEffect, useState } from "react";
import { LetterButton } from "./LetterButton";
import { WordSearchGuess } from "@/lib/valentines/2024/word-search";

interface WordSearchBoardProps {
    w: number;
    h: number;
    letters: string[];
    currentGuess: WordSearchGuess;
    onClickLetter: (row: number, col: number) => void;
}

export const WordSearchBoard = ({ w, h, currentGuess, letters, onClickLetter }: WordSearchBoardProps) => {
    const [buttonLetters, setButtonLetters] = useState(letters);

    const checkSelected = (row: number, col: number): boolean => {
        return currentGuess.some((coords) => coords.row === row && coords.col === col);
    };

    const buttons = buttonLetters.map((letter, i) => {
        const row = Math.floor(i / w);
        const col = i % w;
        return (
            <LetterButton
                key={`${row}_${col}_${letter}`}
                letter={letter}
                row={row}
                col={col}
                selected={checkSelected(row, col)}
                onClickLetter={onClickLetter}
            />
        );
    });

    return <div className="grid grid-cols-12 w-fit-square md:w-[36rem] aspect-square gap-1">{buttons}</div>;
};

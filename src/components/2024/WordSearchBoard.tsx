/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */
"use client";

import { useEffect, useState } from "react";
import { LetterButton } from "./LetterButton";

interface WordSearchBoardProps {
    w: number;
    h: number;
    letters: string[];
    onClickLetter: (row: number, col: number) => void;
}

export const WordSearchBoard = ({ w, h, letters, onClickLetter }: WordSearchBoardProps) => {
    const [buttonLetters, setButtonLetters] = useState(letters);

    useEffect(() => {
        setButtonLetters(letters);
    }, [letters]);

    const buttons = buttonLetters.map((letter, i) => {
        const row = Math.floor(i / w);
        const col = i % w;
        return (
            <LetterButton
                key={`${row}_${col}_${letter}`}
                letter={letter}
                row={row}
                col={col}
                onClickLetter={onClickLetter}
            />
        );
    });

    return <div className="grid grid-cols-12 w-fit-square aspect-square gap-1">{buttons}</div>;
};

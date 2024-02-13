/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */
"use client";

import { useEffect, useState } from "react";

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
            <button
                key={i + letter}
                className="text-3xl"
                onClick={() => {
                    onClickLetter(row, col);
                }}>
                {letter}
            </button>
        );
    });

    return <div>{buttons}</div>;
};

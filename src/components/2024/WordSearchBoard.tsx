/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */
"use client";

import { useEffect, useState } from "react";
import { LetterButton } from "./LetterButton";
import { WordPlacementCoords, WordPlacements, WordSearchGuess } from "@/lib/valentines/2024/word-search";

interface WordSearchBoardProps {
    w: number;
    h: number;
    letters: string[];
    currentGuess: WordSearchGuess;
    correctGuesses: WordPlacementCoords[];
    answers: WordPlacementCoords[];
    onClickLetter: (row: number, col: number) => void;
}

export const WordSearchBoard = ({
    w,
    h,
    currentGuess,
    letters,
    correctGuesses,
    answers,
    onClickLetter,
}: WordSearchBoardProps) => {
    const [buttonLetters, setButtonLetters] = useState(letters);

    useEffect(() => {
        setButtonLetters(letters);
    }, [letters]);

    const checkSelected = (row: number, col: number): boolean => {
        return currentGuess.some((coords) => coords.row === row && coords.col === col);
    };

    const checkCorrect = (row: number, col: number): boolean => {
        return correctGuesses.some((coords) => coords.row === row && coords.col === col);
    };

    const checkAnswer = (row: number, col: number): boolean => {
        return answers.some((answer) => answer.row === row && answer.col === col);
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
                correct={checkCorrect(row, col)}
                isAnswer={checkAnswer(row, col)}
                onClickLetter={onClickLetter}
            />
        );
    });

    return <div className="grid grid-cols-12 w-fit-square md:w-[36rem] aspect-square gap-1">{buttons}</div>;
};

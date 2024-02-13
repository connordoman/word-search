/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */
"use client";

import { RootState } from "@/lib/valentines/2024/store";
import { WordPlacementCoords, WordPlacements, WordSearch, WordSearchGuess } from "@/lib/valentines/2024/word-search";
import { setGame } from "@/lib/valentines/2024/word-search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WordSearchBoard } from "./WordSearchBoard";

interface WordSearchGameProps {
    words?: string[];
}

export const WordSearchGame = ({ words }: WordSearchGameProps) => {
    const dispatch = useDispatch();
    const game = useSelector((state: RootState) => state.wordSearch.game);

    const [currentGuess, setCurrentGuess] = useState<WordSearchGuess>([]);
    const [correctWords, setCorrectWords] = useState<WordPlacementCoords[]>([]);

    useEffect(() => {
        if (!game) {
            dispatch(setGame(WordSearch.createGame(words, 12, 12)));
        }
    }, [game, dispatch, words]);

    useEffect(() => {
        if (game && currentGuess.length > 3) {
            const correct = WordSearch.guess(game, currentGuess);

            if (!correct) return;

            dispatch(setGame(correct));
            setCurrentGuess([]);
            setCorrectWords([...correctWords, ...currentGuess]);
        }
    }, [game, currentGuess, dispatch, correctWords]);

    const handleLetterClick = (row: number, col: number): void => {
        console.log(`Clicked letter at ${row}, ${col} (${game?.board[row][col]})`);
        const newGuess = [...currentGuess, { row, col }];
        setCurrentGuess(newGuess);
    };

    const clearGuess = (): void => {
        setCurrentGuess([]);
    };

    if (!game) {
        return <div>Loading...</div>;
    }

    return (
        <div className="text-word-dark-grey dark:text-word-light-grey relative flex flex-col items-center justify-between gap-6 w-fit-square">
            <h1 className="text-6xl m-4">Word Search</h1>
            <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:justify-between">
                <WordSearchBoard
                    w={game.width}
                    h={game.height}
                    letters={WordSearch.flattenBoard(game)}
                    currentGuess={currentGuess}
                    correctGuesses={correctWords}
                    onClickLetter={handleLetterClick}
                />
                <div className="flex md:flex-col gap-4 md:gap-2 flex-wrap justify-center p-4">
                    {game.words.map((word, i) => (
                        <span key={i + "_" + word}>{word}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

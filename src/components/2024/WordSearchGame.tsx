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
import { twMerge } from "tailwind-merge";
import { WordSearchButton } from "./WordSearchButton";
import { WordSearchLegend } from "./WordSearchLegend";
import { WordSearchDialog } from "./WordSearchDialog";
import { useRouter } from "next/navigation";

interface WordSearchGameProps {
    words?: string[];
}

export const WordSearchGame = ({ words }: WordSearchGameProps) => {
    const router = useRouter();

    const dispatch = useDispatch();
    const game = useSelector((state: RootState) => state.wordSearch.game);

    const [currentGuess, setCurrentGuess] = useState<WordSearchGuess>([]);
    const [correctWords, setCorrectWords] = useState<WordPlacementCoords[]>([]);
    const [won, setWon] = useState(false);

    useEffect(() => {
        if (!game) {
            dispatch(setGame(WordSearch.createGame(words, 12, 12)));
            setWon(false);
            setCorrectWords([]);
            setCurrentGuess([]);
        }
    }, [game, dispatch, words]);

    useEffect(() => {
        if (game && currentGuess.length > 0) {
            const correct = WordSearch.guess(game, currentGuess);

            if (!correct) return;

            dispatch(setGame(correct));
            setCurrentGuess([]);
            setCorrectWords([...correctWords, ...currentGuess]);
        }
    }, [game, currentGuess, dispatch, correctWords]);

    useEffect(() => {
        if (game && game.foundWords.length === game.words.length) {
            setWon(true);
            console.log("You won!");
        }
    }, [game]);

    const handleLetterClick = (row: number, col: number): void => {
        if (currentGuess.some((coords) => coords.row === row && coords.col === col)) {
            const newGuess = currentGuess.filter((coords) => coords.row !== row || coords.col !== col);
            setCurrentGuess(newGuess);
            return;
        }
        const newGuess = [...currentGuess, { row, col }];
        setCurrentGuess(newGuess);
    };

    const clearGuess = (): void => {
        setCurrentGuess([]);
    };

    const handleRestart = () => {
        dispatch(setGame(WordSearch.createGame(words, 12, 12)));
        setWon(false);
        setCorrectWords([]);
        setCurrentGuess([]);
        router.refresh();
    };

    if (!game) {
        return <div className="relative h-2/3 flex flex-col justify-center">Loading...</div>;
    }

    return (
        <div className="text-word-dark-grey dark:text-word-light-grey relative flex flex-col items-center justify-between gap-6 w-fit-square pt-6 pb-8">
            <h1 className="text-4xl leading-none">Word Search</h1>
            <div className="relative flex flex-col md:flex-row items-center justify-center md:items-center md:justify-between">
                <WordSearchBoard
                    w={game.width}
                    h={game.height}
                    letters={WordSearch.flattenBoard(game)}
                    currentGuess={currentGuess}
                    correctGuesses={correctWords}
                    answers={WordSearch.flattenPlacements(game)}
                    onClickLetter={handleLetterClick}
                />
                <WordSearchLegend words={game.words} foundWords={game.foundWords} />
            </div>
            <WordSearchButton onClick={clearGuess} disabled={currentGuess.length === 0}>
                Deselect
            </WordSearchButton>
            <WordSearchDialog message={"You did it!"} buttonText="Restart" open={won} onClose={handleRestart} />
        </div>
    );
};

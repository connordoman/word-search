/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */
"use client";

import { RootState } from "@/lib/valentines/2024/store";
import { WordSearch } from "@/lib/valentines/2024/word-search";
import { setGame } from "@/lib/valentines/2024/word-search-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WordSearchBoard } from "./WordSearchBoard";

interface WordSearchGameProps {
    words?: string[];
}

export const WordSearchGame = ({ words }: WordSearchGameProps) => {
    const dispatch = useDispatch();
    const game = useSelector((state: RootState) => state.wordSearch.game);

    useEffect(() => {
        if (!game) {
            dispatch(setGame(WordSearch.createGame(words, 12, 12)));
        }
    }, [game, dispatch, words]);

    if (!game) {
        return <div>Loading...</div>;
    }

    return (
        <div className="text-word-dark-grey dark:text-word-light-grey relative flex flex-col items-center justify-between gap-6">
            <h1 className="text-6xl m-4">Word Search</h1>
            <WordSearchBoard
                w={game.width}
                h={game.height}
                letters={WordSearch.flattenBoard(game)}
                onClickLetter={function (row: number, col: number): void {
                    console.log(`Clicked letter at ${row}, ${col} (${game.board[row][col]})`);
                }}
            />
            <div className="flex gap-4 flex-wrap justify-center p-4">
                {game.words.map((word, i) => (
                    <span key={i + "_" + word}>{word}</span>
                ))}
            </div>
        </div>
    );
};

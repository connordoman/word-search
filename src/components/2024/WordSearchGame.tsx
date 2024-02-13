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
            dispatch(setGame(WordSearch.createGame(words || [], 12, 12)));
        }
    }, [game, dispatch, words]);

    if (!game) {
        return <div>Loading...</div>;
    }

    return <div className="text-red-500">{WordSearch.getBoardWithRandomLetters(game)}</div>;
};

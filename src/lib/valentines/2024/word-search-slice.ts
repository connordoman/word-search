/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WordSearch, WordSearchState } from "@/lib/valentines/2024/word-search";

// Initial state type
interface WordSearchReduxState {
    game: WordSearchState | null;
}

// Initial state
const initialState: WordSearchReduxState = {
    game: null,
};

// Slice
const wordSearchSlice = createSlice({
    name: "wordSearch",
    initialState,
    reducers: {
        setGame(state, action: PayloadAction<WordSearchState>) {
            state.game = action.payload;
        },
    },
});

export const { setGame } = wordSearchSlice.actions;
export default wordSearchSlice.reducer;

/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */

import { configureStore } from "@reduxjs/toolkit";
import wordSearchReducer from "./word-search-slice";

export const store = configureStore({
    reducer: {
        wordSearch: wordSearchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

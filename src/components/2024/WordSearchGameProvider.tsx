/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */
"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/valentines/2024/store";

export const WordSearchGameProvider = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
};

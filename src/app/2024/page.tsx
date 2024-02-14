/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */

import { WordSearchGame } from "@/components/2024/WordSearchGame";
import { WordSearchGameProvider } from "@/components/2024/WordSearchGameProvider";

export const WORDSEARCH_DEBUG = true;

export default async function Home() {
    return (
        <main className="relative flex items-start justify-center">
            <WordSearchGameProvider>
                <WordSearchGame />
            </WordSearchGameProvider>
        </main>
    );
}

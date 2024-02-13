/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */

import { WordSearchGame } from "@/components/2024/WordSearchGame";
import { WordSearchGameProvider } from "@/components/2024/WordSearchGameProvider";
import { WordSearch } from "@/lib/valentines/2024/word-search";

export default async function Home() {
    // const words = WordSearch.randomWordList(12);

    return (
        <main className="flex items-start justify-center">
            <WordSearchGameProvider>
                <WordSearchGame />
            </WordSearchGameProvider>
        </main>
    );
}

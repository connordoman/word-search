/*
 * Created on Wed Feb 14 2024
 * Author: Connor Doman
 */

import { twMerge } from "tailwind-merge";

interface WordSearchLegendProps {
    words: string[];
    foundWords: string[];
}

export const WordSearchLegend = ({ words, foundWords }: WordSearchLegendProps) => {
    return (
        <div className="md:absolute left-full flex flex-row md:flex-col gap-3 md:gap-2 flex-wrap justify-center p-4 leading-none w-max">
            {words.map((word, i) => {
                const found = foundWords.includes(word);
                return (
                    <span className={twMerge(found ? "line-through filter brightness-50" : "")} key={i + "_" + word}>
                        {word}
                    </span>
                );
            })}
        </div>
    );
};

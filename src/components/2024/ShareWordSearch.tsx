/*
 * Created on Wed Feb 14 2024
 * Author: Connor Doman
 */
"use client";

import { SITE_URL } from "@/lib/config";
import { stringArrayToQueryString } from "@/lib/url";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WordSearchButton } from "./WordSearchButton";

export const ShareWordSearch = () => {
    const [words, setWords] = useState<string>("");
    const [wordList, setWordList] = useState<string[]>([]);
    const [generatedUrl, setGeneratedUrl] = useState<string>("");
    const [copyText, setCopyText] = useState<string>("Copy");

    useEffect(() => {
        setWordList(
            words
                .split(",")
                .map((word) => word.trim())
                .filter((word) => word.length > 0)
        );
    }, [words]);

    useEffect(() => {
        setGeneratedUrl(SITE_URL + "/" + stringArrayToQueryString("words", wordList));
    }, [wordList]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[a-zA-Z, ]*$/.test(value)) {
            setWords(value);
            setCopyText("Copy");
        } else {
            e.preventDefault();
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedUrl);
        setCopyText("Copied!");
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl leading-none">Share Word Search</h1>
            <p className="font-light">Create a custom Word Search game using your own words:</p>
            <input
                className="p-2 rounded-sm bg-word-light-grey text-word-dark w-11/12 md:w-96"
                type="text"
                onChange={handleChange}
                value={words}
            />
            {generatedUrl ? (
                <Link className="px-4 py-2 rounded bg-word-dark-grey text-blue-500" href={generatedUrl} target="_blank">
                    {generatedUrl}
                </Link>
            ) : null}
            <WordSearchButton onClick={handleCopy}>{copyText}</WordSearchButton>
        </div>
    );
};

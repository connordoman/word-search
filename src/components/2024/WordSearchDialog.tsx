/*
 * Created on Wed Feb 14 2024
 * Author: Connor Doman
 */
"use client";

import { useEffect, useState } from "react";
import { WordSearchButton } from "./WordSearchButton";
import { twMerge } from "tailwind-merge";

interface WordSearchDialogProps {
    open: boolean;
    message: string;
    buttonText?: string;
    onClose: () => void;
}

export const WordSearchDialog = ({ open, message, buttonText, onClose }: WordSearchDialogProps) => {
    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleClose = () => {
        setIsOpen(false);

        onClose();
    };

    return (
        <div
            className={twMerge(
                "w-screen h-screen fixed top-0 left-0 z-10 transition-opacity duration-200 bg-word-dark/75 flex items-center",
                isOpen ? "opacity-100 pointer-events-auto animate-pop-in" : "opacity-0 pointer-events-none"
            )}>
            <div className="text-white bg-word-dark w-screen py-8 shadow-md flex flex-col items-center justify-center gap-4">
                <p className="text-3xl">{message}</p>

                <WordSearchButton onClick={handleClose} disabled={false}>
                    {buttonText}
                </WordSearchButton>
            </div>
        </div>
    );
};

/*
 * Created on Wed Feb 14 2024
 * Author: Connor Doman
 */

import { twMerge } from "tailwind-merge";

interface WordSearchButtonProps {
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick: () => void;
}

export const WordSearchButton = ({ children, className, disabled, onClick }: WordSearchButtonProps) => {
    return (
        <button
            className={twMerge(
                "transition-all duration-200 py-2 px-4 rounded-full bg-word-light-grey dark:bg-word-dark-grey text-word-dark-grey dark:text-word-light-grey",
                disabled ? "filter brightness-50" : "",
                className
            )}
            onClick={onClick}
            disabled={disabled}>
            {children}
        </button>
    );
};

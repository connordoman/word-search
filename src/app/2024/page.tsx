/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */

import { WordSearchGame } from "@/components/2024/WordSearchGame";
import { WordSearchGameProvider } from "@/components/2024/WordSearchGameProvider";

export default async function Home({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    let words = searchParams?.words as string[];

    console.log("Custom words:", words);

    return (
        <main className="relative flex items-start justify-center">
            <WordSearchGameProvider>
                <WordSearchGame />
            </WordSearchGameProvider>
        </main>
    );
}

import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";

const robotoSlab = Roboto_Slab({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "WORD SEARCH | Valentine's Day 2024",
    description: "Happy Valentine's Day 2024! I made this word search game for my girlfriend :)",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={robotoSlab.className}>{children}</body>
        </html>
    );
}

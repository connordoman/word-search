import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import { HiOutlineExternalLink } from "react-icons/hi";

const robotoSlab = Roboto_Slab({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "WORD SEARCH",
    description: "A fun and replayable word search game in your browser!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={robotoSlab.className}>
                {children}
                <div className="h-4 w-full relative"></div>
                <footer className="flex justify-center items-center px-4 py-12">
                    <a href="/share" className="fixed right-4 bottom-4" target="_blank">
                        <span className="text-xs mx-auto py-2 px-3 bg-white/30 rounded-full backdrop-blur-lg flex flex-row items-center justify-center gap-1 flex-nowrap">
                            Create <HiOutlineExternalLink />
                        </span>
                    </a>
                </footer>
            </body>
        </html>
    );
}

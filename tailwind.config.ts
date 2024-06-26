import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            spacing: {
                "fit-square": "min(calc(100vw - 2rem), calc(100vh - 2rem))",
                "default-margin": "calc((100vh - 1024px) / 2)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                "word-dark": "#121213",
                "word-light-grey": "#d3d6da",
                "word-grey": "#818384",
                "word-dark-grey": "#3a3a3c",
                "word-button-active": "#1d1d1e",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out forwards",
                pop: "pop 0.5s ease-in-out forwards",
                "pop-in": "popIn 0.5s ease-in-out forwards",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                popIn: {
                    "0%": { transform: "scale(0.5)" },
                    "85%": { transform: "scale(1.05)" },
                    "100%": { transform: "scale(1)" },
                },
                pop: {
                    "0%": { transform: "scale(0.5)" },
                    "85%": { transform: "scale(1.5)" },
                    "100%": { transform: "scale(1)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;

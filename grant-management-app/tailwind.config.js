import colors from "./src/app/helpers/colors";

/** @type {import('tailwindcss').Config} */

const tailwind = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: colors,
        },
    },
    plugins: [],
};

export default tailwind;
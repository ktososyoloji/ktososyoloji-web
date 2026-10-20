import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "s-pink": "#FB7996",
        "s-yellow": "#FFCE5D",
        "s-blue": "#3D9ED9",
        "s-navy": "#11375C",
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #11375C",
      },
    },
  },
  plugins: [],
};

export default config;

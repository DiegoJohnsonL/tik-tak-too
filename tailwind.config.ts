import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "finger": ["var(--font-finger)", ...fontFamily.sans],
      },
      colors : {
        'tik': {
          orange: "#F2C14E",
          winning: "#37505C",
          bg: "#2d414b",
        },
      }
    },
  },
  plugins: [],
};
export default config;

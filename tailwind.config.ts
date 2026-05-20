import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5A7361",
        cream: "#FCFBF9",
        "cream-alt": "#F3F5F3",
        olive: "#1B3B2B",
        sage: "#5A7361",
      }
    },
  },
  plugins: [typography],
};
export default config;

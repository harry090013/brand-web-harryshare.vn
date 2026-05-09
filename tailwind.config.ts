import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#22c55e",
        cream: "#FCFBF9",
        "cream-alt": "#F0FDF4",
        olive: "#14532D",
        sage: "#22C55E",
      }
    },
  },
  plugins: [],
};
export default config;

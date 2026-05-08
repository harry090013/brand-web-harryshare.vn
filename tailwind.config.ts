import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        cream: "#F8F7F4",
        "cream-alt": "#F2F0EA",
        olive: "#2D372B",
        sage: "#4A5D4E",
      }
    },
  },
  plugins: [],
};
export default config;

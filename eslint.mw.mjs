import iconSize from "./eslint-rules/icon-size.js";
import noRawColor from "./eslint-rules/no-raw-color.js";
import noRawToken from "./eslint-rules/no-raw-token.js";

export const mwPlugin = { rules: { "no-raw-color": noRawColor, "no-raw-token": noRawToken, "icon-size": iconSize } };

// Config do modo estrito para o projeto que instala o @mw/ui: espalhe no eslint.config.mjs com ...mw.
const mw = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["**/*.test.{js,jsx,ts,tsx}", "eslint-rules/**"],
    plugins: { mw: mwPlugin },
    rules: {
      "mw/no-raw-color": "error",
      "mw/no-raw-token": "error",
      "mw/icon-size": ["error", { sources: ["lucide-react", "@/components/icons/"] }],
    },
  },
];

export default mw;

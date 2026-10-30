import iconSize from "./eslint-rules/icon-size.js";
import noRawColor from "./eslint-rules/no-raw-color.js";
import noRawToken from "./eslint-rules/no-raw-token.js";
import noSceneLib from "./eslint-rules/no-scene-lib.js";

export const mwPlugin = { rules: { "no-raw-color": noRawColor, "no-raw-token": noRawToken, "icon-size": iconSize, "no-scene-lib": noSceneLib } };

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
      "mw/no-scene-lib": "error",
    },
  },
  {
    // Os palcos são os únicos que carregam pixi.js e gsap, por import() sob demanda.
    files: ["components/ui/scene-canvas.tsx", "components/ui/character-stage.tsx"],
    rules: { "mw/no-scene-lib": "off" },
  },
  {
    // A marca do Checkbox é menor que a escala de ícones, porque cabe na caixa de 20px.
    files: ["components/ui/checkbox.tsx"],
    rules: { "mw/icon-size": ["error", { allow: ["size-3.5"], sources: ["lucide-react", "@/components/icons/"] }] },
  },
];

export default mw;

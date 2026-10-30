import { classRule } from "./class-context.js";

const palette =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|accent";
const colorUtilities =
  "bg|text|border|border-[trblxyse]|ring|ring-offset|outline|fill|stroke|from|via|to|decoration|divide|placeholder|caret|accent|shadow|inset-shadow";

const checks = [
  /(^|[^\w&/])#[0-9a-fA-F]{3,8}\b/,
  /\b(rgba?|hsla?|hwb|oklch|oklab|lab|lch|color-mix)\(/,
  new RegExp(`(^|[\\s:])(${colorUtilities})-\\[(#|rgb|hsl|oklch|oklab|color:|var\\()`),
  new RegExp(`(^|[\\s:])(${colorUtilities})-(${palette})-\\d{2,3}\\b`),
  new RegExp(`(^|[\\s:])(${colorUtilities})-(black|white)\\b`),
];

const noRawColor = classRule({
  description: "Proíbe cores fora de tokens.css",
  message: "Cor fora dos tokens ({{ value }}). Use um token semântico de tokens.css, como bg-surface ou text-accent-text.",
  attributes: new Set(["className", "style", "color", "fill", "stroke"]),
  inspect(text) {
    for (const pattern of checks) {
      const match = text.match(pattern);
      if (match) return match[0].trim();
    }
    return null;
  },
});

export default noRawColor;

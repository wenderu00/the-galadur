import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["mark", "control", "card"],
      spacing: ["control", "cell-y"],
      container: ["content", "measure"],
      ease: ["standard", "enter", "exit"],
    },
    classGroups: {
      "font-size": [{ text: ["lead", "display-xl", "display-lg", "display-md", "display-sm", "mono-sm", "mono-xs"] }],
      tracking: [{ tracking: ["kicker"] }],
      z: [{ z: ["behind", "base", "sticky", "sheet", "dialog", "popover", "toast", "tooltip"] }],
      duration: [{ duration: ["fast", "base", "slow"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

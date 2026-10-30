import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["mark", "control", "card"],
      spacing: ["control", "cell-y"],
      container: ["content", "measure"],
      ease: ["standard", "enter", "exit"],
      animate: [
        "mw-blink",
        "mw-drift",
        "mw-glitch",
        "mw-fade-in",
        "mw-pop-in",
        "mw-slide-in",
        "mw-pulse",
        "mw-sheet-right",
        "mw-sheet-left",
        "mw-sheet-top",
        "mw-sheet-bottom",
        "mw-indeterminate",
        "mw-collapse-down",
        "mw-collapse-up",
        "mw-flash",
        "mw-shift",
      ],
    },
    classGroups: {
      "font-size": [{ text: ["lead", "display-2xl", "display-xl", "display-lg", "display-md", "display-sm", "mono-sm", "mono-xs"] }],
      tracking: [{ tracking: ["kicker", "display"] }],
      z: [{ z: ["behind", "base", "sticky", "sheet", "dialog", "popover", "toast", "tooltip"] }],
      duration: [{ duration: ["fast", "base", "slow"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

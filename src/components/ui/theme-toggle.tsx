"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ThemeChoice = "system" | "dark" | "light";

export const themeStorageKey = "mw-theme";

export const themeScript = `(function(){try{var t=localStorage.getItem("${themeStorageKey}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function readChoice(): ThemeChoice {
  const current = document.documentElement.getAttribute("data-theme");
  return current === "dark" || current === "light" ? current : "system";
}

export function setTheme(choice: ThemeChoice) {
  try {
    if (choice === "system") localStorage.removeItem(themeStorageKey);
    else localStorage.setItem(themeStorageKey, choice);
  } catch {}
  if (choice === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", choice);
}

export function useTheme() {
  return useSyncExternalStore(subscribe, readChoice, () => "system" as ThemeChoice);
}

const defaultLabels: Record<ThemeChoice, string> = { system: "sistema", dark: "escuro", light: "claro" };

export type ThemeToggleProps = Omit<ComponentProps<"div">, "children"> & {
  labels?: Partial<Record<ThemeChoice, string>>;
  label?: string;
};

export function ThemeToggle({ labels, label = "Tema", className, ...props }: ThemeToggleProps) {
  const choice = useTheme();
  const text = { ...defaultLabels, ...labels };
  const options: ThemeChoice[] = ["system", "dark", "light"];

  return (
    <div
      role="radiogroup"
      aria-label={label}
      data-slot="theme-toggle"
      className={cn("inline-flex rounded-control border border-line-control p-1 font-mono text-mono-xs", className)}
      {...props}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={choice === option}
          tabIndex={choice === option ? 0 : -1}
          onClick={() => setTheme(option)}
          onKeyDown={(event) => {
            const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
            if (!step) return;
            event.preventDefault();
            const next = options[(options.indexOf(option) + step + options.length) % options.length]!;
            setTheme(next);
            const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=radio]");
            buttons?.[options.indexOf(next)]?.focus();
          }}
          className={cn(
            "cursor-pointer rounded-mark px-3 py-1.5 text-ink-muted transition-colors duration-base hover:text-ink",
            choice === option && "bg-accent text-on-accent hover:text-on-accent",
          )}
        >
          {text[option]}
        </button>
      ))}
    </div>
  );
}

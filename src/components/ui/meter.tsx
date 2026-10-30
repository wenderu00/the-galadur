"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MeterProps = Omit<ComponentProps<"div">, "children"> & {
  label: string;
  value: number;
  max?: number;
  icon?: ReactNode;
  rate?: ReactNode;
  /** sm esconde o rótulo, que continua para o leitor de tela. compact é o nome antigo de sm, descontinuado, e sai na 0.23. */
  size?: "sm" | "md" | "compact";
  highlightKey?: string | number;
  formatOptions?: Intl.NumberFormatOptions;
};

export function Meter({ label, value, max, icon, rate, size = "md", highlightKey, formatOptions, className, ...props }: MeterProps) {
  const labelId = useId();
  const [previousKey, setPreviousKey] = useState(highlightKey);
  const [highlights, setHighlights] = useState(0);
  if (highlightKey !== previousKey) {
    setPreviousKey(highlightKey);
    setHighlights((count) => count + 1);
  }

  const format = new Intl.NumberFormat("pt-BR", formatOptions);
  const bounded = max !== undefined && max > 0;
  const percent = bounded ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const compact = size === "sm" || size === "compact";

  return (
    <div data-slot="meter" className={cn("flex flex-col gap-1", className)} {...props}>
      <div
        role={bounded ? "meter" : undefined}
        aria-labelledby={bounded ? labelId : undefined}
        aria-valuenow={bounded ? value : undefined}
        aria-valuemin={bounded ? 0 : undefined}
        aria-valuemax={bounded ? max : undefined}
        aria-valuetext={bounded ? `${format.format(value)} de ${format.format(max)}` : undefined}
        className="flex flex-col gap-1.5"
      >
        <div className={cn("flex items-center gap-2", !compact && "justify-between")}>
          <span className="flex items-center gap-2 text-ink-muted [&_svg]:size-4 [&_svg]:shrink-0">
            {icon && <span aria-hidden="true">{icon}</span>}
            <span id={labelId} className={cn(compact ? "sr-only" : "font-mono text-mono-xs tracking-kicker uppercase")}>
              {label}
            </span>
          </span>
          <span
            key={highlights}
            className={cn("rounded-mark px-1 font-mono text-mono-sm text-ink tabular-nums", highlights > 0 && "motion-safe:animate-mw-flash")}
          >
            {bounded ? `${format.format(value)} / ${format.format(max)}` : format.format(value)}
          </span>
        </div>
        {bounded && (
          <div className="h-1.5 w-full overflow-hidden rounded-full border border-line-strong bg-surface">
            <div
              data-slot="meter-indicator"
              className="h-full rounded-full bg-accent-line transition-[width] duration-slow ease-standard motion-reduce:transition-none"
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
      </div>
      {rate !== undefined && <p className="font-mono text-mono-xs text-ink-muted">{rate}</p>}
    </div>
  );
}

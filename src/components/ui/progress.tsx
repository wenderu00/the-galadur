"use client";

import { Progress as ProgressPrimitive } from "radix-ui";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ProgressProps = Omit<ComponentProps<typeof ProgressPrimitive.Root>, "value"> & {
  value?: number | null;
  label?: ReactNode;
  showValue?: boolean;
  valueText?: string;
  size?: "sm" | "md";
};

export function Progress({ value = null, max = 100, label, showValue = false, valueText, size = "md", className, ...props }: ProgressProps) {
  const labelId = useId();
  const indeterminate = value === null;
  const percent = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div data-slot="progress-wrapper" className={cn("flex flex-col gap-2", className)}>
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-3 text-sm">
          {label && (
            <span id={labelId} className="text-ink-soft">
              {label}
            </span>
          )}
          {showValue && !indeterminate && (
            <span aria-hidden="true" className="ml-auto font-mono text-mono-xs text-ink-muted">
              {valueText ?? `${Math.round(percent)}%`}
            </span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        data-slot="progress"
        value={value}
        max={max}
        aria-labelledby={label ? labelId : undefined}
        getValueLabel={valueText === undefined ? undefined : () => valueText}
        className={cn("relative w-full overflow-hidden rounded-full border border-line-strong bg-surface", size === "sm" ? "h-1.5" : "h-2.5")}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full rounded-full bg-accent-line transition-[width] duration-slow ease-standard motion-reduce:transition-none",
            indeterminate && "w-2/5 motion-safe:animate-mw-indeterminate motion-reduce:w-full motion-reduce:opacity-40",
          )}
          style={indeterminate ? undefined : { width: `${percent}%` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
}

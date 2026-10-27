import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type DotGridProps = ComponentProps<"div"> & {
  animated?: boolean;
};

export function DotGrid({ animated = false, className, ...props }: DotGridProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="dot-grid"
      data-animated={animated || undefined}
      className={cn(
        "mw-dot-grid pointer-events-none absolute inset-0 z-behind",
        animated && "motion-safe:animate-mw-drift",
        className,
      )}
      {...props}
    />
  );
}

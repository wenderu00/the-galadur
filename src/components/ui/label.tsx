"use client";

import { Label as LabelPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type LabelProps = ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
};

export function Label({ className, required = false, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "inline-flex items-center gap-1 text-sm leading-none font-medium text-ink select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="font-mono text-danger-text">
          *
        </span>
      )}
    </LabelPrimitive.Root>
  );
}

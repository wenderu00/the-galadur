"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { createContext, useContext, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

const itemVariants = cva(
  "inline-flex h-full cursor-pointer items-center justify-center gap-2 rounded-mark px-3 font-mono whitespace-nowrap text-ink-soft transition-colors duration-base hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-on-accent [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "text-mono-xs",
        md: "text-mono-sm",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type ToggleGroupSize = VariantProps<typeof itemVariants>["size"];

const SizeContext = createContext<ToggleGroupSize>("md");

export type ToggleGroupProps = ComponentProps<typeof ToggleGroupPrimitive.Root> & { size?: ToggleGroupSize; "aria-label": string };

export function ToggleGroup({ className, size = "md", ...props }: ToggleGroupProps) {
  return (
    <SizeContext.Provider value={size}>
      <ToggleGroupPrimitive.Root
        data-slot="toggle-group"
        className={cn("inline-flex w-fit items-stretch gap-1 rounded-control border border-line-control bg-ground p-1", size === "sm" ? "h-9" : "h-control", className)}
        {...props}
      />
    </SizeContext.Provider>
  );
}

export function ToggleGroupItem({ className, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const size = useContext(SizeContext);
  return <ToggleGroupPrimitive.Item data-slot="toggle-group-item" className={cn(itemVariants({ size }), className)} {...props} />;
}

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const categoryClasses = {
  1: "bg-category-1-soft text-category-1-text",
  2: "bg-category-2-soft text-category-2-text",
  3: "bg-category-3-soft text-category-3-text",
  4: "bg-category-4-soft text-category-4-text",
  5: "bg-category-5-soft text-category-5-text",
  6: "bg-category-6-soft text-category-6-text",
  7: "bg-category-7-soft text-category-7-text",
  8: "bg-category-8-soft text-category-8-text",
};

const sizes = {
  md: "size-10",
  lg: "size-12",
};

export type IconTileProps = Omit<ComponentProps<"span">, "aria-hidden"> & {
  size?: keyof typeof sizes;
  category?: keyof typeof categoryClasses;
};

export function IconTile({ size = "md", category, className, ...props }: IconTileProps) {
  return (
    <span
      data-slot="icon-tile"
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-control [&_svg]:size-6 [&_svg]:shrink-0",
        sizes[size],
        category ? categoryClasses[category] : "bg-surface text-ink-soft",
        className,
      )}
      {...props}
    />
  );
}

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DescriptionItem = { term: ReactNode; description: ReactNode };

export type DescriptionListProps = Omit<ComponentProps<"dl">, "children"> & {
  items: DescriptionItem[];
  orientation?: "vertical" | "horizontal";
  columns?: 1 | 2 | 3;
};

const columnClasses = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3" };

export function DescriptionList({ items, orientation = "vertical", columns = 1, className, ...props }: DescriptionListProps) {
  const horizontal = orientation === "horizontal";
  return (
    <dl
      data-slot="description-list"
      data-orientation={orientation}
      className={cn("grid gap-x-8", horizontal ? "gap-y-0" : cn("gap-y-5", columnClasses[columns]), className)}
      {...props}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex min-w-0 flex-col gap-1",
            horizontal && "border-t border-line py-cell-y first:border-t-0 sm:grid sm:grid-cols-[minmax(10rem,1fr)_2fr] sm:gap-6",
          )}
        >
          <dt className="font-mono text-mono-xs text-ink-muted">{item.term}</dt>
          <dd className="min-w-0 text-ink [overflow-wrap:anywhere]">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

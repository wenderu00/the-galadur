import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DotGrid } from "@/components/ui/dot-grid";

export type EmptyStateProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  comment?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  decorated?: boolean;
  headingLevel?: "h2" | "h3" | "h4";
};

export function EmptyState({
  title,
  description,
  comment,
  icon,
  actions,
  decorated = false,
  headingLevel: Heading = "h2",
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "relative isolate flex flex-col items-center gap-4 overflow-hidden rounded-card border border-dashed border-line-strong px-6 py-14 text-center",
        className,
      )}
      {...props}
    >
      {decorated && <DotGrid />}
      {icon && <div className="text-accent-text [&_svg]:size-6">{icon}</div>}
      {comment && (
        <p className="font-mono text-mono-xs text-ink-muted">
          <span aria-hidden="true">{"// "}</span>
          {comment}
        </p>
      )}
      <Heading className="font-display text-display-sm font-extrabold text-ink">{title}</Heading>
      {description && <p className="max-w-md text-base text-ink-soft">{description}</p>}
      {actions && <div className="mt-2 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}

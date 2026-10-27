import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PageHeaderProps = Omit<ComponentProps<"header">, "title"> & {
  title: ReactNode;
  kicker?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
};

export function PageHeader({ title, kicker, description, actions, breadcrumb, className, ...props }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn("flex flex-col gap-4 border-b border-line pb-6", className)}
      {...props}
    >
      {breadcrumb && <div className="font-mono text-mono-xs text-ink-muted">{breadcrumb}</div>}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-2">
          {kicker && (
            <p className="font-mono text-mono-xs font-medium tracking-kicker text-accent-text uppercase">{kicker}</p>
          )}
          <h1 className="font-display text-display-md font-extrabold text-ink">{title}</h1>
          {description && <p className="max-w-measure text-base text-ink-soft">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}

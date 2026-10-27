import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type CardProps = ComponentProps<"div"> & {
  interactive?: boolean;
};

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "relative flex flex-col gap-6 rounded-card border border-line bg-surface p-6 text-ink",
        "has-[[data-slot=card-action]:focus-visible]:outline-3 has-[[data-slot=card-action]:focus-visible]:outline-offset-3 has-[[data-slot=card-action]:focus-visible]:outline-focus",
        interactive && "transition-colors duration-base ease-standard hover:border-accent-line focus-within:border-accent-line",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export type CardTitleProps = ComponentProps<"h3"> & {
  as?: "h2" | "h3" | "h4" | "p";
};

export function CardTitle({ as: Heading = "h3", className, ...props }: CardTitleProps) {
  return <Heading data-slot="card-title" className={cn("font-display text-display-sm font-extrabold", className)} {...props} />;
}

export type CardActionProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export function CardAction({ asChild = false, type, className, ...props }: CardActionProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="card-action"
      type={asChild ? type : (type ?? "button")}
      className={cn(
        "cursor-pointer text-left text-inherit outline-none after:absolute after:inset-0 after:rounded-card after:content-['']",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-base text-ink-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("flex flex-col gap-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex flex-wrap items-center gap-3 border-t border-line pt-5", className)}
      {...props}
    />
  );
}

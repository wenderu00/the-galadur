import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-control border px-2 py-0.5 font-mono text-mono-xs font-medium whitespace-nowrap [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "",
        accent: "",
        danger: "",
        success: "",
        warning: "",
        info: "",
      },
      appearance: {
        soft: "border-transparent",
        solid: "border-transparent",
        outline: "bg-transparent",
      },
    },
    compoundVariants: [
      { tone: "neutral", appearance: "soft", className: "bg-surface text-ink-soft" },
      { tone: "neutral", appearance: "solid", className: "bg-ink text-ground" },
      { tone: "neutral", appearance: "outline", className: "border-line-strong text-ink-soft" },
      { tone: "accent", appearance: "soft", className: "bg-accent-soft text-accent-text" },
      { tone: "accent", appearance: "solid", className: "bg-accent text-on-accent" },
      { tone: "accent", appearance: "outline", className: "border-accent-line text-accent-text" },
      { tone: "danger", appearance: "soft", className: "bg-danger-soft text-danger-text" },
      { tone: "danger", appearance: "solid", className: "bg-danger text-on-danger" },
      { tone: "danger", appearance: "outline", className: "border-danger-text text-danger-text" },
      { tone: "success", appearance: "soft", className: "bg-success-soft text-success-text" },
      { tone: "success", appearance: "solid", className: "bg-success text-on-success" },
      { tone: "success", appearance: "outline", className: "border-success-text text-success-text" },
      { tone: "warning", appearance: "soft", className: "bg-warning-soft text-warning-text" },
      { tone: "warning", appearance: "solid", className: "bg-warning text-on-warning" },
      { tone: "warning", appearance: "outline", className: "border-warning-text text-warning-text" },
      { tone: "info", appearance: "soft", className: "bg-info-soft text-info-text" },
      { tone: "info", appearance: "solid", className: "bg-info text-on-info" },
      { tone: "info", appearance: "outline", className: "border-info-text text-info-text" },
    ],
    defaultVariants: { tone: "neutral", appearance: "soft" },
  },
);

export type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

export function Badge({ asChild = false, tone, appearance, className, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";
  return <Comp data-slot="badge" className={cn(badgeVariants({ tone, appearance }), className)} {...props} />;
}

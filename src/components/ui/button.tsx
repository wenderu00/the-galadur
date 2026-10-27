import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control border font-sans whitespace-nowrap no-underline transition-colors duration-base ease-standard disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "border-accent-edge bg-accent font-semibold text-on-accent enabled:hover:bg-accent-hover",
        secondary:
          "border-line-control bg-ground font-medium text-ink enabled:hover:border-accent-line enabled:hover:text-accent-text",
        ghost: "border-transparent bg-transparent font-medium text-ink-soft enabled:hover:bg-surface enabled:hover:text-ink",
        danger: "border-transparent bg-danger font-semibold text-on-danger enabled:hover:bg-danger-hover",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-control px-5 text-base",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    loadingLabel?: string;
  };

export function Button({
  asChild = false,
  loading = false,
  loadingLabel = "Carregando",
  variant,
  size,
  className,
  disabled,
  children,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    return (
      <Slot.Root data-slot="button" className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      data-slot="button"
      type={type ?? "button"}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner decorative size={size === "sm" ? "sm" : "md"} />}
      {children}
      {loading && <span className="sr-only">{loadingLabel}</span>}
    </button>
  );
}

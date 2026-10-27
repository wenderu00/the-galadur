import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const spinnerVariants = cva(
  "inline-block shrink-0 rounded-full border-current border-r-transparent motion-safe:animate-spin motion-reduce:border-r-current motion-reduce:opacity-60",
  {
    variants: {
      size: {
        sm: "size-3.5 border-2",
        md: "size-4 border-2",
        lg: "size-6 border-[3px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type SpinnerProps = ComponentProps<"span"> &
  VariantProps<typeof spinnerVariants> & {
    label?: string;
    decorative?: boolean;
  };

export function Spinner({ size, label = "Carregando", decorative = false, className, ...props }: SpinnerProps) {
  if (decorative) {
    return <span aria-hidden="true" data-slot="spinner" className={cn(spinnerVariants({ size }), className)} {...props} />;
  }
  return (
    <span role="status" data-slot="spinner" className="inline-flex items-center" {...props}>
      <span aria-hidden="true" className={cn(spinnerVariants({ size }), className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

const iconSizes = {
  sm: "size-9 [&_svg]:size-4",
  md: "size-control [&_svg]:size-5",
  lg: "size-12 [&_svg]:size-5",
};

export type IconButtonProps = Omit<ButtonProps, "size" | "aria-label"> & {
  "aria-label": string;
  size?: keyof typeof iconSizes;
};

export function IconButton({ variant = "ghost", size = "md", loading = false, className, children, ...props }: IconButtonProps) {
  return (
    <Button data-slot="icon-button" variant={variant} loading={loading} className={cn("p-0", iconSizes[size], className)} {...props}>
      {loading ? null : children}
    </Button>
  );
}

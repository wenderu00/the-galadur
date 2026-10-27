import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, CircleX, Info, X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";

export const alertVariants = cva(
  "relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-control border px-4 py-3 text-ink [&>svg]:mt-0.5 [&>svg]:size-5",
  {
    variants: {
      tone: {
        neutral: "border-line-strong bg-surface [&>svg]:text-ink-muted [&_[data-slot=alert-title]]:text-ink",
        info: "border-transparent bg-info-soft [&>svg]:text-info-text [&_[data-slot=alert-title]]:text-info-text",
        success: "border-transparent bg-success-soft [&>svg]:text-success-text [&_[data-slot=alert-title]]:text-success-text",
        warning: "border-transparent bg-warning-soft [&>svg]:text-warning-text [&_[data-slot=alert-title]]:text-warning-text",
        danger: "border-transparent bg-danger-soft [&>svg]:text-danger-text [&_[data-slot=alert-title]]:text-danger-text",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

const icons: Record<NonNullable<VariantProps<typeof alertVariants>["tone"]>, ReactNode> = {
  neutral: <Info aria-hidden="true" />,
  info: <Info aria-hidden="true" />,
  success: <CircleCheck aria-hidden="true" />,
  warning: <CircleAlert aria-hidden="true" />,
  danger: <CircleX aria-hidden="true" />,
};

export type AlertProps = Omit<ComponentProps<"div">, "title"> &
  VariantProps<typeof alertVariants> & {
    title?: ReactNode;
    icon?: ReactNode | false;
    action?: ReactNode;
    onDismiss?: () => void;
    dismissLabel?: string;
  };

export function Alert({
  tone,
  title,
  icon,
  action,
  onDismiss,
  dismissLabel = "Fechar aviso",
  className,
  children,
  ...props
}: AlertProps) {
  const resolvedTone = tone ?? "neutral";
  return (
    <div data-slot="alert" data-tone={resolvedTone} className={cn(alertVariants({ tone }), onDismiss && "pr-12", className)} {...props}>
      {icon === false ? <span aria-hidden="true" /> : (icon ?? icons[resolvedTone])}
      <div className="flex min-w-0 flex-col gap-1">
        {title && (
          <p data-slot="alert-title" className="font-semibold">
            {title}
          </p>
        )}
        {children && (
          <div data-slot="alert-description" className="text-sm text-ink-soft">
            {children}
          </div>
        )}
        {action && <div className="mt-2 flex flex-wrap gap-2">{action}</div>}
      </div>
      {onDismiss && (
        <IconButton aria-label={dismissLabel} size="sm" onClick={onDismiss} className="absolute top-1.5 right-1.5 enabled:hover:bg-ground">
          <X aria-hidden="true" />
        </IconButton>
      )}
    </div>
  );
}

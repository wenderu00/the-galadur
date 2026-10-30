import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type CodeCommentProps = ComponentProps<"p">;

export function CodeComment({ className, children, ...props }: CodeCommentProps) {
  return (
    <p data-slot="code-comment" className={cn("font-mono text-mono-xs text-ink-muted", className)} {...props}>
      <span aria-hidden="true">{"// "}</span>
      {children}
    </p>
  );
}

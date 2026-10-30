import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const fieldClasses =
  "w-full min-w-0 rounded-control border border-line-control bg-ground px-3 text-base text-ink transition-colors duration-base ease-standard placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-band aria-invalid:border-danger-text";

/** Mesmas alturas do Button: sm 36px, md segue a densidade (h-control), lg 48px. */
export const controlHeights = { sm: "h-9", md: "h-control", lg: "h-12" } as const;

export type ControlSize = keyof typeof controlHeights;

/** Gatilho de Select, Combobox e DateRangePicker: um botão com cara de campo. */
export const triggerClasses =
  "flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-control border border-line-control bg-ground px-3 text-left text-base text-ink transition-colors duration-base ease-standard hover:border-accent-line disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger-text data-[placeholder]:text-ink-muted";

export type InputProps = Omit<ComponentProps<"input">, "size"> & {
  size?: ControlSize;
  start?: ReactNode;
  end?: ReactNode;
};

export function Input({ className, type = "text", size = "md", start, end, ...props }: InputProps) {
  if (!start && !end) {
    return (
      <input
        data-slot="input"
        type={type}
        className={cn(
          fieldClasses,
          controlHeights[size],
          "file:mr-3 file:border-0 file:bg-transparent file:font-mono file:text-mono-xs file:text-ink",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <div
      data-slot="input-group"
      className={cn(
        "flex w-full min-w-0 items-center gap-2 rounded-control border border-line-control bg-ground px-3 text-ink transition-colors duration-base ease-standard",
        "has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-focus",
        "has-[input[aria-invalid=true]]:border-danger-text has-[input:disabled]:opacity-50 has-[input[readonly]]:bg-band",
        controlHeights[size],
        end && "pr-1",
      )}
    >
      {start && (
        <span data-slot="input-start" className="flex shrink-0 items-center text-ink-muted [&_svg]:size-4">
          {start}
        </span>
      )}
      <input
        data-slot="input"
        type={type}
        className={cn(
          "h-full w-full min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-muted focus-visible:outline-none disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
      {end && (
        <span data-slot="input-end" className="flex shrink-0 items-center gap-1">
          {end}
        </span>
      )}
    </div>
  );
}

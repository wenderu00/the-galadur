"use client";

import { Minus, Plus } from "lucide-react";
import { useState, type ChangeEvent, type FocusEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { controlHeights, fieldClasses, type InputProps } from "@/components/ui/input";

function decimalsOf(step: number) {
  const text = String(step);
  return text.includes(".") ? text.split(".")[1]!.length : 0;
}

/** Aceita o formato pt-BR (1.234,5) e o ponto como decimal quando não há vírgula (1234.5). */
export function parseNumber(text: string) {
  const clean = text.replace(/[^\d,.-]/g, "");
  if (!/\d/.test(clean)) return null;
  const normalized = clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export type NumberInputProps = Omit<InputProps, "value" | "defaultValue" | "type" | "min" | "max" | "step" | "start" | "end"> & {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  formatOptions?: Intl.NumberFormatOptions;
  decrementLabel?: string;
  incrementLabel?: string;
};

export function NumberInput({
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  formatOptions,
  decrementLabel = "Diminuir",
  incrementLabel = "Aumentar",
  size = "md",
  disabled,
  readOnly,
  className,
  onBlur,
  onFocus,
  onKeyDown,
  ...props
}: NumberInputProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [draft, setDraft] = useState<string | null>(null);
  const value = controlledValue === undefined ? innerValue : controlledValue;
  const decimals = decimalsOf(step);
  const format = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: Math.max(decimals, 2), ...formatOptions });
  const editable = !disabled && !readOnly;

  const clamp = (next: number) => Math.min(max, Math.max(min, Number(next.toFixed(decimals))));

  function change(next: number | null) {
    if (controlledValue === undefined) setInnerValue(next);
    onValueChange?.(next);
  }

  function nudge(steps: number) {
    const base = value ?? (min > -Infinity ? min : 0);
    setDraft(null);
    change(clamp(value === null ? base : base + steps * step));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setDraft(event.target.value);
    change(parseNumber(event.target.value));
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setDraft(null);
    if (value !== null && clamp(value) !== value) change(clamp(value));
    onBlur?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || !editable) return;
    const keys: Record<string, () => void> = {
      ArrowUp: () => nudge(1),
      ArrowDown: () => nudge(-1),
      PageUp: () => nudge(10),
      PageDown: () => nudge(-10),
      Home: () => min > -Infinity && change(min),
      End: () => max < Infinity && change(max),
    };
    const action = keys[event.key];
    if (!action) return;
    event.preventDefault();
    setDraft(null);
    action();
  }

  const shown = draft ?? (value === null ? "" : format.format(value));

  return (
    <div data-slot="number-input" className={cn("flex w-full min-w-0 items-stretch gap-1", className)}>
      <IconButton variant="secondary" size={size} aria-label={decrementLabel} tabIndex={-1} disabled={!editable || (value !== null && value <= min)} onClick={() => nudge(-1)}>
        <Minus aria-hidden="true" />
      </IconButton>
      <input
        type="text"
        role="spinbutton"
        inputMode={decimals > 0 ? "decimal" : "numeric"}
        autoComplete="off"
        aria-valuenow={value ?? undefined}
        aria-valuemin={min > -Infinity ? min : undefined}
        aria-valuemax={max < Infinity ? max : undefined}
        aria-valuetext={value === null ? undefined : format.format(value)}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(fieldClasses, controlHeights[size], "text-center font-mono")}
        {...props}
        value={shown}
        onChange={handleChange}
        onFocus={(event) => {
          setDraft(value === null ? "" : format.format(value));
          onFocus?.(event);
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      <IconButton variant="secondary" size={size} aria-label={incrementLabel} tabIndex={-1} disabled={!editable || (value !== null && value >= max)} onClick={() => nudge(1)}>
        <Plus aria-hidden="true" />
      </IconButton>
    </div>
  );
}

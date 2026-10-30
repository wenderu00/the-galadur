"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useFormField } from "@/components/ui/form-field";

const number = new Intl.NumberFormat("pt-BR");

export type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
  formatValue?: (value: number) => string;
  thumbLabels?: string[];
};

export function Slider({
  className,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  formatValue = (current) => number.format(current),
  thumbLabels,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  ...props
}: SliderProps) {
  const field = useFormField();
  const [innerValue, setInnerValue] = useState(defaultValue ?? [min]);
  const current = value ?? innerValue;

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (value === undefined) setInnerValue(next);
        onValueChange?.(next);
      }}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[orientation=vertical]:h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative grow overflow-hidden rounded-full border border-line-control bg-surface data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2">
        <SliderPrimitive.Range className="absolute bg-accent-line data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      {current.map((thumbValue, index) => (
        <SliderPrimitive.Thumb
          key={index}
          id={index === 0 ? id : undefined}
          aria-label={thumbLabels?.[index] ?? ariaLabel}
          aria-labelledby={thumbLabels?.[index] || ariaLabel ? undefined : (ariaLabelledBy ?? field?.labelId)}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          aria-required={ariaRequired}
          aria-valuetext={formatValue(thumbValue)}
          className="block size-5 cursor-grab rounded-full border-2 border-accent-edge bg-accent transition-colors duration-fast hover:bg-accent-hover active:cursor-grabbing data-[disabled]:cursor-not-allowed"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

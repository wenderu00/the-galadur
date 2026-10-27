"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetHeader = DialogHeader;
export const SheetFooter = DialogFooter;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;

export const sheetVariants = cva(
  "fixed z-sheet flex flex-col gap-6 overflow-y-auto border-line-strong bg-surface p-6 text-ink",
  {
    variants: {
      side: {
        right: "inset-y-0 right-0 h-dvh w-[calc(100vw-3rem)] max-w-md border-l motion-safe:data-[state=open]:animate-mw-sheet-right",
        left: "inset-y-0 left-0 h-dvh w-[calc(100vw-3rem)] max-w-xs border-r motion-safe:data-[state=open]:animate-mw-sheet-left",
        top: "inset-x-0 top-0 max-h-[85dvh] border-b motion-safe:data-[state=open]:animate-mw-sheet-top",
        bottom: "inset-x-0 bottom-0 max-h-[85dvh] border-t motion-safe:data-[state=open]:animate-mw-sheet-bottom",
      },
    },
    defaultVariants: { side: "right" },
  },
);

export type SheetContentProps = ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetVariants> & {
    closeLabel?: string;
    showClose?: boolean;
  };

export function SheetContent({ side, className, children, closeLabel = "Fechar", showClose = true, ...props }: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay className="z-sheet" />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        data-side={side ?? "right"}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close asChild>
            <IconButton aria-label={closeLabel} size="sm" className="absolute top-4 right-4 enabled:hover:bg-band">
              <X aria-hidden="true" />
            </IconButton>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

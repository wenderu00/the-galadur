# Noridoc: components/ui

Path: @/src/components/ui

### Overview

- Houses all shadcn/ui-generated component primitives used across the application.
- Components here are truly generic — they carry no game domain knowledge and are imported freely by any feature.
- The dialog system is split across two files to stay within the 80-line file limit.

### How it fits into the larger codebase

- Consumed by feature components throughout `@/src/features/` — notably the building modal, game controls, and resource bars.
- All components wrap primitives from `@base-ui/react` or native HTML; styling is applied with Tailwind via `cn()` from `@/src/lib/utils.ts`.
- `dialog.tsx` re-exports everything from `dialogBase.tsx` so callers only need one import path.

### Core Implementation

- **`dialogBase.tsx`** — thin wrappers over `@base-ui/react/dialog` primitives: `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay`, `DialogTitle`, `DialogDescription`, `DialogHeader`. These carry only minimal Tailwind styling.
- **`dialog.tsx`** — adds the two composed components that require richer logic: `DialogContent` (popup with optional close button) and `DialogFooter` (bottom action bar with optional close button). Re-exports everything from `dialogBase.tsx` as a single public surface.
- **`button.tsx`** — standard shadcn Button with variant and size props; used inside `DialogContent` for the close icon button.
- **`progress.tsx`** — progress bar primitive used in building and training UI.

### Things to Know

- **`dialog.tsx` is the only import path consumers should use** — it re-exports all of `dialogBase.tsx`. Importing from `dialogBase.tsx` directly is internal; the split exists only to enforce the 80-line rule.
- **`DialogContent` always renders `DialogPortal` + `DialogOverlay` internally** — callers should not wrap it in an additional portal.
- **`showCloseButton` props on `DialogContent` and `DialogFooter` are independent** — both default to their respective values (`true` and `false`). Having both set to `true` would render two close controls.
- Animation classes use Base UI's `data-open` / `data-closed` attributes, not Radix-style `data-state` strings.

Created and maintained by Nori.

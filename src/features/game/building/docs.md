# Noridoc: game/building

Path: @/src/features/game/building

### Overview

- Contains all UI and logic for the building system: the grid of building cards, the upgrade modal, and per-building extra panels rendered inside that modal.
- `BuildingExtra.tsx` is the dispatch point that maps a `BuildingId` to its building-specific panel component (castle gold slider, barracks, market, etc.).
- Sub-features (`barracks/`, `market/`) mirror the same `components/` + `hooks/` structure and are never imported by one another.

### How it fits into the larger codebase

- Building components read from Jotai atoms in `@/src/store/gameAtoms.ts` and call engine functions via hooks from `@/src/features/game-engine/`.
- `BuildingGrid` is rendered by the game layout and lists all buildings defined in `@/src/config/buildings`.
- `BuildingModal` hosts the upgrade flow; it includes `BuildingExtra` as a slot for building-specific content below the standard upgrade UI.
- Sub-features (`barracks/`, `market/`) are only ever mounted through `BuildingExtra` — they have no independent entry points.
- The engine functions called by sub-feature hooks (`executeTrade`, `startConstruction`, etc.) live in `@/src/features/game-engine/engine.ts`.

### Core Implementation

- **`components/BuildingExtra.tsx`** — single if-chain that returns the correct sub-feature panel for a given `BuildingId`, or `null` for buildings with no extra panel. Adding a new building-specific panel means adding one branch here.
- **`components/BuildingModal.tsx`** — renders building identity, stats, upgrade costs/actions, and calls `BuildingExtra` for the building-specific section.
- **`components/BuildingGrid.tsx`** — maps over all building definitions and renders `BuildingCard` for each.
- **`barracks/`** — military unit training sub-feature; follows the same `components/` + `hooks/` layout as `market/`.
- **`market/`** — resource trading sub-feature; see `@/src/features/game/building/market/docs.md`.

### Things to Know

- Sub-features (`barracks/`, `market/`) must not import from each other. Anything shared between them should move to `@/src/features/game/building/` or `@/src/lib/`.
- `BuildingExtra` returns `null` for buildings that have no extra panel (farm, sawmill, mine). This is intentional — the modal renders fine without it.
- All files in `components/` are kept under 80 lines per the project rule; the building modal complexity is distributed across focused components (`BuildingStats`, `BuildingUpgradeCosts`, `BuildingUpgradeActions`, etc.).

Created and maintained by Nori.

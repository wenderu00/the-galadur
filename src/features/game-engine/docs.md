# Noridoc: game-engine

Path: @/src/features/game-engine

### Overview

- Pure functional game engine: every module exports functions that take `GameState` and return a new `GameState` — no side effects, no React imports.
- The engine is the single source of truth for all game mutation logic: production, construction, ticks, offline recovery, military, and trading.
- `engine.ts` is the barrel file that re-exports the public API consumed by hooks and components.

### How it fits into the larger codebase

- React hooks in `@/src/features/game-engine/hooks/` are the only bridge between the engine and Jotai atoms in `@/src/store/gameAtoms.ts`; the engine itself never touches atoms.
- `useGameLoop` (composed from `useOfflineRecovery` + `useTickEngine`) is mounted once at the app level and drives all automatic state changes.
- Feature-level hooks such as `@/src/features/game/building/market/hooks/useMarketTrade.ts` call engine functions via `useAtomCallback` to read and write `gameStateAtom` atomically.
- `@/src/config/buildings` and `@/src/config/units` hold static definitions the engine reads for costs, build times, and production values.
- All game mutations flow through this folder; UI components never mutate state directly.

### Core Implementation

- **`types.ts`** — canonical `GameState`, `ResourceKind`, `BuildingId`, `BuildingLevel`, and related interfaces. Every other module imports from here.
- **`engine.ts`** — barrel: re-exports `createInitialGameState`, `safeParseGameState`, math utilities, production helpers, tick/construction/offline/trade functions, and their types. Also owns `GAME_STATE_VERSION` and the migration path from v1 → v2.
- **`math.ts`** — stateless arithmetic utilities (`addAmounts`, `clampToMax`, `canAfford`, etc.) used by every other module.
- **`production.ts`** — derives per-tick resource production, storage caps, and construction-time multipliers from the current building levels.
- **`tick.ts`** — `tick(state, now)` applies one simulation step: complete finished buildings, then apply production. Called every second by `useTickEngine`.
- **`construction.ts`** — `startConstruction` validates affordability and enqueues a build; `rescaleQueueForSpeedChange` adjusts remaining times when game speed changes.
- **`offline.ts`** — `calculateOfflineProgress` simulates up to 8 hours of ticks, respecting build completions mid-segment, on first mount via `useOfflineRecovery`.
- **`trade.ts`** — `executeTrade` and `getTradePreview` implement the market exchange system (see Things to Know).
- **`hooks/useGameLoop.ts`** — composes `useOfflineRecovery` and `useTickEngine`; the only hook mounted outside a specific feature.

### Things to Know

- **All mutations are pure and immutable.** Every function returns a new `GameState` object via spread; the original is never mutated.
- **`TradeResource = Exclude<ResourceKind, 'gold'>`** — gold is the currency, not a tradeable commodity. The three tradeable resources are wood, stone, and food.
- **Anti-arbitrage rounding:** buy operations use `Math.ceil` (player pays more), sell operations use `Math.floor` (player receives less). This means repeatedly buying and selling the same amount always results in a net loss for the player.
- **Exchange rates scale with market level:**

  | Market Level | Rate Multiplier | Effect |
  |---|---|---|
  | 1 | 1.0× | Base price |
  | 2 | 1.5× | 50% better value |
  | 3 | 2.0× | Double buying power |

- **Trade error codes:** `market_not_built` (market at level 0), `cannot_afford` (insufficient gold for buy, or insufficient resource for sell), `storage_full` (target resource or gold would exceed cap).
- **`useOfflineRecovery` runs exactly once per mount** (guarded by `offlineAppliedRef`). If it ran on every render, players would gain offline resources multiple times.
- **Speed changes rescale both build and training queues** in `useTickEngine` — only when both old and new speeds are non-zero; pausing does not rescale.
- **`safeParseGameState` handles version migration** from `GameState` v1 to v2 inline; any unknown version returns `null`, triggering a fresh-state fallback in the persistence layer.

Created and maintained by Nori.

# Noridoc: game/building/market

Path: @/src/features/game/building/market

### Overview

- Implements the market building's trading UI: players exchange wood, stone, or food for gold and vice versa.
- Follows the same sub-feature structure as `@/src/features/game/building/barracks/` — a `hooks/` layer wrapping the engine, and a `components/` layer rendering the UI.
- Mounted exclusively through `@/src/features/game/building/components/BuildingExtra.tsx` when `buildingId === 'market'`.

### How it fits into the larger codebase

- `useMarketTrade` reads `buildingsAtom` and `resourcesAtom` from `@/src/store/gameAtoms.ts` and calls `executeTrade` / `getTradePreview` from `@/src/features/game-engine/engine.ts`.
- All trade mutation is performed by `executeTrade` in `@/src/features/game-engine/trade.ts`; the hook never mutates state directly.
- `MarketPanel` is the only exported component intended for external use; `MarketTradeRow` is an internal presentational component.
- The market panel has no route or standalone page — it only exists inside the building modal.

### Core Implementation

- **`hooks/useMarketTrade.ts`** — derives `marketLevel` from `buildingsAtom`, reads current resource amounts, exposes a `preview` callback (wrapping `getTradePreview`) and a `trade` callback (wrapping `executeTrade` via `useAtomCallback`). Returns `{ marketLevel, resources, preview, trade }`.
- **`components/MarketPanel.tsx`** — checks `marketLevel`; renders a "build the market first" guard when level is 0, otherwise renders one `MarketTradeRow` per tradeable resource (wood, stone, food).
- **`components/MarketTradeRow.tsx`** — one row: a number input for amount, a Buy button showing the gold cost, and a Sell button showing gold gained. Both buttons disable when the operation would fail (insufficient gold/resource or storage full). Local `amount` state lives here with `useState`.

### Things to Know

- **Tradeable resources are fixed to `['wood', 'stone', 'food']`** — gold is the currency and is never in the trade list (`TradeResource = Exclude<ResourceKind, 'gold'>`).
- **Disable logic in `MarketTradeRow` mirrors engine validation** — `canBuy` checks `currentGold >= goldCost && currentAmount + amount <= maxAmount`; `canSell` checks `currentAmount >= amount`. The engine will also reject invalid trades, but the UI pre-empts them.
- **`preview` is a memoized callback** recreated only when `marketLevel` changes, so the preview values are always consistent with the current rate tier.
- **`useAtomCallback` is used for `trade`** so the callback always reads the latest `gameStateAtom` at call time, avoiding stale-closure issues with the amount input.
- Exchange rate tiers (1×/1.5×/2×) and rounding behavior (ceil for buy, floor for sell) are defined entirely in `@/src/features/game-engine/trade.ts`; this sub-feature contains no pricing logic.

Created and maintained by Nori.

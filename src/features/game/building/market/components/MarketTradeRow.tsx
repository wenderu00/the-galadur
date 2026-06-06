import { useState } from 'react';
import type { TradeResource } from '@/features/game-engine/engine';

const RESOURCE_LABELS: Record<TradeResource, string> = {
  wood: 'Madeira',
  stone: 'Pedra',
  food: 'Comida',
};

interface MarketTradeRowProps {
  resource: TradeResource;
  currentAmount: number;
  maxAmount: number;
  currentGold: number;
  preview: (resource: TradeResource, amount: number) => { goldCost: number; goldGained: number };
  onTrade: (direction: 'buy' | 'sell', resource: TradeResource, amount: number) => void;
}

export function MarketTradeRow({
  resource,
  currentAmount,
  maxAmount,
  currentGold,
  preview,
  onTrade,
}: MarketTradeRowProps) {
  const [amount, setAmount] = useState(10);
  const { goldCost, goldGained } = preview(resource, amount);
  const canBuy = currentGold >= goldCost && currentAmount + amount <= maxAmount;
  const canSell = currentAmount >= amount;

  return (
    <li className="flex flex-col gap-1.5 py-2 border-b border-realm-800 last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-realm-200">{RESOURCE_LABELS[resource]}</span>
        <span className="text-xs text-realm-400">
          {currentAmount}/{maxAmount}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 rounded bg-realm-800 border border-realm-700 px-2 py-1 text-sm text-realm-100"
          data-testid={`market-amount-${resource}`}
        />
        <button
          onClick={() => onTrade('buy', resource, amount)}
          disabled={!canBuy}
          className="rounded bg-yellow-700 px-3 py-1 text-xs font-medium text-white disabled:opacity-40"
          data-testid={`market-buy-${resource}`}
        >
          Comprar ({goldCost}🪙)
        </button>
        <button
          onClick={() => onTrade('sell', resource, amount)}
          disabled={!canSell}
          className="rounded bg-realm-700 px-3 py-1 text-xs font-medium text-realm-200 disabled:opacity-40"
          data-testid={`market-sell-${resource}`}
        >
          Vender (+{goldGained}🪙)
        </button>
      </div>
    </li>
  );
}

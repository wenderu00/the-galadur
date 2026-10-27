import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import type { TradeResource } from '@/features/game-engine/engine';
import { formatNumber } from '@/lib/format';
import { RESOURCE_NAMES } from '@/features/game/resourceNames';

const DEFAULT_AMOUNT = 10;

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
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const { goldCost, goldGained } = preview(resource, amount);
  const canBuy = currentGold >= goldCost && currentAmount + amount <= maxAmount;
  const canSell = currentAmount >= amount;
  const name = RESOURCE_NAMES[resource];

  return (
    <li className="flex flex-col gap-3">
      <FormField
        label={`Quantidade de ${name.toLowerCase()}`}
        description={`Você tem ${formatNumber(Math.floor(currentAmount))} de ${formatNumber(maxAmount)}`}
      >
        <NumberInput
          data-testid={`market-amount-${resource}`}
          min={1}
          value={amount}
          onValueChange={(value) => setAmount(Math.max(1, value ?? 1))}
          decrementLabel={`Diminuir ${name.toLowerCase()}`}
          incrementLabel={`Aumentar ${name.toLowerCase()}`}
        />
      </FormField>
      <div className="flex flex-wrap gap-3">
        <Button
          size="sm"
          data-testid={`market-buy-${resource}`}
          disabled={!canBuy}
          onClick={() => onTrade('buy', resource, amount)}
        >
          Comprar por {formatNumber(goldCost)} de ouro
        </Button>
        <Button
          size="sm"
          variant="secondary"
          data-testid={`market-sell-${resource}`}
          disabled={!canSell}
          onClick={() => onTrade('sell', resource, amount)}
        >
          Vender por {formatNumber(goldGained)} de ouro
        </Button>
      </div>
    </li>
  );
}

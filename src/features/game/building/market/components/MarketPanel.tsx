import { useMarketTrade } from '../hooks/useMarketTrade';
import { MarketTradeRow } from './MarketTradeRow';
import type { TradeResource } from '@/features/game-engine/engine';

const TRADE_RESOURCES: TradeResource[] = ['wood', 'stone', 'food'];

export function MarketPanel() {
  const { marketLevel, resources, preview, trade } = useMarketTrade();

  if (marketLevel === 0) {
    return (
      <section className="pt-2 border-t border-realm-800">
        <p className="text-xs text-realm-400">Construa o Mercado para negociar recursos.</p>
      </section>
    );
  }

  return (
    <section className="space-y-1 pt-3 border-t border-realm-800" data-testid="market-panel">
      <p className="text-xs font-medieval uppercase tracking-widest text-realm-500">Negociar</p>
      <ul className="mt-2">
        {TRADE_RESOURCES.map((resource) => (
          <MarketTradeRow
            key={resource}
            resource={resource}
            currentAmount={resources.current[resource]}
            maxAmount={resources.max[resource]}
            currentGold={resources.current.gold}
            preview={preview}
            onTrade={trade}
          />
        ))}
      </ul>
    </section>
  );
}

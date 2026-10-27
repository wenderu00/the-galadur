import type { TradeResource } from '@/features/game-engine/engine';
import { PanelSection } from '@/features/game/components/PanelSection';
import { useMarketTrade } from '../hooks/useMarketTrade';
import { MarketTradeRow } from './MarketTradeRow';

const TRADE_RESOURCES: TradeResource[] = ['wood', 'stone', 'food'];

export function MarketPanel() {
  const { marketLevel, resources, preview, trade } = useMarketTrade();

  if (marketLevel === 0) {
    return <p className="text-sm text-ink-soft">Construa o Mercado para negociar recursos.</p>;
  }

  return (
    <div data-testid="market-panel">
      <PanelSection title="Negociar" headingLevel="h3">
        <ul className="flex flex-col gap-4">
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
      </PanelSection>
    </div>
  );
}

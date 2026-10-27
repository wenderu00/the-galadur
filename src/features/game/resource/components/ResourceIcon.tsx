import { Coin } from '@/components/icons/base/coin';
import { Food } from '@/components/icons/medieval/food';
import { Stone } from '@/components/icons/medieval/stone';
import { Wood } from '@/components/icons/medieval/wood';
import type { ResourceKind } from '@/features/game-engine/types';

interface ResourceIconProps {
  kind: ResourceKind;
}

export function ResourceIcon({ kind }: ResourceIconProps) {
  if (kind === 'wood') return <Wood aria-hidden="true" className="text-category-2-line" />;
  if (kind === 'stone') return <Stone aria-hidden="true" className="text-category-1-line" />;
  if (kind === 'food') return <Food aria-hidden="true" className="text-category-4-line" />;
  return <Coin aria-hidden="true" className="text-category-7-line" />;
}

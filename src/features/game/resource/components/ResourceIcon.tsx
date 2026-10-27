import { Coins, Mountain, TreePine, Wheat } from 'lucide-react';
import type { ResourceKind } from '@/features/game-engine/types';

interface ResourceIconProps {
  kind: ResourceKind;
}

export function ResourceIcon({ kind }: ResourceIconProps) {
  if (kind === 'wood') return <TreePine aria-hidden="true" className="text-category-2-line" />;
  if (kind === 'stone') return <Mountain aria-hidden="true" className="text-category-1-line" />;
  if (kind === 'food') return <Wheat aria-hidden="true" className="text-category-4-line" />;
  return <Coins aria-hidden="true" className="text-category-7-line" />;
}

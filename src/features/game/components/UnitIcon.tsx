import { Sword } from 'lucide-react';
import { Archer } from '@/components/icons/medieval/archer';
import { Spearman } from '@/components/icons/medieval/spearman';
import type { UnitId } from '@/features/game-engine/military-types';

interface UnitIconProps {
  id: UnitId;
}

export function UnitIcon({ id }: UnitIconProps) {
  if (id === 'warrior') return <Sword aria-hidden="true" />;
  if (id === 'archer') return <Archer aria-hidden="true" />;
  return <Spearman aria-hidden="true" />;
}

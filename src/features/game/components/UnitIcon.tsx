import { BowArrow, Shield, Sword } from 'lucide-react';
import type { UnitId } from '@/features/game-engine/military-types';

interface UnitIconProps {
  id: UnitId;
}

export function UnitIcon({ id }: UnitIconProps) {
  if (id === 'warrior') return <Sword aria-hidden="true" />;
  if (id === 'archer') return <BowArrow aria-hidden="true" />;
  return <Shield aria-hidden="true" />;
}

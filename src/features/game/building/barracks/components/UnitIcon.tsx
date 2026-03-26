import type { UnitId } from '@/features/game-engine/military-types';
import WarriorSvg from '@assets/warrior.svg?react';
import ArcherSvg from '@assets/archer.svg?react';
import LancerSvg from '@assets/lancer.svg?react';

interface UnitIconProps {
  id: UnitId;
  className?: string;
}

export function UnitIcon({ id, className = 'w-10 h-10' }: UnitIconProps) {
  if (id === 'warrior') return <WarriorSvg fill="currentColor" className={className} />;
  if (id === 'archer') return <ArcherSvg fill="currentColor" className={className} />;
  return <LancerSvg fill="currentColor" className={className} />;
}

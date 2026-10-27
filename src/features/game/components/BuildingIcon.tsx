import { Axe, Castle, Landmark, Pickaxe, Store, Tent, Tractor } from 'lucide-react';
import type { BuildingId } from '@/features/game-engine/types';

interface BuildingIconProps {
  id: BuildingId;
}

export function BuildingIcon({ id }: BuildingIconProps) {
  if (id === 'castle') return <Castle aria-hidden="true" />;
  if (id === 'farm') return <Tractor aria-hidden="true" />;
  if (id === 'sawmill') return <Axe aria-hidden="true" />;
  if (id === 'mine') return <Pickaxe aria-hidden="true" />;
  if (id === 'market') return <Store aria-hidden="true" />;
  if (id === 'barracks') return <Tent aria-hidden="true" />;
  return <Landmark aria-hidden="true" />;
}

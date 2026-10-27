import { Axe, Landmark, Pickaxe, Store } from 'lucide-react';
import { Barracks } from '@/components/icons/medieval/barracks';
import { Castle } from '@/components/icons/medieval/castle';
import { Farm } from '@/components/icons/medieval/farm';
import type { BuildingId } from '@/features/game-engine/types';

interface BuildingIconProps {
  id: BuildingId;
}

export function BuildingIcon({ id }: BuildingIconProps) {
  if (id === 'castle') return <Castle aria-hidden="true" />;
  if (id === 'farm') return <Farm aria-hidden="true" />;
  if (id === 'sawmill') return <Axe aria-hidden="true" />;
  if (id === 'mine') return <Pickaxe aria-hidden="true" />;
  if (id === 'market') return <Store aria-hidden="true" />;
  if (id === 'barracks') return <Barracks aria-hidden="true" />;
  return <Landmark aria-hidden="true" />;
}

import type { BuildingId } from '@/features/game-engine/types';
import { CastleIcon } from './icons/CastleIcon';
import { FarmIcon } from './icons/FarmIcon';
import { SawmillIcon } from './icons/SawmillIcon';
import { MineIcon } from './icons/MineIcon';
import { MarketIcon } from './icons/MarketIcon';
import { PrefeituraIcon } from './icons/PrefeituraIcon';
import { DefaultBuildingIcon } from './icons/DefaultBuildingIcon';

interface BuildingIconProps {
  id: BuildingId;
  className?: string;
}

export function BuildingIcon({ id, className = 'w-10 h-10' }: BuildingIconProps) {
  if (id === 'castle') return <CastleIcon className={className} />;
  if (id === 'farm') return <FarmIcon className={className} />;
  if (id === 'sawmill') return <SawmillIcon className={className} />;
  if (id === 'mine') return <MineIcon className={className} />;
  if (id === 'market') return <MarketIcon className={className} />;
  if (id === 'prefeitura') return <PrefeituraIcon className={className} />;
  return <DefaultBuildingIcon className={className} />;
}

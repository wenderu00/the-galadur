import { CastleGoldSlider } from './CastleGoldSlider';
import { PrefeituraSpeedInfo } from './PrefeituraSpeedInfo';
import { BarracksPanel } from '../barracks/components/BarracksPanel';
import { MarketPanel } from '../market/components/MarketPanel';
import type { BuildingId } from '@/features/game-engine/types';

interface BuildingExtraProps {
  buildingId: BuildingId;
}

export function BuildingExtra({ buildingId }: BuildingExtraProps) {
  if (buildingId === 'castle') return <CastleGoldSlider />;
  if (buildingId === 'prefeitura') return <PrefeituraSpeedInfo />;
  if (buildingId === 'barracks') return <BarracksPanel />;
  if (buildingId === 'market') return <MarketPanel />;
  return null;
}

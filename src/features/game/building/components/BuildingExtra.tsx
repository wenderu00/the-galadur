import { CastleGoldSlider } from './CastleGoldSlider';
import { PrefeituraSpeedInfo } from './PrefeituraSpeedInfo';
import { BarracksPanel } from '../barracks/components/BarracksPanel';
import type { BuildingId } from '@/features/game-engine/types';

interface BuildingExtraProps {
  buildingId: BuildingId;
}

export function BuildingExtra({ buildingId }: BuildingExtraProps) {
  if (buildingId === 'castle') return <CastleGoldSlider />;
  if (buildingId === 'prefeitura') return <PrefeituraSpeedInfo />;
  if (buildingId === 'barracks') return <BarracksPanel />;
  return null;
}

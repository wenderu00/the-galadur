import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import type { BuildingState } from '@/features/game-engine/types';
import { BuildingIcon } from '@/features/game/components/BuildingIcon';
import { TimedProgress } from '@/features/game/components/TimedProgress';
import { useBuildingCard } from '../hooks/useBuildingCard';
import { BuildingStats } from './BuildingStats';

interface BuildingCardProps {
  building: BuildingState;
  onOpen: () => void;
}

export function BuildingCard({ building, onOpen }: BuildingCardProps) {
  const { def, activeEntry, currentLevelDef, upgradeStatus } = useBuildingCard(building);

  return (
    <Card interactive data-testid={`building-card-${building.id}`} className="h-full gap-4 p-5">
      <CardHeader className="flex-row items-center gap-4">
        <IconTile>
          <BuildingIcon id={building.id} />
        </IconTile>
        <div className="flex flex-col gap-1">
          <CardTitle as="h2" className="text-lg">
            <CardAction onClick={onOpen}>{def.name}</CardAction>
          </CardTitle>
          <p
            data-testid={`building-card-${building.id}-level`}
            className="font-mono text-mono-xs text-ink-muted"
          >
            Nível {building.level} de {def.maxLevel}
          </p>
        </div>
      </CardHeader>
      <CardDescription className="hidden text-sm sm:block">{def.description}</CardDescription>
      <BuildingStats
        production={currentLevelDef?.effects.productionPerTick ?? {}}
        storageBonus={currentLevelDef?.effects.storageBonus ?? {}}
      />
      {activeEntry ? (
        <TimedProgress
          label="Em construção"
          startedAt={activeEntry.startedAt}
          completesAt={activeEntry.completesAt}
        />
      ) : (
        <p className="mt-auto text-sm text-ink-soft">{upgradeStatus}</p>
      )}
    </Card>
  );
}

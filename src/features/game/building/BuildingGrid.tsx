import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { PageHeader } from '@/components/ui/page-header';
import type { BuildingId } from '@/features/game-engine/types';
import { buildingsAtom } from '@/store/gameAtoms';
import { BuildingExtra } from './BuildingExtra';
import { BuildingCard } from './card/components/BuildingCard';
import { BuildingModal } from './modal/components/BuildingModal';

export function BuildingGrid() {
  const buildings = Object.values(useAtomValue(buildingsAtom));
  const [selectedId, setSelectedId] = useState<BuildingId | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Visão da cidade"
        description="Gerencie suas construções e expanda seu império."
      />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {buildings.map((building) => (
          <li key={building.id}>
            <BuildingCard building={building} onOpen={() => setSelectedId(building.id)} />
          </li>
        ))}
      </ul>
      {selectedId !== null && (
        <BuildingModal
          buildingId={selectedId}
          extra={<BuildingExtra buildingId={selectedId} />}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

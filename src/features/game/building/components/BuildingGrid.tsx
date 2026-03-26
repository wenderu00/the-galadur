import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { buildingsAtom } from '@/store/gameAtoms';
import { BuildingCard } from './BuildingCard';
import { BuildingModal } from './BuildingModal';
import type { BuildingId } from '@/features/game-engine/types';

export function BuildingGrid() {
  const buildings = useAtomValue(buildingsAtom);
  const [selectedId, setSelectedId] = useState<BuildingId | null>(null);

  const allBuildings = Object.values(buildings);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-medieval text-2xl font-bold text-white">Visão da Cidade</h1>
        <p className="text-sm text-realm-500">
          Gerencie suas construções e expanda seu império
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 list-none p-0">
        {allBuildings.map((building) => (
          <li key={building.id}>
            <BuildingCard
              building={building}
              onOpenModal={() => setSelectedId(building.id)}
            />
          </li>
        ))}
      </ul>

      {selectedId !== null && (
        <BuildingModal buildingId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}

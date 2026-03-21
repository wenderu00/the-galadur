import { useAtomValue } from 'jotai';
import { buildQueueAtom } from '@/store/gameAtoms';
import { BUILDING_DEFINITIONS } from '@/config/buildings';
import { BuildingIcon } from '@/features/game/components/BuildingIcon';
import { ProgressBar } from '@/features/game/components/ProgressBar';

export function ConstructionQueue() {
  const buildQueue = useAtomValue(buildQueueAtom);

  return (
    <section className="p-4 border-b border-realm-800">
      <div className="flex items-center gap-2 mb-3">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-realm-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
        <h2 className="text-xs font-medieval uppercase tracking-widest text-realm-400">
          Fila de Construção
        </h2>
      </div>

      {buildQueue.length === 0 ? (
        <p className="text-xs text-realm-600 text-center py-4">
          Nenhuma construção em andamento
        </p>
      ) : (
        <ul className="space-y-3">
          {buildQueue.map((entry) => {
            const def = BUILDING_DEFINITIONS[entry.buildingId];
            return (
              <li
                key={`${entry.buildingId}-${entry.targetLevel}`}
                className="bg-realm-950 border border-realm-800 p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400">
                    <BuildingIcon id={entry.buildingId} className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white">{def.name}</p>
                    <p className="text-[10px] text-realm-500">→ Nível {entry.targetLevel}</p>
                  </div>
                </div>
                <ProgressBar startedAt={entry.startedAt} completesAt={entry.completesAt} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

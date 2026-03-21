import { useAtomValue } from 'jotai';
import { buildQueueAtom, buildingsAtom } from '@/store/gameAtoms';
import { eventLogAtom } from '@/store/eventLogAtom';
import { BUILDING_DEFINITIONS } from '@/config/buildings';
import { BuildingIcon } from './BuildingIcon';
import { ProgressBar } from './ProgressBar';

function ConstructionQueue() {
  const buildQueue = useAtomValue(buildQueueAtom);

  return (
    <section className="p-4 border-b border-realm-800">
      <div className="flex items-center gap-2 mb-3">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-realm-500" fill="none" stroke="currentColor" strokeWidth="1.5">
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
        <div className="space-y-3">
          {buildQueue.map((entry) => {
            const def = BUILDING_DEFINITIONS[entry.buildingId];
            return (
              <div key={`${entry.buildingId}-${entry.targetLevel}`} className="bg-realm-950 border border-realm-800 p-3">
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
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EmpireStatus() {
  const buildings = useAtomValue(buildingsAtom);

  const totalBuildings = Object.values(buildings).filter((b) => b.level > 0).length;
  const totalLevels = Object.values(buildings).reduce((sum, b) => sum + b.level, 0);
  const empireScore = totalLevels * 30;

  return (
    <section className="p-4 border-b border-realm-800">
      <h2 className="text-xs font-medieval uppercase tracking-widest text-realm-400 mb-3">
        Status do Império
      </h2>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-realm-500">Total de Construções</span>
          <span className="text-sm font-semibold text-white tabular-nums">{totalBuildings}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-realm-500">Níveis Totais</span>
          <span className="text-sm font-semibold text-white tabular-nums">{totalLevels}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-realm-500">Pontuação do Império</span>
          <span className="text-sm font-semibold text-gold-400 tabular-nums">{empireScore}</span>
        </div>
      </div>
    </section>
  );
}

function RecentEvents() {
  const events = useAtomValue(eventLogAtom);
  const recent = [...events].reverse().slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <section className="p-4 border-b border-realm-800">
      <h2 className="text-xs font-medieval uppercase tracking-widest text-realm-400 mb-3">
        Eventos Recentes
      </h2>
      <div className="space-y-1.5">
        {recent.map((event, i) => (
          <p key={i} className="text-[11px] text-realm-500 leading-relaxed">
            {event.message}
          </p>
        ))}
      </div>
    </section>
  );
}

function TipSection() {
  return (
    <section className="p-4">
      <div className="flex items-start gap-2">
        <span className="text-yellow-400 text-base leading-none mt-0.5">💡</span>
        <div>
          <h2 className="text-xs font-medieval uppercase tracking-widest text-realm-400 mb-1">
            Dica
          </h2>
          <p className="text-xs text-realm-500 leading-relaxed">
            Faça upgrade do Castelo para aumentar o armazenamento e desbloquear novas construções.
          </p>
        </div>
      </div>
    </section>
  );
}

export function RightPanel() {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-realm-950 border-l border-realm-800 overflow-y-auto">
      <ConstructionQueue />
      <EmpireStatus />
      <RecentEvents />
      <TipSection />
    </aside>
  );
}

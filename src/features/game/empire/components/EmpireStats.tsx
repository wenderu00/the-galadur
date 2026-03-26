import { useAtomValue } from 'jotai';
import { buildingsAtom } from '@/store/gameAtoms';

export function EmpireStats() {
  const buildings = useAtomValue(buildingsAtom);

  const totalBuildings = Object.values(buildings).filter((b) => b.level > 0).length;
  const totalLevels = Object.values(buildings).reduce((sum, b) => sum + b.level, 0);
  const empireScore = totalLevels * 30;

  return (
    <section className="p-3 md:p-4 border-b border-realm-800">
      <h2 className="text-xs font-medieval uppercase tracking-widest text-realm-400 mb-3">
        Status do Império
      </h2>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <dt className="text-xs text-realm-500">Total de Construções</dt>
          <dd className="text-sm font-semibold text-white tabular-nums">{totalBuildings}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-xs text-realm-500">Níveis Totais</dt>
          <dd className="text-sm font-semibold text-white tabular-nums">{totalLevels}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-xs text-realm-500">Pontuação do Império</dt>
          <dd className="text-sm font-semibold text-gold-400 tabular-nums">{empireScore}</dd>
        </div>
      </dl>
    </section>
  );
}

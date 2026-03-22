import { useAtomValue } from 'jotai';
import { buildingsAtom } from '@/store/gameAtoms';
import { getBuildingLevelDef } from '@/config/buildings';
import type { BuildingLevel } from '@/features/game-engine/types';

export function PrefeituraSpeedInfo() {
  const buildings = useAtomValue(buildingsAtom);
  const level = buildings['prefeitura'].level;

  if (level === 0) return null;

  const def = getBuildingLevelDef('prefeitura', level as Exclude<BuildingLevel, 0>);
  const bonus = def.effects.constructionSpeedBonus ?? 0;
  const percentage = Math.round(bonus * 100);

  return (
    <section className="space-y-1 pt-1 border-t border-realm-800">
      <p className="text-[10px] font-medieval uppercase tracking-widest text-realm-500">
        Bônus de Construção
      </p>
      <p className="text-sm text-green-400">
        −{percentage}% no tempo de todas as construções
      </p>
    </section>
  );
}

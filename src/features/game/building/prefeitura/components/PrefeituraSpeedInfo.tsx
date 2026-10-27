import { useAtomValue } from 'jotai';
import { buildingsAtom } from '@/store/gameAtoms';
import { getBuildingLevelDef } from '@/config/buildings';
import type { BuildingLevel } from '@/features/game-engine/types';
import { PanelSection } from '@/features/game/components/PanelSection';

export function PrefeituraSpeedInfo() {
  const buildings = useAtomValue(buildingsAtom);
  const level = buildings['prefeitura'].level;

  if (level === 0) return null;

  const def = getBuildingLevelDef('prefeitura', level as Exclude<BuildingLevel, 0>);
  const bonus = def.effects.constructionSpeedBonus ?? 0;
  const percentage = new Intl.NumberFormat('pt-BR', { style: 'percent' }).format(bonus);

  return (
    <PanelSection title="Bônus de construção" headingLevel="h3">
      <p className="text-sm text-ink-soft">O tempo de todas as construções cai {percentage}.</p>
    </PanelSection>
  );
}

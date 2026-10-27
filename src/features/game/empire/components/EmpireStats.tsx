import { useAtomValue } from 'jotai';
import { DescriptionList } from '@/components/ui/description-list';
import { formatNumber } from '@/lib/format';
import { buildingsAtom } from '@/store/gameAtoms';
import { PanelSection } from '../../components/PanelSection';

const SCORE_PER_LEVEL = 30;

export function EmpireStats() {
  const buildings = Object.values(useAtomValue(buildingsAtom));
  const totalBuildings = buildings.filter((building) => building.level > 0).length;
  const totalLevels = buildings.reduce((sum, building) => sum + building.level, 0);

  return (
    <PanelSection title="Status do império">
      <DescriptionList
        items={[
          { term: 'Total de construções', description: formatNumber(totalBuildings) },
          { term: 'Níveis totais', description: formatNumber(totalLevels) },
          {
            term: 'Pontuação do império',
            description: formatNumber(totalLevels * SCORE_PER_LEVEL),
          },
        ]}
      />
    </PanelSection>
  );
}

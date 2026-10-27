import { PanelSection } from '@/features/game/components/PanelSection';
import { useBarracksPanel } from '../hooks/useBarracksPanel';
import { TrainingProgress } from './TrainingProgress';
import { UnitCard } from './UnitCard';

export function BarracksPanel() {
  const { barracksLevel, units, activeTraining, isTraining } = useBarracksPanel();

  if (barracksLevel === 0) {
    return (
      <p className="text-sm text-ink-soft">Construa o Quartel para treinar unidades militares.</p>
    );
  }

  return (
    <>
      <PanelSection title="Unidades disponíveis" headingLevel="h3">
        {units.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {units.map((unit) => (
              <UnitCard key={unit.def.id} data={unit} isTraining={isTraining} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-soft">Nenhuma unidade liberada neste nível.</p>
        )}
      </PanelSection>
      {activeTraining && <TrainingProgress entry={activeTraining} />}
    </>
  );
}

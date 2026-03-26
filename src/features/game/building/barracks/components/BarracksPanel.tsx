import { useBarracksPanel } from '../hooks/useBarracksPanel';
import { UnitCard } from './UnitCard';
import { TrainingProgress } from './TrainingProgress';

export function BarracksPanel() {
  const { barracksLevel, units, activeTraining, isTraining } = useBarracksPanel();

  if (barracksLevel === 0) {
    return (
      <section className="pt-2 border-t border-realm-800">
        <p className="text-xs text-realm-400">
          Construa o Quartel para treinar unidades militares.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3 pt-3 border-t border-realm-800">
      <p className="text-xs font-medieval uppercase tracking-widest text-realm-500">
        Unidades Disponíveis
      </p>

      {units.length > 0 ? (
        <ul className="space-y-2">
          {units.map((u) => (
            <UnitCard key={u.def.id} data={u} isTraining={isTraining} />
          ))}
        </ul>
      ) : (
        <p className="text-xs text-realm-400">Nenhuma unidade desbloqueada neste nível.</p>
      )}

      {activeTraining && <TrainingProgress entry={activeTraining} />}
    </section>
  );
}

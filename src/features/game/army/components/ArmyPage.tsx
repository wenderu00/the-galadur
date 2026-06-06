import { UnitRoster } from './UnitRoster';
import { EnemyList } from './EnemyList';
import { MobilizationModal } from './MobilizationModal';
import { BattleResultOverlay } from './BattleResultOverlay';
import { useArmyActions } from '../hooks/useArmyActions';

export function ArmyPage() {
  const {
    selectedEnemy,
    battleResult,
    mobilization,
    onSelectEnemy,
    onCloseModal,
    onSetMobilization,
    onConfirmAttack,
    onCloseBattleResult,
  } = useArmyActions();

  return (
    <section data-testid="army-page" className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
      <header className="mb-6">
        <h1 className="text-base font-medieval font-bold text-white tracking-wider">Exército</h1>
        <p className="text-xs text-realm-400 mt-1">
          Mobilize suas tropas para atacar impérios inimigos.
        </p>
      </header>
      <UnitRoster />
      <EnemyList onAttack={onSelectEnemy} />
      {selectedEnemy && (
        <MobilizationModal
          enemy={selectedEnemy}
          mobilization={mobilization}
          onSetMobilization={onSetMobilization}
          onConfirm={onConfirmAttack}
          onClose={onCloseModal}
        />
      )}
      {battleResult && <BattleResultOverlay result={battleResult} onClose={onCloseBattleResult} />}
    </section>
  );
}

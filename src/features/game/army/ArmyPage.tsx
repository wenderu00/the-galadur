import { PageHeader } from '@/components/ui/page-header';
import { useArmyActions } from './hooks/useArmyActions';
import { BattleResultOverlay } from './battle/components/BattleResultOverlay';
import { EnemyList } from './enemies/components/EnemyList';
import { MobilizationModal } from './mobilization/components/MobilizationModal';
import { UnitRoster } from './roster/components/UnitRoster';

export function ArmyPage() {
  const army = useArmyActions();

  return (
    <section data-testid="army-page" className="flex flex-col gap-8">
      <PageHeader
        title="Exército"
        description="Mobilize suas tropas para atacar impérios inimigos."
      />
      <UnitRoster />
      <EnemyList onAttack={army.onSelectEnemy} />
      {army.selectedEnemy && (
        <MobilizationModal
          enemy={army.selectedEnemy}
          mobilization={army.mobilization}
          onSetMobilization={army.onSetMobilization}
          onConfirm={army.onConfirmAttack}
          onClose={army.onCloseModal}
        />
      )}
      {army.battleResult && (
        <BattleResultOverlay result={army.battleResult} onClose={army.onCloseBattleResult} />
      )}
    </section>
  );
}

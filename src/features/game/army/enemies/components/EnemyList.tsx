import { useAtomValue } from 'jotai';
import { ENEMIES, ALL_ENEMY_IDS } from '@/config/enemies';
import type { EnemyDefinition } from '@/features/game-engine/combat-types';
import { PanelSection } from '@/features/game/components/PanelSection';
import { defeatedEnemiesAtom } from '@/store/gameAtoms';
import { EnemyCard } from './EnemyCard';

interface EnemyListProps {
  onAttack: (enemy: EnemyDefinition) => void;
}

export function EnemyList({ onAttack }: EnemyListProps) {
  const defeated = useAtomValue(defeatedEnemiesAtom);

  return (
    <PanelSection title="Impérios inimigos">
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {ALL_ENEMY_IDS.map((id) => (
          <EnemyCard
            key={id}
            enemy={ENEMIES[id]}
            isUnlocked={defeated.length >= ENEMIES[id].requiredDefeats}
            isDefeated={defeated.includes(id)}
            onAttack={onAttack}
          />
        ))}
      </ul>
    </PanelSection>
  );
}

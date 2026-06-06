import { useAtomValue } from 'jotai';
import { defeatedEnemiesAtom } from '@/store/gameAtoms';
import { ENEMIES, ALL_ENEMY_IDS } from '@/config/enemies';
import { EnemyCard } from './EnemyCard';
import type { EnemyDefinition } from '@/features/game-engine/combat-types';

interface EnemyListProps {
  onAttack: (enemy: EnemyDefinition) => void;
}

export function EnemyList({ onAttack }: EnemyListProps) {
  const defeated = useAtomValue(defeatedEnemiesAtom);

  return (
    <section>
      <h2 className="text-sm font-medieval font-bold text-realm-300 uppercase tracking-widest mb-3">
        Impérios Inimigos
      </h2>
      <ul className="space-y-2">
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
    </section>
  );
}

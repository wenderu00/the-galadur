import { useAtomValue } from 'jotai';
import { militaryUnitsAtom } from '@/store/gameAtoms';
import { ALL_UNIT_IDS } from '@/config/units';
import type { EnemyDefinition } from '@/features/game-engine/combat-types';

interface EnemyCardProps {
  enemy: EnemyDefinition;
  isUnlocked: boolean;
  isDefeated: boolean;
  onAttack: (enemy: EnemyDefinition) => void;
}

export function EnemyCard({ enemy, isUnlocked, isDefeated, onAttack }: EnemyCardProps) {
  const units = useAtomValue(militaryUnitsAtom);
  const hasUnits = ALL_UNIT_IDS.some((id) => units[id] > 0);

  return (
    <li
      data-testid={`enemy-card-${enemy.id}`}
      className={`flex items-start justify-between p-4 border ${
        isUnlocked ? 'border-realm-700 bg-realm-900' : 'border-realm-800 bg-realm-950 opacity-50'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-bold text-white">{enemy.name}</h3>
          {isDefeated && (
            <span className="text-xs text-violet-400 font-medieval tracking-widest">DERROTADO</span>
          )}
        </div>
        <p className="text-xs text-realm-400 mb-2">{enemy.description}</p>
        <p className="text-xs text-realm-500">Poder: {enemy.power}</p>
      </div>
      <button
        data-testid={`enemy-card-${enemy.id}-attack`}
        disabled={!isUnlocked || !hasUnits}
        onClick={() => onAttack(enemy)}
        className="ml-4 px-3 py-1.5 text-xs font-medium bg-violet-700 hover:bg-violet-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
      >
        Atacar
      </button>
    </li>
  );
}

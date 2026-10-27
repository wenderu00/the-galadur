import { useAtomValue } from 'jotai';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ALL_UNIT_IDS } from '@/config/units';
import type { EnemyDefinition } from '@/features/game-engine/combat-types';
import { formatNumber } from '@/lib/format';
import { militaryUnitsAtom } from '@/store/gameAtoms';

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
    <li>
      <Card data-testid={`enemy-card-${enemy.id}`} className="h-full gap-4 p-5">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">{enemy.name}</CardTitle>
            {isDefeated && <Badge tone="success">derrotado</Badge>}
            {!isUnlocked && <Badge>bloqueado</Badge>}
          </div>
          <CardDescription className="text-sm">{enemy.description}</CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto justify-between">
          <p className="font-mono text-mono-sm text-ink-soft">Poder {formatNumber(enemy.power)}</p>
          <Button
            size="sm"
            data-testid={`enemy-card-${enemy.id}-attack`}
            disabled={!isUnlocked || !hasUnits}
            onClick={() => onAttack(enemy)}
          >
            Atacar
          </Button>
        </CardFooter>
      </Card>
    </li>
  );
}

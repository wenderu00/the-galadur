import { useAtomValue } from 'jotai';
import { resourcesAtom, productionAtom, gameDayAtom } from '@/store/gameAtoms';
import { ResourceBar } from './ResourceBar';
import { GameDayCounter } from './GameDayCounter';
import { GameSpeedControls } from './GameSpeedControls';
import type { ResourceKind } from '@/features/game-engine/types';

const RESOURCE_ORDER: ResourceKind[] = ['wood', 'stone', 'food', 'gold'];

export function ResourceHUD() {
  const resources = useAtomValue(resourcesAtom);
  const production = useAtomValue(productionAtom);
  const day = useAtomValue(gameDayAtom);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-realm-950 border-b border-realm-800 gap-6">
      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
        {RESOURCE_ORDER.map((kind) => (
          <ResourceBar
            key={kind}
            kind={kind}
            current={Math.floor(resources.current[kind])}
            max={resources.max[kind]}
            rate={production[kind]}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <GameDayCounter day={day} />
        <GameSpeedControls />
      </div>
    </header>
  );
}

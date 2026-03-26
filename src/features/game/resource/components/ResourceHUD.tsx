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
    <header className="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-6 py-2 md:py-3 bg-realm-950 border-b border-realm-800 gap-2 md:gap-6">
      <div className="flex items-center justify-between md:justify-start gap-4 flex-shrink-0 order-first md:order-last">
        <GameDayCounter day={day} />
        <GameSpeedControls />
      </div>

      <div className="grid grid-cols-4 gap-1 md:hidden">
        {RESOURCE_ORDER.map((kind) => (
          <ResourceBar
            key={kind}
            kind={kind}
            current={Math.floor(resources.current[kind])}
            max={resources.max[kind]}
            rate={production[kind]}
            compact
          />
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-2 md:gap-2 flex-shrink-0">
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
    </header>
  );
}

import { useAtomValue } from 'jotai';
import { gameDayAtom } from '@/store/gameAtoms';
import { GameDayCounter } from './GameDayCounter';
import { GameSpeedControls } from './GameSpeedControls';
import { ResourceMeters } from './ResourceMeters';

export function ResourceHUD() {
  const day = useAtomValue(gameDayAtom);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 py-3">
      <div className="flex items-center justify-between gap-4">
        <GameDayCounter day={day} />
        <GameSpeedControls />
      </div>
      <ResourceMeters size="compact" className="grid grid-cols-2 gap-x-4 gap-y-2 md:hidden" />
      <ResourceMeters size="md" className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4" />
    </div>
  );
}

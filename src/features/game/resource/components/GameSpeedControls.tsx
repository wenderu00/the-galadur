import { useAtomValue, useSetAtom } from 'jotai';
import { gameSpeedAtom } from '@/store/gameAtoms';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { GameSpeed } from '@/store/gameAtoms';

const SPEED_OPTIONS: GameSpeed[] = [0.5, 1, 2, 4];

export function GameSpeedControls() {
  const speed = useAtomValue(gameSpeedAtom);
  const setSpeed = useSetAtom(gameSpeedAtom);

  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setSpeed(speed === 0 ? 1 : 0)}
        className={cn(
          'w-8 h-8 rounded-none border',
          speed === 0
            ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-600 hover:text-white'
            : 'bg-realm-900 border-realm-700 text-realm-400 hover:border-realm-600 hover:bg-realm-900',
        )}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
          <rect x="6" y="5" width="4" height="14" />
          <rect x="14" y="5" width="4" height="14" />
        </svg>
      </Button>

      {SPEED_OPTIONS.map((s) => (
        <Button
          key={s}
          size="sm"
          variant="ghost"
          onClick={() => setSpeed(s)}
          className={cn(
            'h-8 rounded-none border text-xs font-semibold px-2.5',
            speed === s && speed !== 0
              ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-600 hover:text-white'
              : 'bg-realm-900 border-realm-700 text-realm-400 hover:border-realm-600 hover:bg-realm-900 hover:text-realm-300',
          )}
        >
          {s}x
        </Button>
      ))}
    </div>
  );
}

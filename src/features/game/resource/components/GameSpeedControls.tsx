import { useAtom } from 'jotai';
import { Pause } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { gameSpeedAtom, type GameSpeed } from '@/store/gameAtoms';

const SPEED_OPTIONS: Exclude<GameSpeed, 0>[] = [0.5, 1, 2, 4];
const PAUSED = '0';

function speedLabel(speed: number): string {
  return `${new Intl.NumberFormat('pt-BR').format(speed)}x`;
}

export function GameSpeedControls() {
  const [speed, setSpeed] = useAtom(gameSpeedAtom);

  function handleChange(value: string) {
    if (value === '') {
      if (speed === 0) setSpeed(1);
      return;
    }
    setSpeed(Number(value) as GameSpeed);
  }

  return (
    <ToggleGroup
      type="single"
      aria-label="Velocidade do jogo"
      value={String(speed)}
      onValueChange={handleChange}
    >
      <ToggleGroupItem
        value={PAUSED}
        aria-label="Pausar"
        data-testid="speed-btn-pause"
        data-active={speed === 0}
      >
        <Pause aria-hidden="true" />
      </ToggleGroupItem>
      {SPEED_OPTIONS.map((option) => (
        <ToggleGroupItem
          key={option}
          value={String(option)}
          data-testid={`speed-btn-${option}x`}
          data-active={speed === option}
        >
          {speedLabel(option)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

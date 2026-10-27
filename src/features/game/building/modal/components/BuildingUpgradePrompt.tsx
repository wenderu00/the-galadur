import { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BuildingUpgradePromptProps {
  upgradeDisabled: boolean;
  targetLevel: number;
  onUpgrade: () => void;
}

export function BuildingUpgradePrompt({
  upgradeDisabled,
  targetLevel,
  onUpgrade,
}: BuildingUpgradePromptProps) {
  const [denied, setDenied] = useState(false);

  function handleClick() {
    if (upgradeDisabled) {
      setDenied(true);
      return;
    }
    onUpgrade();
  }

  return (
    <Button
      aria-disabled={upgradeDisabled}
      onClick={handleClick}
      onAnimationEnd={() => setDenied(false)}
      className={cn(denied && 'motion-safe:animate-mw-glitch')}
    >
      <ArrowUp aria-hidden="true" />
      Evoluir para nível {targetLevel}
    </Button>
  );
}

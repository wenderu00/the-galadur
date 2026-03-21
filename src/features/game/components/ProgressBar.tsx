import { useEffect, useState } from 'react';
import { Progress as ProgressPrimitive } from '@base-ui/react/progress';
import { ProgressTrack, ProgressIndicator } from '@/components/ui/progress';

interface ProgressBarProps {
  startedAt: number;
  completesAt: number;
}

export function ProgressBar({ startedAt, completesAt }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const total = completesAt - startedAt;
      const elapsed = now - startedAt;
      setProgress(Math.min(100, (elapsed / total) * 100));
      setRemaining(Math.max(0, Math.ceil((completesAt - now) / 1000)));
    };

    update();
    const id = setInterval(update, 250);
    return () => clearInterval(id);
  }, [startedAt, completesAt]);

  return (
    <div className="w-full">
      <ProgressPrimitive.Root value={progress} className="w-full">
        <ProgressTrack className="h-1.5 rounded-none bg-realm-950 border border-gold-700">
          <ProgressIndicator className="bg-gold-500 rounded-none transition-all duration-300" />
        </ProgressTrack>
      </ProgressPrimitive.Root>
      <p className="text-xs text-gold-400 mt-1 font-mono">{remaining}s restantes</p>
    </div>
  );
}

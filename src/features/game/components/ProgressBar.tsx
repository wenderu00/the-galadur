import { useEffect, useState } from 'react';

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
      <div className="h-1.5 w-full bg-realm-950 border border-gold-700">
        <div
          className="h-full bg-gold-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gold-400 mt-1 font-mono">{remaining}s restantes</p>
    </div>
  );
}

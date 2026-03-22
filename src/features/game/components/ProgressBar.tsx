import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/animations';

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
    <div className="flex flex-col gap-1 w-full">
      <div className="h-1.5 bg-realm-950 border border-gold-700 w-full overflow-hidden">
        <motion.div
          className="h-full bg-gold-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: duration.slower, ease: ease.outQuart }}
        />
      </div>
      <p className="text-xs text-gold-400 font-mono">{remaining}s restantes</p>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResourceIcon } from '@/features/game/components/ResourceIcon';
import { RESOURCE_CONFIG } from './resourceConfig';
import { duration, ease } from '@/lib/animations';
import type { ResourceKind } from '@/features/game-engine/types';

function formatRate(value: number): string {
  if (value === 0) return '';
  const formatted = value % 1 === 0 ? String(value) : value.toFixed(1);
  return `+${formatted}/s`;
}

interface ResourceBarProps {
  kind: ResourceKind;
  current: number;
  max: number;
  rate: number;
}

export function ResourceBar({ kind, current, max, rate }: ResourceBarProps) {
  const cfg = RESOURCE_CONFIG[kind];
  const pct = Math.min(100, (current / max) * 100);
  const prevRef = useRef(current);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (current !== prevRef.current) {
      setPulseKey((k) => k + 1);
      prevRef.current = current;
    }
  }, [current]);

  return (
    <div
      className={`flex items-center gap-3 bg-realm-900 border ${cfg.accent} px-3 py-2 min-w-[170px]`}
    >
      <div
        className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${cfg.iconBg} border ${cfg.accent}`}
      >
        <span className={cfg.iconColor}>
          <ResourceIcon kind={kind} className="w-4 h-4" />
        </span>
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-baseline gap-1.5">
          <AnimatePresence mode="wait">
            <motion.span
              key={pulseKey}
              className="text-sm font-bold text-white tabular-nums"
              initial={{ scale: 1.25, color: '#fde68a' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: duration.slow, ease: ease.out }}
            >
              {current.toLocaleString()}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs text-realm-500">/ {max.toLocaleString()}</span>
          {rate > 0 && (
            <span className="text-xs text-sky-400 ml-auto flex-shrink-0">{formatRate(rate)}</span>
          )}
        </div>
        <div className="h-0.5 bg-realm-800 w-full overflow-hidden">
          <motion.div
            className={`h-full ${cfg.barColor}`}
            animate={{ width: `${pct}%` }}
            transition={{ duration: duration.base, ease: ease.out }}
          />
        </div>
      </div>
    </div>
  );
}

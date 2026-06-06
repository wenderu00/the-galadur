import { AnimatePresence, motion } from 'framer-motion';
import { ResourceIcon } from '@/features/game/components/ResourceIcon';
import { RESOURCE_CONFIG } from './resourceConfig';
import { duration, ease } from '@/lib/animations';
import type { ResourceKind } from '@/features/game-engine/types';

interface ResourceBarCompactProps {
  kind: ResourceKind;
  current: number;
  pulseKey: number;
}

export function ResourceBarCompact({ kind, current, pulseKey }: ResourceBarCompactProps) {
  const cfg = RESOURCE_CONFIG[kind];
  return (
    <div
      data-testid={`resource-bar-${kind}-compact`}
      className={`flex flex-col items-center justify-center gap-0.5 bg-realm-900 border ${cfg.accent} px-1 py-1.5`}
    >
      <span className={cfg.iconColor}>
        <ResourceIcon kind={kind} className="w-3.5 h-3.5" />
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={pulseKey}
          data-testid={`resource-bar-${kind}-value`}
          className="text-xs font-bold text-white tabular-nums leading-none"
          initial={{ scale: 1.25, color: '#fde68a' }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={{ duration: duration.slow, ease: ease.out }}
        >
          {current >= 1000 ? `${(current / 1000).toFixed(1)}k` : String(current)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

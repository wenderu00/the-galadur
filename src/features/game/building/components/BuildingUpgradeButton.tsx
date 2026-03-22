import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonTap, duration } from '@/lib/animations';

interface BuildingUpgradeButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
}

export function BuildingUpgradeButton({ label, disabled, onClick }: BuildingUpgradeButtonProps) {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={cn(
        'w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 border-0 border-t disabled:opacity-100',
        disabled
          ? 'bg-realm-950 text-realm-600 border-t-realm-800 hover:opacity-70'
          : 'bg-sky-600 hover:bg-sky-500 border-t-sky-600 text-white',
      )}
      whileHover={disabled ? undefined : buttonTap.whileHover}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: duration.fast }}
    >
      {!disabled && (
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M5 15l7-7 7 7" />
        </svg>
      )}
      {label}
    </motion.button>
  );
}

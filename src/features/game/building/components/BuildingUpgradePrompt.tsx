import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { duration } from '@/lib/animations';

interface BuildingUpgradePromptProps {
  upgradeDisabled: boolean;
  isConstructing: boolean;
  targetLevel: number;
  onUpgrade: () => void;
}

export function BuildingUpgradePrompt({
  upgradeDisabled,
  isConstructing,
  targetLevel,
  onUpgrade,
}: BuildingUpgradePromptProps) {
  const [shakeKey, setShakeKey] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  function handleClick() {
    if (upgradeDisabled) {
      setShakeKey((k) => k + 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }
    onUpgrade();
  }

  return (
    <div className="w-full sm:w-auto" onClick={handleClick}>
      <motion.div
        key={shakeKey}
        animate={isShaking ? { x: [0, -4, 4, -4, 4, 0] } : {}}
        transition={{ duration: duration.slow }}
      >
        <Button
          disabled={upgradeDisabled}
          className={`w-full min-h-[44px] rounded-none gap-2 disabled:opacity-100 ${
            upgradeDisabled
              ? 'bg-realm-900 border-realm-800 text-realm-600 hover:bg-realm-900'
              : 'bg-sky-600 border-sky-600 hover:bg-sky-500 text-white'
          }`}
        >
          {!upgradeDisabled && (
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
          {isConstructing ? 'Em Construção...' : `Upar para Nível ${targetLevel}`}
        </Button>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { duration } from '@/lib/animations';

interface BuildingUpgradeActionsProps {
  isMaxLevel: boolean;
  isConstructing: boolean;
  upgradeDisabled: boolean;
  targetLevel: number;
  onClose: () => void;
  onUpgrade: () => void;
}

export function BuildingUpgradeActions({
  isMaxLevel,
  isConstructing,
  upgradeDisabled,
  targetLevel,
  onClose,
  onUpgrade,
}: BuildingUpgradeActionsProps) {
  const [shakeKey, setShakeKey] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  function handleUpgradeClick() {
    if (upgradeDisabled) {
      setShakeKey((k) => k + 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }
    onUpgrade();
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
      <Button
        variant="outline"
        onClick={onClose}
        className="w-full sm:w-auto min-h-[44px] rounded-none border-realm-700 text-realm-400 hover:text-white hover:bg-realm-800 hover:border-realm-600"
      >
        Fechar
      </Button>
      {!isMaxLevel && (
        <div className="w-full sm:w-auto" onClick={handleUpgradeClick}>
          <motion.div
            key={shakeKey}
            animate={isShaking ? { x: [0, -4, 4, -4, 4, 0] } : {}}
            transition={{ duration: duration.slow }}
          >
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (!upgradeDisabled) onUpgrade();
              }}
              disabled={upgradeDisabled}
              className={`w-full min-h-[44px] rounded-none gap-2 disabled:opacity-100 ${
                upgradeDisabled
                  ? 'bg-realm-900 border-realm-800 text-realm-600 hover:bg-realm-900'
                  : 'bg-sky-600 border-sky-600 hover:bg-sky-500 text-white'
              }`}
            >
              {!upgradeDisabled && (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 15l7-7 7 7" />
                </svg>
              )}
              {isConstructing ? 'Em Construção...' : `Upar para Nível ${targetLevel}`}
            </Button>
          </motion.div>
        </div>
      )}
      {isMaxLevel && (
        <span className="w-full sm:w-auto px-5 py-2 text-sm text-realm-500 border border-realm-800 text-center">
          Nível Máximo
        </span>
      )}
    </div>
  );
}

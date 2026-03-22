import { AnimatePresence, motion } from 'framer-motion';
import { Providers } from '@/app/providers';
import { GameLayout } from '@/features/game/components/GameLayout';
import { pageTransition } from '@/lib/animations';

export function App() {
  return (
    <Providers>
      <AnimatePresence mode="wait">
        <motion.div
          key="game"
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={pageTransition.transition}
        >
          <GameLayout />
        </motion.div>
      </AnimatePresence>
    </Providers>
  );
}

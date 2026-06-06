import { useOfflineRecovery } from './useOfflineRecovery';
import { useTickEngine } from './useTickEngine';

export function useGameLoop(): void {
  useOfflineRecovery();
  useTickEngine();
}

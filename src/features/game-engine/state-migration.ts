import type { GameState } from './types';

export const GAME_STATE_VERSION = 2;

export function safeParseGameState(raw: unknown): GameState | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const candidate = raw as Record<string, unknown>;
  if (candidate['version'] === 1) {
    return safeParseGameState({
      ...candidate,
      version: 2,
      trainingQueue: [],
      militaryUnits: { warrior: 0, archer: 0, lancer: 0 },
    });
  }
  if (candidate['version'] !== GAME_STATE_VERSION) return null;
  if (
    typeof candidate['resources'] !== 'object' ||
    typeof candidate['buildings'] !== 'object' ||
    !Array.isArray(candidate['buildQueue']) ||
    typeof candidate['lastSavedAt'] !== 'number'
  ) {
    return null;
  }
  const state = raw as GameState;
  const withGoldRate =
    typeof state.castleGoldRate === 'number' ? state : { ...state, castleGoldRate: 0 };
  return Array.isArray(withGoldRate.defeatedEnemies)
    ? withGoldRate
    : { ...withGoldRate, defeatedEnemies: [] };
}

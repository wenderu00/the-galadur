import type { ResourceKind } from '@/features/game-engine/types';
import { formatNumber } from '@/lib/format';

export const RESOURCE_NAMES: Record<ResourceKind, string> = {
  wood: 'Madeira',
  stone: 'Pedra',
  food: 'Comida',
  gold: 'Ouro',
};

export function formatResourceAmount(kind: ResourceKind, amount: number): string {
  return `${formatNumber(amount)} ${RESOURCE_NAMES[kind]}`;
}

export function formatResourceGain(kind: ResourceKind, amount: number): string {
  return `+${formatNumber(amount)} ${RESOURCE_NAMES[kind].toLowerCase()}`;
}

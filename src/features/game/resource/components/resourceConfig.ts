import type { ResourceKind } from '@/features/game-engine/types';

export interface ResourceBarConfig {
  accent: string;
  iconBg: string;
  iconColor: string;
  barColor: string;
}

export const RESOURCE_CONFIG: Record<ResourceKind, ResourceBarConfig> = {
  wood: {
    accent: 'border-green-700',
    iconBg: 'bg-green-950',
    iconColor: 'text-green-400',
    barColor: 'bg-green-500',
  },
  stone: {
    accent: 'border-slate-600',
    iconBg: 'bg-slate-900',
    iconColor: 'text-slate-400',
    barColor: 'bg-slate-500',
  },
  food: {
    accent: 'border-amber-700',
    iconBg: 'bg-amber-950',
    iconColor: 'text-amber-400',
    barColor: 'bg-amber-500',
  },
  gold: {
    accent: 'border-yellow-700',
    iconBg: 'bg-yellow-950',
    iconColor: 'text-yellow-400',
    barColor: 'bg-yellow-500',
  },
};

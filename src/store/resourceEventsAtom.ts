import { atom } from 'jotai';
import type { ResourceKind } from '@/features/game-engine/types';

type ResourceEventCounts = Record<ResourceKind, number>;

export const resourceEventsAtom = atom<ResourceEventCounts>({
  wood: 0,
  stone: 0,
  food: 0,
  gold: 0,
});

export const announceResourceEventAtom = atom(null, (get, set, kinds: ResourceKind[]) => {
  const next = { ...get(resourceEventsAtom) };
  for (const kind of kinds) next[kind] += 1;
  set(resourceEventsAtom, next);
});

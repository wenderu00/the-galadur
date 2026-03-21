import { atom } from 'jotai';

export interface GameEvent {
  timestamp: number;
  message: string;
}

export const eventLogAtom = atom<GameEvent[]>([]);

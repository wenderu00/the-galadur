import { atom } from 'jotai';

export type MobileTab = 'buildings' | 'navigation' | 'summary';
export const mobileTabAtom = atom<MobileTab>('buildings');

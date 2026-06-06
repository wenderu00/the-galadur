import { atom } from 'jotai';

export type ActivePage = 'cidade' | 'exercito';

export const activePageAtom = atom<ActivePage>('cidade');

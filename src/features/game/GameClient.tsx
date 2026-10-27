'use client';

import dynamic from 'next/dynamic';

const GamePage = dynamic(() => import('./GamePage').then((module) => module.GamePage), {
  ssr: false,
});

export function GameClient() {
  return <GamePage />;
}

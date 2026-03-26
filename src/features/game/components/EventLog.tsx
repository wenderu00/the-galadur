import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { eventLogAtom } from '@/store/eventLogAtom';

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function EventLog() {
  const events = useAtomValue(eventLogAtom);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <footer className="h-28 md:h-36 bg-black border-t border-gold-700 overflow-y-auto px-4 py-2">
      {events.length === 0 ? (
        <p className="font-mono text-xs text-green-700">{'> Aguardando eventos...'}</p>
      ) : (
        events.map((event, i) => (
          <p key={i} className="font-mono text-xs text-green-400 leading-5">
            <span className="text-green-600">[{formatTime(event.timestamp)}]</span>
            {' '}
            {event.message}
          </p>
        ))
      )}
      <div ref={bottomRef} />
    </footer>
  );
}

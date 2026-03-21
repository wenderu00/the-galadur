import { useAtomValue } from 'jotai';
import { eventLogAtom } from '@/store/eventLogAtom';

export function RecentEvents() {
  const events = useAtomValue(eventLogAtom);
  const recent = [...events].reverse().slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <section className="p-4 border-b border-realm-800">
      <h2 className="text-xs font-medieval uppercase tracking-widest text-realm-400 mb-3">
        Eventos Recentes
      </h2>
      <ul className="space-y-1.5">
        {recent.map((event, i) => (
          <li key={i} className="text-[11px] text-realm-500 leading-relaxed">
            {event.message}
          </li>
        ))}
      </ul>
    </section>
  );
}

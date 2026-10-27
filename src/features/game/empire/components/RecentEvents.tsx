import { useAtomValue } from 'jotai';
import { eventLogAtom } from '@/store/eventLogAtom';
import { PanelSection } from '../../components/PanelSection';

const VISIBLE_EVENTS = 5;

export function RecentEvents() {
  const events = useAtomValue(eventLogAtom);
  const recent = [...events].reverse().slice(0, VISIBLE_EVENTS);

  if (recent.length === 0) return null;

  return (
    <PanelSection title="Eventos recentes">
      <ul className="flex flex-col gap-2">
        {recent.map((event) => (
          <li key={`${event.timestamp}-${event.message}`} className="text-sm text-ink-soft">
            {event.message}
          </li>
        ))}
      </ul>
    </PanelSection>
  );
}

import { Progress } from '@/components/ui/progress';
import { formatDuration } from '@/lib/format';
import { useNow } from '../hooks/useNow';

interface TimedProgressProps {
  label: string;
  startedAt: number;
  completesAt: number;
}

export function TimedProgress({ label, startedAt, completesAt }: TimedProgressProps) {
  const now = useNow();
  const total = Math.max(1, completesAt - startedAt);
  const percent = Math.min(100, Math.max(0, ((now - startedAt) / total) * 100));
  const remainingSeconds = Math.max(0, (completesAt - now) / 1000);

  return (
    <Progress
      label={label}
      value={percent}
      size="sm"
      showValue
      valueText={`${formatDuration(remainingSeconds)} restantes`}
    />
  );
}

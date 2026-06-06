import { useEffect, useRef, useState } from 'react';

export function formatRate(value: number): string {
  if (value === 0) return '';
  const formatted = value % 1 === 0 ? String(value) : value.toFixed(1);
  return `+${formatted}/s`;
}

export function usePulseKey(current: number): number {
  const prevRef = useRef(current);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (current !== prevRef.current) {
      setPulseKey((k) => k + 1);
      prevRef.current = current;
    }
  }, [current]);

  return pulseKey;
}

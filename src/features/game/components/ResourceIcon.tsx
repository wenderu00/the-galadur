import type { ResourceKind } from '@/features/game-engine/types';

interface ResourceIconProps {
  kind: ResourceKind;
  className?: string;
}

export function ResourceIcon({ kind, className = 'w-5 h-5' }: ResourceIconProps) {
  if (kind === 'wood') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 20h10" />
        <path d="M5 17c0-4 3-9 7-9s7 5 7 9" />
        <path d="M12 8V4" />
        <path d="M9.5 6.5L12 4l2.5 2.5" />
        <ellipse cx="12" cy="19" rx="5" ry="1.5" />
      </svg>
    );
  }

  if (kind === 'stone') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18 L8 10 L12 14 L16 8 L20 18 Z" />
        <path d="M4 18 h16" />
      </svg>
    );
  }

  if (kind === 'food') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V8" />
        <path d="M9 11l3-3 3 3" />
        <path d="M9 15l3-3 3 3" />
        <path d="M8 8 Q7 5 10 4" />
        <path d="M16 8 Q17 5 14 4" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 4 V7" />
      <path d="M12 17 V20" />
      <path d="M4 12 H7" />
      <path d="M17 12 H20" />
    </svg>
  );
}

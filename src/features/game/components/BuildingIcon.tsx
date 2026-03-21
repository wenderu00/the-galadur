import type { BuildingId } from '@/features/game-engine/types';

interface BuildingIconProps {
  id: BuildingId;
  className?: string;
}

export function BuildingIcon({ id, className = 'w-10 h-10' }: BuildingIconProps) {
  const props = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (id === 'castle') {
    return (
      <svg {...props}>
        <rect x="3" y="11" width="18" height="10" />
        <path d="M3 11 V8 H6 V11" />
        <path d="M9 11 V8 H12 V11" />
        <path d="M15 11 V8 H18 V11" />
        <rect x="9" y="16" width="6" height="5" />
        <path d="M6 11 V8" />
        <path d="M18 11 V8" />
      </svg>
    );
  }

  if (id === 'farm') {
    return (
      <svg {...props}>
        <path d="M3 20 L7 8 L12 14 L17 8 L21 20" />
        <path d="M3 20 h18" />
        <path d="M12 14 V20" />
        <path d="M9 11 Q12 8 15 11" />
      </svg>
    );
  }

  if (id === 'sawmill') {
    return (
      <svg {...props}>
        <rect x="4" y="13" width="16" height="5" rx="2.5" />
        <path d="M4 15.5 H20" />
        <path d="M10 13 V7" />
        <path d="M14 13 V7" />
        <path d="M8 7 h8" />
        <path d="M17 10 L21 7 L21 13 Z" />
      </svg>
    );
  }

  if (id === 'mine') {
    return (
      <svg {...props}>
        <path d="M4 20 L4 14 Q4 10 8 8 L12 6" />
        <path d="M12 6 L16 8 Q20 10 20 14 L20 20" />
        <path d="M4 20 h16" />
        <path d="M8 20 V15" />
        <path d="M16 20 V15" />
        <path d="M8 15 h8" />
        <path d="M14 9 L17 6 L19 8 L16 11 Z" />
      </svg>
    );
  }

  if (id === 'market') {
    return (
      <svg {...props}>
        <path d="M3 9 L5 4 H19 L21 9" />
        <rect x="3" y="9" width="18" height="12" />
        <path d="M3 9 Q12 13 21 9" />
        <rect x="9" y="14" width="6" height="7" />
        <path d="M12 4 V9" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <rect x="3" y="8" width="18" height="13" />
      <path d="M3 8 L12 3 L21 8" />
      <rect x="8" y="14" width="4" height="7" />
      <rect x="14" y="12" width="5" height="4" />
      <path d="M5 8 V21" strokeOpacity="0.3" />
      <path d="M19 8 V21" strokeOpacity="0.3" />
    </svg>
  );
}

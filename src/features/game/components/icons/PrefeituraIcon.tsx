interface PrefeituraIconProps {
  className?: string;
}

export function PrefeituraIcon({ className }: PrefeituraIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="10" width="20" height="11" />
      <path d="M2 10 L12 4 L22 10" />
      <line x1="12" y1="4" x2="12" y2="1" />
      <path d="M12 1 L16 2.5 L12 4" fill="currentColor" strokeWidth="1" />
      <rect x="5" y="14" width="3" height="7" />
      <rect x="10.5" y="13" width="3" height="8" />
      <rect x="16" y="14" width="3" height="7" />
    </svg>
  );
}

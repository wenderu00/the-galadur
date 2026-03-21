interface SawmillIconProps {
  className?: string;
}

export function SawmillIcon({ className }: SawmillIconProps) {
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
      <rect x="4" y="13" width="16" height="5" rx="2.5" />
      <path d="M4 15.5 H20" />
      <path d="M10 13 V7" />
      <path d="M14 13 V7" />
      <path d="M8 7 h8" />
      <path d="M17 10 L21 7 L21 13 Z" />
    </svg>
  );
}

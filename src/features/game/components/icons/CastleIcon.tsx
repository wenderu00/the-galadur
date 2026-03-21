interface CastleIconProps {
  className?: string;
}

export function CastleIcon({ className }: CastleIconProps) {
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

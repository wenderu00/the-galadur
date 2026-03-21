interface MarketIconProps {
  className?: string;
}

export function MarketIcon({ className }: MarketIconProps) {
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
      <path d="M3 9 L5 4 H19 L21 9" />
      <rect x="3" y="9" width="18" height="12" />
      <path d="M3 9 Q12 13 21 9" />
      <rect x="9" y="14" width="6" height="7" />
      <path d="M12 4 V9" />
    </svg>
  );
}

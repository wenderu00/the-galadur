interface FarmIconProps {
  className?: string;
}

export function FarmIcon({ className }: FarmIconProps) {
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
      <path d="M3 20 L7 8 L12 14 L17 8 L21 20" />
      <path d="M3 20 h18" />
      <path d="M12 14 V20" />
      <path d="M9 11 Q12 8 15 11" />
    </svg>
  );
}

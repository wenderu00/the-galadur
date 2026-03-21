interface MineIconProps {
  className?: string;
}

export function MineIcon({ className }: MineIconProps) {
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

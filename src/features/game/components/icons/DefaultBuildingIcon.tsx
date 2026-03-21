interface DefaultBuildingIconProps {
  className?: string;
}

export function DefaultBuildingIcon({ className }: DefaultBuildingIconProps) {
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
      <rect x="3" y="8" width="18" height="13" />
      <path d="M3 8 L12 3 L21 8" />
      <rect x="8" y="14" width="4" height="7" />
      <rect x="14" y="12" width="5" height="4" />
      <path d="M5 8 V21" strokeOpacity="0.3" />
      <path d="M19 8 V21" strokeOpacity="0.3" />
    </svg>
  );
}

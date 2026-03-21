import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BuildingUpgradeButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
}

export function BuildingUpgradeButton({ label, disabled, onClick }: BuildingUpgradeButtonProps) {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={cn(
        'w-full h-auto py-2.5 text-sm font-semibold gap-2 rounded-none border-0 border-t disabled:opacity-100',
        disabled
          ? 'bg-realm-950 hover:bg-realm-950 text-realm-600 border-t-realm-800'
          : 'bg-sky-600 hover:bg-sky-500 border-t-sky-500 text-white',
      )}
    >
      {!disabled && (
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M5 15l7-7 7 7" />
        </svg>
      )}
      {label}
    </Button>
  );
}

interface GameDayCounterProps {
  day: number;
}

export function GameDayCounter({ day }: GameDayCounterProps) {
  return (
    <div className="flex items-center gap-1.5 bg-realm-900 border border-realm-800 px-2 py-1 md:px-4 md:py-2">
      <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 flex-shrink-0" fill="currentColor">
        <circle cx="12" cy="12" r="5" />
        <path
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center">
        <p className="text-xs text-realm-500 uppercase tracking-widest font-medieval leading-none">Dia</p>
        <p className="text-base md:text-lg font-bold text-white leading-none">{day}</p>
      </div>
    </div>
  );
}

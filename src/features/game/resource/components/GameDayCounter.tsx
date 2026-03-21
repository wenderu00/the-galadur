interface GameDayCounterProps {
  day: number;
}

export function GameDayCounter({ day }: GameDayCounterProps) {
  return (
    <div className="flex items-center gap-2 bg-realm-900 border border-realm-800 px-4 py-2">
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-yellow-400" fill="currentColor">
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
        <p className="text-[10px] text-realm-500 uppercase tracking-widest font-medieval">Dia</p>
        <p className="text-lg font-bold text-white leading-none">{day}</p>
      </div>
    </div>
  );
}

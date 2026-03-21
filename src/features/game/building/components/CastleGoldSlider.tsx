import { useCastleGoldRate } from '../hooks/useCastleGoldRate';

export function CastleGoldSlider() {
  const { rate, maxRate, setRate } = useCastleGoldRate();

  if (maxRate === 0) return null;

  const percentage = Math.round((rate / maxRate) * 100);

  return (
    <section className="space-y-2 pt-1 border-t border-realm-800">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-realm-300">Produção de Ouro</span>
        <span className="text-sm text-amber-400">
          {rate.toFixed(2)}/tick ({percentage}%)
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={maxRate}
        step={0.01}
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
        className="w-full accent-amber-400 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-realm-500">
        <span>0</span>
        <span>Máx: {maxRate.toFixed(2)}/tick</span>
      </div>
    </section>
  );
}

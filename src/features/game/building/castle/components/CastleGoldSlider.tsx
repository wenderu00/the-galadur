import { FormField } from '@/components/ui/form-field';
import { Slider } from '@/components/ui/slider';
import { formatRate } from '@/lib/format';
import { useCastleGoldRate } from '../hooks/useCastleGoldRate';

const GOLD_RATE_STEP = 0.01;

export function CastleGoldSlider() {
  const { rate, maxRate, setRate } = useCastleGoldRate();

  if (maxRate === 0) return null;

  const percentage = new Intl.NumberFormat('pt-BR', { style: 'percent' }).format(rate / maxRate);

  return (
    <FormField
      label="Produção de ouro do castelo"
      description={`${formatRate(rate)} de no máximo ${formatRate(maxRate)} (${percentage})`}
    >
      <Slider
        min={0}
        max={maxRate}
        step={GOLD_RATE_STEP}
        value={[rate]}
        onValueChange={([value]) => setRate(value ?? 0)}
        formatValue={(value) => formatRate(value)}
      />
    </FormField>
  );
}

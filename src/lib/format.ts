const numberFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

export function formatRate(perSecond: number): string {
  return `+${formatNumber(perSecond)}/s`;
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.ceil(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest} s`;
  if (rest === 0) return `${minutes} min`;
  return `${minutes} min ${rest} s`;
}

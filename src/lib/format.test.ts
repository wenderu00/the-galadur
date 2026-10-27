import { describe, expect, it } from 'vitest';
import { formatDuration, formatNumber, formatRate } from './format';

describe('formatNumber', () => {
  it('separa milhares com ponto', () => {
    expect(formatNumber(1234)).toBe('1.234');
  });

  it('usa vírgula decimal', () => {
    expect(formatNumber(2.5)).toBe('2,5');
  });
});

describe('formatRate', () => {
  it('mostra taxa positiva com sinal e vírgula decimal', () => {
    expect(formatRate(0.5)).toBe('+0,5/s');
  });

  it('mostra taxa inteira sem casas decimais', () => {
    expect(formatRate(3)).toBe('+3/s');
  });

  it('limita a duas casas decimais', () => {
    expect(formatRate(1.234)).toBe('+1,23/s');
  });
});

describe('formatDuration', () => {
  it('mostra só segundos abaixo de um minuto', () => {
    expect(formatDuration(30)).toBe('30 s');
  });

  it('mostra minutos e segundos', () => {
    expect(formatDuration(65)).toBe('1 min 5 s');
  });

  it('omite segundos zerados', () => {
    expect(formatDuration(120)).toBe('2 min');
  });

  it('arredonda frações de segundo para cima', () => {
    expect(formatDuration(29.2)).toBe('30 s');
  });
});

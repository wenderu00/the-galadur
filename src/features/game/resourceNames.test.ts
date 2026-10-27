import { describe, expect, it } from 'vitest';
import { formatResourceGain, formatResourceAmount } from './resourceNames';

describe('formatResourceGain', () => {
  it('mostra ganho com o nome do recurso em português', () => {
    expect(formatResourceGain('wood', 50)).toBe('+50 madeira');
  });

  it('formata quantidades grandes em pt-BR', () => {
    expect(formatResourceGain('gold', 1500)).toBe('+1.500 ouro');
  });
});

describe('formatResourceAmount', () => {
  it('mostra custo com o nome do recurso', () => {
    expect(formatResourceAmount('stone', 50)).toBe('50 Pedra');
  });
});

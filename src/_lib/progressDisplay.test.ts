import { describe, expect, it } from 'vitest';
import { formatWeightVariation, getBmiBadgeDisplay } from './progressDisplay';

describe('progress display logic', () => {
  it('UT-051 maps normal weight to the sage token pair', () => {
    expect(getBmiBadgeDisplay('PESO_NORMAL')).toEqual({
      label: 'Peso normal',
      foregroundToken: 'var(--sage)',
      backgroundToken: 'var(--sage-bg)',
    });
  });

  it('UT-052 maps every other band to a label and non-sage tokens', () => {
    const expectedLabels = {
      ABAIXO_DO_PESO: 'Abaixo do peso',
      SOBREPESO: 'Sobrepeso',
      OBESIDADE_GRAU_I: 'Obesidade grau I',
      OBESIDADE_GRAU_II: 'Obesidade grau II',
      OBESIDADE_GRAU_III: 'Obesidade grau III',
    } as const;

    for (const [classification, label] of Object.entries(expectedLabels)) {
      const display = getBmiBadgeDisplay(
        classification as keyof typeof expectedLabels
      );
      expect(display.label).toBe(label);
      expect(display.foregroundToken).not.toBe('var(--sage)');
      expect(display.backgroundToken).not.toBe('var(--sage-bg)');
    }
  });

  it('UT-053 formats zero without a directional arrow', () => {
    const display = formatWeightVariation(0);
    expect(display.text).toBe('0');
    expect(display.text).not.toMatch(/[↑↓]/);
    expect(display.colorToken).toBe('var(--muted-foreground)');
  });

  it('UT-054 uses the same neutral token for both directions', () => {
    const gain = formatWeightVariation(0.6);
    const loss = formatWeightVariation(-0.6);

    expect(gain.text).toContain('↑');
    expect(loss.text).toContain('↓');
    expect(gain.colorToken).toBe(loss.colorToken);
    expect(gain.colorToken).toBe('var(--muted-foreground)');
  });
});

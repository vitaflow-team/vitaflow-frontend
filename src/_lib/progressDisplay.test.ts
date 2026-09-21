import { describe, expect, it } from 'vitest';
import {
  formatBmi,
  formatWeightVariation,
  getBmiBadgeDisplay,
  getBmiStripTone,
} from './progressDisplay';

describe('BMI display formatting', () => {
  it('UT-022 formats an integer with one decimal place', () => {
    expect(formatBmi(22)).toBe('22,0');
  });

  it('UT-023 formats a decimal with a comma', () => {
    expect(formatBmi(21.4)).toBe('21,4');
  });

  it('UT-024 rounds consistently across a tenth', () => {
    expect(formatBmi(22.04)).toBe('22,0');
    expect(formatBmi(22.06)).toBe('22,1');
  });

  it('UT-025 replaces non-finite values with an em dash', () => {
    expect(formatBmi(Number.NaN)).toBe('—');
    expect(formatBmi(Number.POSITIVE_INFINITY)).toBe('—');
  });
});

describe('progress display logic', () => {
  it('UT-045 maps each BMI classification to its strip tone', () => {
    expect(getBmiStripTone('PESO_NORMAL')).toBe('sage-bg');
    expect(getBmiStripTone('ABAIXO_DO_PESO')).toBe('info-bg');
    expect(getBmiStripTone('SOBREPESO')).toBe('warn-bg');
    expect(getBmiStripTone('OBESIDADE_GRAU_I')).toBe('muted');
    expect(getBmiStripTone('OBESIDADE_GRAU_II')).toBe('muted');
    expect(getBmiStripTone('OBESIDADE_GRAU_III')).toBe('muted');
  });

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

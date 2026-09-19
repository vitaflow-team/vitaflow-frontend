import { describe, expect, it } from 'vitest';
import { calculateBmi, classifyBmi, getBmiPreview } from './bmi';

describe('frontend BMI calculation', () => {
  it('UT-012 calculates a rounded BMI and returns no preview for incomplete values', () => {
    expect(calculateBmi(70, 175)).toBe(22.9);
    expect(getBmiPreview(70, 175)).toEqual({
      bmi: 22.9,
      classification: 'PESO_NORMAL',
    });
    expect(getBmiPreview(undefined, 175)).toBeNull();
    expect(getBmiPreview(70, undefined)).toBeNull();
    expect(getBmiPreview(70, 0)).toBeNull();
    expect(getBmiPreview(Number.NaN, 175)).toBeNull();
  });

  it('UT-013 classifies 18.49 as underweight', () => {
    expect(classifyBmi(18.49)).toBe('ABAIXO_DO_PESO');
  });

  it('UT-014 classifies 18.5 as normal weight', () => {
    expect(classifyBmi(18.5)).toBe('PESO_NORMAL');
  });

  it('UT-015 classifies 24.99 as normal weight', () => {
    expect(classifyBmi(24.99)).toBe('PESO_NORMAL');
  });

  it('UT-016 classifies 25 as overweight', () => {
    expect(classifyBmi(25)).toBe('SOBREPESO');
  });

  it('UT-017 classifies 29.99 as overweight', () => {
    expect(classifyBmi(29.99)).toBe('SOBREPESO');
  });

  it('UT-018 classifies 30 as obesity grade I', () => {
    expect(classifyBmi(30)).toBe('OBESIDADE_GRAU_I');
  });

  it('UT-019 classifies 34.99 as obesity grade I', () => {
    expect(classifyBmi(34.99)).toBe('OBESIDADE_GRAU_I');
  });

  it('UT-020 classifies 35 as obesity grade II', () => {
    expect(classifyBmi(35)).toBe('OBESIDADE_GRAU_II');
  });

  it('UT-021 classifies 39.99 as obesity grade II', () => {
    expect(classifyBmi(39.99)).toBe('OBESIDADE_GRAU_II');
  });

  it('UT-022 classifies 40 as obesity grade III', () => {
    expect(classifyBmi(40)).toBe('OBESIDADE_GRAU_III');
  });
});

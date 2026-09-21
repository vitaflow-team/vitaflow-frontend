import { describe, expect, it } from 'vitest';
import {
  formatDecimal,
  normalizeDecimalInput,
  stepWeight,
} from './decimalInput';

describe('decimal input', () => {
  it('UT-030 normalizes comma, dot, whitespace and numeric values', () => {
    expect(normalizeDecimalInput('62,5')).toBe(62.5);
    expect(normalizeDecimalInput('62.5')).toBe(62.5);
    expect(normalizeDecimalInput('  62,5 ')).toBe(62.5);
    expect(normalizeDecimalInput(62.5)).toBe(62.5);
  });

  it('UT-031 maps blank and undefined values to undefined', () => {
    expect(normalizeDecimalInput('')).toBeUndefined();
    expect(normalizeDecimalInput(undefined)).toBeUndefined();
  });

  it('UT-032 rejects ambiguous and non-numeric forms', () => {
    for (const value of ['62,', '1.234,5', 'abc', '6 2']) {
      expect(normalizeDecimalInput(value)).toBeNaN();
    }
  });

  it('UT-033 formats values with a decimal comma', () => {
    expect(formatDecimal(62.5)).toBe('62,5');
    expect(formatDecimal(62)).toBe('62,0');
    expect(formatDecimal(undefined)).toBe('');
  });

  it('UT-034 steps by exact tenths in either direction', () => {
    expect(stepWeight(62.9, 1)).toBe(63);
    expect(stepWeight(stepWeight(62.9, -1), -1)).toBe(62.7);
  });

  it('UT-035 clamps steps to the supported weight range', () => {
    expect(stepWeight(300, 1)).toBe(300);
    expect(stepWeight(20, -1)).toBe(20);
  });

  it('UT-036 starts empty values from the fallback or default', () => {
    expect(stepWeight(undefined, 1, 61.4)).toBe(61.5);
    expect(stepWeight(undefined, 1)).toBe(60.1);
  });

  it('UT-037 has no drift after repeated steps', () => {
    let value = 62.9;
    for (let index = 0; index < 30; index += 1) {
      value = stepWeight(value, 1);
    }
    expect(value).toBe(65.9);

    for (let index = 0; index < 30; index += 1) {
      value = stepWeight(value, -1);
    }
    expect(value).toBe(62.9);
  });
});

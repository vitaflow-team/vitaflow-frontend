import { describe, expect, it } from 'vitest';
import {
  formatChange,
  formatMeasure,
  removalWarning,
} from './assessmentDisplay';

describe('assessment display', () => {
  it('UT-142 shows a missing value as an em dash', () => {
    expect(formatMeasure(null, 'kg')).toBe('—');
    expect(formatMeasure(undefined, '%')).toBe('—');
    expect(formatMeasure(78.2, 'kg')).toBe('78,2 kg');
    expect(formatMeasure(18.4, '%')).toBe('18,4%');
  });

  it('UT-143 signs a change and says "sem variação" for zero', () => {
    expect(formatChange(-0.8, 'kg')).toBe('−0,8 kg');
    expect(formatChange(1.2, 'kg')).toBe('+1,2 kg');
    expect(formatChange(0, 'kg')).toBe('sem variação');
  });

  it('UT-148 and UT-149 state the loss, or that there is nothing to lose', () => {
    expect(removalWarning(true)).toContain('perdidos permanentemente');
    expect(removalWarning(false)).toContain('não tem avaliações registradas');
  });
});

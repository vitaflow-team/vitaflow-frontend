import { describe, expect, it } from 'vitest';
import {
  formatPrice,
  professionalTypeLabel,
  registrationLabelFor,
} from './professionalDisplay';

describe('professionalTypeLabel', () => {
  it('translates known product types', () => {
    expect(professionalTypeLabel('NUTRITIONIST')).toBe('Nutricionista');
    expect(professionalTypeLabel('PHYSICAL_EDUCATOR')).toBe('Educador físico');
  });

  it('falls back to the raw value for an unknown type', () => {
    expect(professionalTypeLabel('ADMIN')).toBe('ADMIN');
  });
});

describe('formatPrice', () => {
  it('formats a price in BRL', () => {
    expect(formatPrice(150)).toContain('150');
    expect(formatPrice(150)).toContain('A partir de');
  });

  it('shows a fallback message for an unset price', () => {
    expect(formatPrice(null)).toBe('Preço não informado');
  });
});

describe('registrationLabelFor', () => {
  it('labels a nutritionist as CRN', () => {
    expect(registrationLabelFor('NUTRITIONIST')).toBe('CRN');
  });

  it('labels a physical educator as CREF', () => {
    expect(registrationLabelFor('PHYSICAL_EDUCATOR')).toBe('CREF');
  });

  it('returns null for any other account type', () => {
    expect(registrationLabelFor('ACADEMIA')).toBeNull();
    expect(registrationLabelFor('USER')).toBeNull();
  });
});

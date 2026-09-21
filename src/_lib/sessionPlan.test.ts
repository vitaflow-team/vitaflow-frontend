import { describe, expect, it } from 'vitest';
import { isSessionPlanStale } from './sessionPlan';
import { planAudience, planTitle } from './planAudience';

describe('immediate access update — isSessionPlanStale', () => {
  it('UT-031 detects a session whose plan differs from the profile', () => {
    expect(isSessionPlanStale({ productId: 'a' }, { productId: 'b' })).toBe(
      true
    );
    expect(isSessionPlanStale({ productId: 'a' }, { productId: 'a' })).toBe(
      false
    );
    expect(isSessionPlanStale({}, {})).toBe(false);
    expect(isSessionPlanStale({ productId: null }, { productId: null })).toBe(
      false
    );
    expect(isSessionPlanStale({}, { productId: 'b' })).toBe(true);
    expect(isSessionPlanStale({ productId: 'a' }, {})).toBe(true);
  });
});

describe('plan catalog — planAudience', () => {
  it('UT-032 states the personal Premium use only on professional plans', () => {
    for (const type of ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'] as const) {
      const copy = planAudience(type);

      expect(copy).toContain('uso pessoal do Premium');
      expect(copy).toContain('dados pessoais');
      expect(copy).toContain('conta profissional');
    }

    expect(planAudience('USER')).not.toContain('uso pessoal do Premium');
    expect(planAudience('USER')).not.toContain('conta profissional');
  });
});

describe('plan catalog — planTitle', () => {
  it('names the profession on professional plans so equal names are told apart', () => {
    expect(planTitle('Premium', 'NUTRITIONIST')).toBe(
      'Premium · Nutricionista'
    );
    expect(planTitle('Profissional', 'PHYSICAL_EDUCATOR')).toBe(
      'Profissional · Educador físico'
    );
  });

  it('leaves personal plan titles untouched', () => {
    expect(planTitle('Premium', 'USER')).toBe('Premium');
    expect(planTitle('Gratuito', 'USER')).toBe('Gratuito');
  });
});

import type { Product } from '@/_actions/products/getPlans';
import { describe, expect, it } from 'vitest';
import {
  categoryOfType,
  filterPlansByCategory,
  initialCategory,
  moveCategory,
  PLAN_CATEGORY_LABELS,
  resolveCurrentPlan,
  type PlanCategoryKey,
} from './planCategories';

function plan(overrides: Partial<Product> & Pick<Product, 'id'>): Product {
  return {
    name: 'Plano',
    price: 0,
    groupId: 'group-id',
    type: 'USER',
    stripeId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    productInfos: [],
    ...overrides,
  };
}

const FREE = plan({ id: 'free', name: 'Gratuito', price: 0 });
const PREMIUM = plan({ id: 'premium', name: 'Premium', price: 2990 });
const NUTRI_B = plan({
  id: 'nutri-b',
  name: 'Nutri B',
  price: 4990,
  type: 'NUTRITIONIST',
});
const NUTRI_A = plan({
  id: 'nutri-a',
  name: 'Nutri A',
  price: 4990,
  type: 'NUTRITIONIST',
});
const EDU = plan({
  id: 'edu',
  name: 'Educador',
  price: 3990,
  type: 'PHYSICAL_EDUCATOR',
});

const CATALOG = [PREMIUM, NUTRI_B, FREE, EDU, NUTRI_A];

describe('plan category tabs — planCategories', () => {
  it('UT-018 maps every plan type to its category key and label', () => {
    expect(categoryOfType('USER')).toBe('usuario');
    expect(categoryOfType('NUTRITIONIST')).toBe('nutricionista');
    expect(categoryOfType('PHYSICAL_EDUCATOR')).toBe('educador-fisico');

    expect(PLAN_CATEGORY_LABELS).toEqual({
      usuario: 'Usuário',
      nutricionista: 'Nutricionista',
      'educador-fisico': 'Educador físico',
    });
  });

  it('UT-019 opens on the profile category and falls back to usuario', () => {
    expect(initialCategory('NUTRITIONIST')).toBe('nutricionista');
    expect(initialCategory('PHYSICAL_EDUCATOR')).toBe('educador-fisico');
    expect(initialCategory('USER')).toBe('usuario');

    expect(initialCategory(null)).toBe('usuario');
    expect(initialCategory(undefined)).toBe('usuario');
    expect(initialCategory('COACH')).toBe('usuario');
  });

  it('UT-020 lists only the category, by price then name, without mutating', () => {
    const input = [...CATALOG];

    expect(
      filterPlansByCategory(input, 'usuario').map(item => item.id)
    ).toEqual(['free', 'premium']);
    // Preços iguais mantêm ordem alfabética estável (US-009.EC-2).
    expect(
      filterPlansByCategory(input, 'nutricionista').map(item => item.id)
    ).toEqual(['nutri-a', 'nutri-b']);
    expect(
      filterPlansByCategory(input, 'educador-fisico').map(item => item.id)
    ).toEqual(['edu']);

    expect(input).toEqual(CATALOG);
  });

  it('UT-021 moves between categories with the arrow, Home and End keys', () => {
    expect(moveCategory('educador-fisico', 'ArrowRight')).toBe('usuario');
    expect(moveCategory('usuario', 'ArrowRight')).toBe('nutricionista');
    expect(moveCategory('usuario', 'ArrowLeft')).toBe('educador-fisico');
    expect(moveCategory('nutricionista', 'ArrowLeft')).toBe('usuario');

    expect(moveCategory('nutricionista', 'Home')).toBe('usuario');
    expect(moveCategory('nutricionista', 'End')).toBe('educador-fisico');

    for (const key of ['ArrowUp', 'Enter', ' ', 'a']) {
      expect(moveCategory('nutricionista', key)).toBe('nutricionista');
    }
  });

  it('UT-022 resolves the current plan over the whole catalog', () => {
    expect(resolveCurrentPlan(CATALOG, 'nutri-a')).toEqual({
      id: 'nutri-a',
      type: 'NUTRITIONIST',
    });

    // Sem produto ou com um produto fora do catálogo, o gratuito responde.
    expect(resolveCurrentPlan(CATALOG, null)).toEqual({
      id: 'free',
      type: 'USER',
    });
    expect(resolveCurrentPlan(CATALOG, undefined)).toEqual({
      id: 'free',
      type: 'USER',
    });
    expect(resolveCurrentPlan(CATALOG, 'unknown-id')).toEqual({
      id: 'free',
      type: 'USER',
    });

    expect(resolveCurrentPlan([], 'nutri-a')).toEqual({
      id: null,
      type: 'USER',
    });
  });

  it('UT-021 keeps every key reachable from every category', () => {
    const seen = new Set<PlanCategoryKey>();
    let cursor: PlanCategoryKey = 'usuario';

    for (let step = 0; step < 3; step += 1) {
      seen.add(cursor);
      cursor = moveCategory(cursor, 'ArrowRight');
    }

    expect(seen.size).toBe(3);
    expect(cursor).toBe('usuario');
  });
});

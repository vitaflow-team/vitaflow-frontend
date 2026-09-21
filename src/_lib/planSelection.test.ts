import type {
  Product,
  ProductsPlan,
  ProductTypeName,
} from '@/_actions/products/getProdductsPlans';
import { describe, expect, it } from 'vitest';
import { groupPlans } from './planSelection';

function product(
  id: string,
  name: string,
  price: number,
  type: ProductTypeName,
  groupId: string
): Product {
  return {
    id,
    name,
    price,
    groupId,
    type,
    stripeId: price === 0 ? null : `price_${id}`,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    productInfos: [],
  };
}

function group(id: string, name: string, products: Product[]): ProductsPlan {
  return {
    id,
    name,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    products,
  };
}

const USER_FREE = product('p-free', 'Gratuito', 0, 'USER', 'g-user');
const USER_PREMIUM = product('p-premium', 'Premium', 29.9, 'USER', 'g-user');
const EDUCATOR = product(
  'p-edu',
  'Educador',
  59.9,
  'PHYSICAL_EDUCATOR',
  'g-edu'
);
const NUTRITIONIST = product(
  'p-nutri',
  'Nutricionista',
  69.9,
  'NUTRITIONIST',
  'g-nutri'
);

const GROUPS: ProductsPlan[] = [
  group('g-user', 'Usuário', [USER_PREMIUM, USER_FREE]),
  group('g-edu', 'Educadores físicos', [EDUCATOR]),
  group('g-nutri', 'Nutricionistas', [NUTRITIONIST]),
];

describe('plan catalog — groupPlans', () => {
  it('UT-015 splits the catalog into the two audience sections', () => {
    const sections = groupPlans(GROUPS, null);

    expect(sections?.personal.map(item => item.name)).toEqual(['Usuário']);
    expect(sections?.professional.map(item => item.name)).toEqual([
      'Nutricionistas',
      'Educadores físicos',
    ]);
    expect(sections?.personal[0].products.map(item => item.id)).toEqual([
      USER_FREE.id,
      USER_PREMIUM.id,
    ]);
  });

  it('UT-016 marks the current nutritionist product and its type', () => {
    const sections = groupPlans(GROUPS, NUTRITIONIST.id);

    expect(sections?.currentProductId).toBe(NUTRITIONIST.id);
    expect(sections?.currentType).toBe('NUTRITIONIST');
  });

  it('UT-017 falls back to the price-zero plan without a product', () => {
    const sections = groupPlans(GROUPS, null);

    expect(sections?.currentProductId).toBe(USER_FREE.id);
    expect(sections?.currentType).toBe('USER');

    const free = sections?.personal[0].products.find(
      item => item.id === sections.currentProductId
    );
    expect(free?.price).toBe(0);
    expect(free?.stripeId).toBeNull();
  });

  it('UT-018 treats an unknown product id as no product at all', () => {
    const sections = groupPlans(GROUPS, 'p-does-not-exist');

    expect(sections?.currentProductId).toBe(USER_FREE.id);
    expect(sections?.currentType).toBe('USER');
  });

  it('UT-019 returns null when there are no groups', () => {
    expect(groupPlans([], USER_PREMIUM.id)).toBeNull();
    expect(groupPlans([], null)).toBeNull();
  });

  it('UT-020 omits a group without products from its section', () => {
    const sections = groupPlans(
      [...GROUPS, group('g-empty', 'Vazio', [])],
      null
    );

    const names = [
      ...(sections?.personal ?? []),
      ...(sections?.professional ?? []),
    ].map(item => item.name);
    expect(names).not.toContain('Vazio');
  });

  it('UT-020 keeps only the products of the section type in a mixed group', () => {
    const sections = groupPlans(
      [group('g-mixed', 'Todos', [USER_FREE, EDUCATOR])],
      EDUCATOR.id
    );

    expect(sections?.personal[0].products).toEqual([USER_FREE]);
    expect(sections?.professional[0].products).toEqual([EDUCATOR]);
    expect(sections?.currentProductId).toBe(EDUCATOR.id);
    expect(sections?.currentType).toBe('PHYSICAL_EDUCATOR');
  });

  it('UT-015 orders products by price inside a group', () => {
    const cheap = product('p-cheap', 'Básico', 19.9, 'USER', 'g-user');
    const sections = groupPlans(
      [group('g-user', 'Usuário', [USER_PREMIUM, cheap, USER_FREE])],
      null
    );

    expect(sections?.personal[0].products.map(item => item.price)).toEqual([
      0, 19.9, 29.9,
    ]);
  });
});

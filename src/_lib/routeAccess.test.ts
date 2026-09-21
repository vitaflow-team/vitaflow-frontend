import { describe, expect, it } from 'vitest';
import { canAccess, resolveRedirect } from './routeAccess';

describe('restricted route access', () => {
  it('UT-001 denies a USER on the clients route', () => {
    expect(canAccess('/restrict/clients', 'USER')).toBe(false);
  });

  it('UT-002 denies a USER on a nested client route', () => {
    expect(canAccess('/restrict/clients/123', 'USER')).toBe(false);
  });

  it('UT-003 allows a nutritionist on a nested client route', () => {
    expect(canAccess('/restrict/clients/123', 'NUTRITIONIST')).toBe(true);
  });

  it('UT-004 does not match a route at a partial segment boundary', () => {
    expect(canAccess('/restrict/clients-archive', 'USER')).toBe(true);
  });

  it('UT-005 keeps home open without a product type', () => {
    expect(canAccess('/restrict', null)).toBe(true);
  });

  it('UT-006 keeps settings open without a product type', () => {
    expect(canAccess('/restrict/settings', undefined)).toBe(true);
  });

  it('UT-007 allows every declared product type on nested workouts', () => {
    for (const productType of ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR']) {
      expect(canAccess('/restrict/workouts/x', productType)).toBe(true);
    }
  });

  it('UT-008 allows a nutritionist on nested progress routes', () => {
    expect(canAccess('/restrict/progress/x', 'NUTRITIONIST')).toBe(true);
  });

  it('UT-009 leaves unmatched routes open without a product type', () => {
    expect(canAccess('/restrict/unknown', null)).toBe(true);
  });

  const blockedRequest = 'https://vitaflow.test/restrict/clients';

  it('UT-010 returns to an allowed same-origin restricted referer', () => {
    expect(
      resolveRedirect({
        requestUrl: blockedRequest,
        referer: 'https://vitaflow.test/restrict/progress',
        productType: 'USER',
      }).toString()
    ).toBe('https://vitaflow.test/restrict/progress?aviso=sem-permissao');
  });

  it('UT-011 rejects an external referer', () => {
    expect(
      resolveRedirect({
        requestUrl: blockedRequest,
        referer: 'https://evil.example/x',
        productType: 'USER',
      }).toString()
    ).toBe('https://vitaflow.test/restrict?aviso=sem-permissao');
  });

  it('UT-012 falls back safely when the referer is missing', () => {
    expect(
      resolveRedirect({
        requestUrl: blockedRequest,
        referer: null,
        productType: 'USER',
      }).toString()
    ).toBe('https://vitaflow.test/restrict?aviso=sem-permissao');
  });

  it('UT-013 preserves existing referer query parameters', () => {
    expect(
      resolveRedirect({
        requestUrl: blockedRequest,
        referer: 'https://vitaflow.test/restrict/progress?range=8',
        productType: 'USER',
      }).toString()
    ).toBe(
      'https://vitaflow.test/restrict/progress?range=8&aviso=sem-permissao'
    );
  });

  it('UT-014 rejects a referer that is also blocked', () => {
    expect(
      resolveRedirect({
        requestUrl: blockedRequest,
        referer: 'https://vitaflow.test/restrict/clients/5',
        productType: 'USER',
      }).toString()
    ).toBe('https://vitaflow.test/restrict?aviso=sem-permissao');
  });

  it('UT-015 handles an invalid referer without throwing', () => {
    expect(
      resolveRedirect({
        requestUrl: blockedRequest,
        referer: 'not a url',
        productType: 'USER',
      }).toString()
    ).toBe('https://vitaflow.test/restrict?aviso=sem-permissao');
  });

  it('UT-016 rejects a same-origin referer outside the restricted area', () => {
    expect(
      resolveRedirect({
        requestUrl: blockedRequest,
        referer: 'https://vitaflow.test/',
        productType: 'USER',
      }).toString()
    ).toBe('https://vitaflow.test/restrict?aviso=sem-permissao');
  });
});

describe('professional personal use — route access', () => {
  it('UT-011 opens Minha evolução to every product type', () => {
    for (const productType of ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR']) {
      expect(canAccess('/restrict/progress', productType)).toBe(true);
      expect(canAccess('/restrict/progress/x', productType)).toBe(true);
    }
  });

  it('UT-012 keeps Pessoas professional-only and a typeless account denied', () => {
    expect(canAccess('/restrict/clients', 'USER')).toBe(false);

    for (const productType of ['NUTRITIONIST', 'PHYSICAL_EDUCATOR']) {
      expect(canAccess('/restrict/clients', productType)).toBe(true);
    }

    expect(canAccess('/restrict/clients', '')).toBe(false);
    expect(canAccess('/restrict/progress', '')).toBe(false);
    expect(canAccess('/restrict/workouts', '')).toBe(false);
    expect(canAccess('/restrict', '')).toBe(true);
    expect(canAccess('/restrict/settings', '')).toBe(true);
  });
});

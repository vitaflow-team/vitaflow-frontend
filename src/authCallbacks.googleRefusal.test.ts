import type { User } from 'next-auth';
import { describe, expect, it } from 'vitest';
import { jwtCallback, signInCallback } from './authCallbacks';

const ACCOUNT = {
  id: 'user-1',
  name: 'Ana',
  email: 'ana@example.test',
  productId: 'free-1',
} as User;

describe('unified login account — UT-037 signIn callback', () => {
  it('lets a normal user sign in', () => {
    expect(signInCallback({ user: ACCOUNT })).toBe(true);
    expect(signInCallback({ user: null })).toBe(true);
    expect(signInCallback({})).toBe(true);
  });

  it('redirects a refused sign-in to the sign-in screen with its notice', () => {
    const refused = { id: 'refused', refusal: 'google_link_required' } as User;

    expect(signInCallback({ user: refused })).toBe(
      '/signin?aviso=google-conta-equipe'
    );
  });

  it('redirects a refused link to the Conta tab with its notice', () => {
    const refused = {
      id: 'refused',
      refusal: 'google_email_mismatch',
      linking: true,
    } as User;

    expect(signInCallback({ user: refused })).toBe(
      '/restrict/settings?tab=conta&aviso=google-email-diferente'
    );
  });

  it('returns a same-site path, which Auth.js follows without an open redirect', () => {
    const url = signInCallback({
      user: { id: 'refused', refusal: 'google_receptionist_email' } as User,
    });

    expect(url).toMatch(/^\/[^/]/);
  });
});

describe('unified login account — UT-038 jwt callback', () => {
  it('leaves the token without an id for a refusal marker', async () => {
    const token = await jwtCallback({
      token: { sub: 'authjs-subject' } as never,
      user: { id: 'refused', refusal: 'google_link_required' } as User,
    });

    expect(token).toEqual({ sub: 'authjs-subject' });
    expect(token).not.toHaveProperty('id');
    expect(token).not.toHaveProperty('refusal');
  });

  it('still fills the token for a normal user, without the marker fields', async () => {
    const token = await jwtCallback({
      token: { sub: 'authjs-subject' } as never,
      user: ACCOUNT,
    });

    expect(token).toMatchObject({ id: 'user-1', email: 'ana@example.test' });
    expect(token).not.toHaveProperty('refusal');
    expect(token).not.toHaveProperty('linking');
  });
});

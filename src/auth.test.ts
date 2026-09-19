import { describe, expect, it } from 'vitest';
import type { User } from 'next-auth';
import { jwtCallback, sessionCallback } from './authCallbacks';

describe('Auth.js token confidentiality', () => {
  it('UT-046 keeps accessToken out of the client-visible session', async () => {
    const session = {
      user: {
        id: 'existing-id',
        name: 'Vita User',
        email: 'user@example.com',
      },
      expires: new Date(Date.now() + 60_000).toISOString(),
    };
    const token = {
      id: 'user-id',
      name: 'Vita User',
      email: 'user@example.com',
      accessToken: 'backend-secret',
      productType: 'nutritionist',
    };

    const result = await sessionCallback({ session, token });

    expect(result.user).not.toHaveProperty('accessToken');
    expect(result.user).toMatchObject({
      id: 'user-id',
      email: 'user@example.com',
      productType: 'nutritionist',
    });
  });

  it('UT-047 does not copy user.accessToken into the Auth.js JWT', async () => {
    const token = { sub: 'authjs-subject', id: 'initial-id' };

    const result = await jwtCallback({
      token,
      user: {
        id: 'user-id',
        email: 'user@example.com',
        accessToken: 'backend-secret',
      } as User & { accessToken: string },
    });

    expect(result).not.toHaveProperty('accessToken');
    expect(result).toMatchObject({
      sub: 'authjs-subject',
      id: 'user-id',
      email: 'user@example.com',
    });
  });
});

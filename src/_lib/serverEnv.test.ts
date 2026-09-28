import { describe, expect, it } from 'vitest';
import { parseServerEnv } from './serverEnv';

const VALID_ENV = {
  BACKEND_URL: 'https://backend.example.test',
  APP_SECRET_KEY: 'application-secret',
  STRIPE_API_KEY: 'sk_test_123',
  STRIPE_WEBHOOK_SECRET: 'whsec_123',
  NEXTAUTH_URL: 'https://app.example.test',
  NEXTAUTH_SECRET: 'auth-secret',
};

function withEnv(overrides: Record<string, string | undefined>) {
  return { ...VALID_ENV, ...overrides };
}

describe('platform hardening — central server env schema', () => {
  it('UT-009 rejects a payload missing STRIPE_API_KEY, naming the field', () => {
    expect(() =>
      parseServerEnv(withEnv({ STRIPE_API_KEY: undefined }))
    ).toThrow(/STRIPE_API_KEY/);
  });

  it('UT-009 rejects a malformed BACKEND_URL, naming the field', () => {
    expect(() => parseServerEnv(withEnv({ BACKEND_URL: 'not a url' }))).toThrow(
      /BACKEND_URL/
    );
  });

  it('UT-009 rejects a Stripe key that is not a secret key', () => {
    expect(() =>
      parseServerEnv(withEnv({ STRIPE_API_KEY: 'pk_live_123' }))
    ).toThrow(/STRIPE_API_KEY/);
  });

  it('UT-009 treats a blank required variable as missing', () => {
    expect(() =>
      parseServerEnv(withEnv({ STRIPE_WEBHOOK_SECRET: '   ' }))
    ).toThrow(/STRIPE_WEBHOOK_SECRET/);
  });

  it('UT-009 never echoes a variable value in the error', () => {
    let message = '';
    try {
      parseServerEnv(withEnv({ STRIPE_API_KEY: 'pk_live_secret_value' }));
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toContain('STRIPE_API_KEY');
    expect(message).not.toContain('secret_value');
  });

  it('UT-009 lists every problem in one error', () => {
    expect(() =>
      parseServerEnv(
        withEnv({ APP_SECRET_KEY: undefined, STRIPE_API_KEY: undefined })
      )
    ).toThrow(/APP_SECRET_KEY.*STRIPE_API_KEY/);
  });

  it('UT-009 requires NEXTAUTH_URL or AUTH_URL', () => {
    expect(() => parseServerEnv(withEnv({ NEXTAUTH_URL: undefined }))).toThrow(
      /NEXTAUTH_URL or AUTH_URL/
    );
    expect(() =>
      parseServerEnv(
        withEnv({ NEXTAUTH_URL: undefined, AUTH_URL: 'https://app.test' })
      )
    ).not.toThrow();
  });

  it('UT-009 requires AUTH_SECRET or NEXTAUTH_SECRET', () => {
    expect(() =>
      parseServerEnv(withEnv({ NEXTAUTH_SECRET: undefined }))
    ).toThrow(/AUTH_SECRET or NEXTAUTH_SECRET/);
  });

  it('UT-009 requires the Google credentials as a pair', () => {
    expect(() =>
      parseServerEnv(withEnv({ GOOGLE_CLIENT_ID: 'client-id' }))
    ).toThrow(/GOOGLE_CLIENT_SECRET/);
    expect(() =>
      parseServerEnv(
        withEnv({ GOOGLE_CLIENT_ID: 'client-id', GOOGLE_CLIENT_SECRET: '' })
      )
    ).toThrow(/GOOGLE_CLIENT_SECRET/);
    expect(() =>
      parseServerEnv(
        withEnv({ GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '' })
      )
    ).not.toThrow();
  });

  it('returns only the declared variables for a valid payload', () => {
    const env = parseServerEnv(withEnv({ UNRELATED: 'value' }));

    expect(env).toEqual(VALID_ENV);
  });
});

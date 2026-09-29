import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const VALID_ENV = {
  BACKEND_URL: 'https://backend.example.test',
  APP_SECRET_KEY: 'application-secret',
  STRIPE_API_KEY: 'sk_test_123',
  STRIPE_WEBHOOK_SECRET: 'whsec_123',
  NEXTAUTH_URL: 'https://app.example.test',
  NEXTAUTH_SECRET: 'auth-secret',
};

describe('platform hardening — env module load', () => {
  beforeEach(() => {
    vi.resetModules();
    for (const [name, value] of Object.entries(VALID_ENV)) {
      vi.stubEnv(name, value);
    }
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('UT-009 exposes the validated variables', async () => {
    const { env } = await import('./env');

    expect(env.BACKEND_URL).toBe('https://backend.example.test');
    expect(env.STRIPE_API_KEY).toBe('sk_test_123');
  });

  it('UT-009 fails as soon as the module loads when a variable is missing', async () => {
    vi.stubEnv('STRIPE_API_KEY', '');

    await expect(import('./env')).rejects.toThrow(/STRIPE_API_KEY/);
  });

  it('skips the check while `next build` collects page data', async () => {
    vi.stubEnv('STRIPE_API_KEY', '');
    vi.stubEnv('NEXT_PHASE', 'phase-production-build');

    await expect(import('./env')).resolves.toBeDefined();
  });
});

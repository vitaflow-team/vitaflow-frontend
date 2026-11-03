import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const VALID_ENV = {
  BACKEND_URL: 'https://backend.example.test',
  APP_SECRET_KEY: 'application-secret',
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
    expect(env.APP_SECRET_KEY).toBe('application-secret');
  });

  it('UT-009 fails as soon as the module loads when a variable is missing', async () => {
    vi.stubEnv('APP_SECRET_KEY', '');

    await expect(import('./env')).rejects.toThrow(/APP_SECRET_KEY/);
  });

  it('skips the check while `next build` collects page data', async () => {
    vi.stubEnv('APP_SECRET_KEY', '');
    vi.stubEnv('NEXT_PHASE', 'phase-production-build');

    await expect(import('./env')).resolves.toBeDefined();
  });
});

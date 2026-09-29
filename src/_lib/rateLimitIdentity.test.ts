import { describe, expect, it } from 'vitest';
import {
  isRateLimitedPath,
  rateLimitKey,
  resolveClientIdentifier,
} from './rateLimitIdentity';

describe('auth input hardening — rate limiter client identity', () => {
  it('UT-008 keys on the platform client IP, whatever X-Forwarded-For claims', () => {
    const forgedOnce = new Headers({
      'true-client-ip': '198.51.100.7',
      'x-forwarded-for': '203.0.113.1, 172.71.195.123',
    });
    const forgedAgain = new Headers({
      'true-client-ip': '198.51.100.7',
      'x-forwarded-for': '203.0.113.99, 172.71.195.123',
    });

    expect(resolveClientIdentifier(forgedOnce, true)).toBe('198.51.100.7');
    expect(resolveClientIdentifier(forgedAgain, true)).toBe('198.51.100.7');
  });

  it('UT-008 ignores a client-sent True-Client-IP off the trusted platform', () => {
    const headers = new Headers({
      'true-client-ip': '203.0.113.50',
      'x-forwarded-for': '203.0.113.1, 10.0.0.2',
    });

    expect(resolveClientIdentifier(headers, false)).toBe('10.0.0.2');
  });

  it('UT-008 uses the nearest forwarded hop, so forged left entries change nothing', () => {
    const first = new Headers({ 'x-forwarded-for': '1.1.1.1, 10.0.0.2' });
    const second = new Headers({
      'x-forwarded-for': '9.9.9.9, 8.8.8.8, 10.0.0.2',
    });

    expect(resolveClientIdentifier(first, false)).toBe('10.0.0.2');
    expect(resolveClientIdentifier(second, false)).toBe('10.0.0.2');
  });

  it('falls back to a fixed bucket when no source is present', () => {
    expect(resolveClientIdentifier(new Headers(), true)).toBe('unknown');
    expect(
      resolveClientIdentifier(new Headers({ 'x-forwarded-for': ' , ' }), false)
    ).toBe('unknown');
  });

  it('covers sign-in, activation, sign-up and the auth API only', () => {
    for (const path of [
      '/signin',
      '/signin/activate',
      '/signup',
      '/api/auth/callback/google',
    ]) {
      expect(isRateLimitedPath(path)).toBe(true);
    }
    for (const path of ['/', '/restrict', '/restrict/clients']) {
      expect(isRateLimitedPath(path)).toBe(false);
    }
  });

  it('keys one bucket per client and route', () => {
    expect(rateLimitKey('198.51.100.7', '/signin')).toBe(
      '198.51.100.7:/signin'
    );
    expect(rateLimitKey('198.51.100.7', '/signup')).not.toBe(
      rateLimitKey('198.51.100.7', '/signin')
    );
  });
});

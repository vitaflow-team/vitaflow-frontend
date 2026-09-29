import { describe, expect, it } from 'vitest';
import { securityHeaders } from './securityHeaders';

function header(nodeEnv: string, key: string): string | undefined {
  return securityHeaders(nodeEnv).find(entry => entry.key === key)?.value;
}

describe('platform hardening — static security headers', () => {
  it('M-004 sends HSTS in production', () => {
    expect(header('production', 'Strict-Transport-Security')).toBe(
      'max-age=63072000; includeSubDomains; preload'
    );
  });

  it('M-004 never sends HSTS from a development server', () => {
    expect(header('development', 'Strict-Transport-Security')).toBeUndefined();
  });

  it('keeps the existing hardening headers in every mode', () => {
    for (const nodeEnv of ['production', 'development']) {
      expect(header(nodeEnv, 'X-Frame-Options')).toBe('DENY');
      expect(header(nodeEnv, 'X-Content-Type-Options')).toBe('nosniff');
    }
  });

  it('leaves the Content-Security-Policy to the middleware', () => {
    expect(header('production', 'Content-Security-Policy')).toBeUndefined();
  });
});

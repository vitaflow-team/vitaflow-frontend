import { describe, expect, it } from 'vitest';
import {
  buildContentSecurityPolicy,
  createNonce,
} from './contentSecurityPolicy';

function directive(policy: string, name: string): string | undefined {
  return policy.split('; ').find(entry => entry.startsWith(`${name} `));
}

describe('platform hardening — content security policy', () => {
  it('creates a distinct base64 nonce with 128 bits of entropy', () => {
    const nonce = createNonce();

    expect(nonce).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(createNonce()).not.toBe(nonce);
  });

  it('authorizes scripts only by nonce, self and Stripe when given a nonce', () => {
    const policy = buildContentSecurityPolicy('abc123');

    expect(directive(policy, 'script-src')).toBe(
      "script-src 'self' 'nonce-abc123' https://js.stripe.com"
    );
  });

  it('keeps the development script policy without a nonce', () => {
    const policy = buildContentSecurityPolicy();

    expect(directive(policy, 'script-src')).toBe(
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com"
    );
  });

  it('keeps every other directive identical in both modes', () => {
    const withoutScripts = (policy: string) =>
      policy.split('; ').filter(entry => !entry.startsWith('script-src'));

    expect(withoutScripts(buildContentSecurityPolicy('abc123'))).toEqual(
      withoutScripts(buildContentSecurityPolicy())
    );
    expect(directive(buildContentSecurityPolicy('abc123'), 'style-src')).toBe(
      "style-src 'self' 'unsafe-inline'"
    );
    expect(
      directive(buildContentSecurityPolicy('abc123'), 'frame-ancestors')
    ).toBe("frame-ancestors 'none'");
  });
});

import { APP_ROUTES } from '@/_constants/routes';

// Render serves the app behind Cloudflare, whose edge overwrites this header
// with the address it actually accepted the connection from. A client can
// send its own `True-Client-IP`, but it never survives the edge (ADR-001).
const PLATFORM_CLIENT_IP_HEADER = 'true-client-ip';
const FORWARDED_FOR_HEADER = 'x-forwarded-for';
const UNKNOWN_CLIENT = 'unknown';

// Sign-in hosts the password-reset dialog and the new-password form
// (`/signin?token=...`), so covering `/signin` covers both flows and the
// Server Actions they post back to the same path.
const RATE_LIMITED_PATHS = [
  APP_ROUTES.SIGN_IN,
  APP_ROUTES.SIGN_IN_ACTIVATE,
  APP_ROUTES.SIGN_UP,
];
const RATE_LIMITED_PREFIX = '/api/auth';

interface HeaderSource {
  get(name: string): string | null;
}

/**
 * The right-most `X-Forwarded-For` entry is the one appended by the proxy
 * closest to the app; every entry to its left came from the client and can be
 * forged at will, so only this one is used.
 */
function nearestForwardedHop(value: string | null): string | null {
  const hops = (value ?? '')
    .split(',')
    .map(hop => hop.trim())
    .filter(Boolean);
  return hops.at(-1) ?? null;
}

/**
 * Identifies the client for rate limiting from a value the hosting platform
 * sets, never from a header the client controls end to end.
 */
export function resolveClientIdentifier(
  headers: HeaderSource,
  onTrustedPlatform: boolean
): string {
  const platformIp = onTrustedPlatform
    ? headers.get(PLATFORM_CLIENT_IP_HEADER)?.trim()
    : undefined;
  if (platformIp) return platformIp;

  return (
    nearestForwardedHop(headers.get(FORWARDED_FOR_HEADER)) ?? UNKNOWN_CLIENT
  );
}

export function isRateLimitedPath(path: string): boolean {
  return (
    RATE_LIMITED_PATHS.includes(path) || path.startsWith(RATE_LIMITED_PREFIX)
  );
}

/** One bucket per client and route, so one flow can't exhaust another's. */
export function rateLimitKey(identifier: string, path: string): string {
  return `${identifier}:${path}`;
}

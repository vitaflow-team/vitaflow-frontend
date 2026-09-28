import type { ResponseHeader } from '../_types/responseHeader';

const BASE_HEADERS: ResponseHeader[] = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];

const STRICT_TRANSPORT_SECURITY: ResponseHeader = {
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload',
};

/**
 * Static headers for every response. The Content-Security-Policy is not here:
 * it carries a per-request nonce, so the middleware sets it. HSTS is
 * production-only because it would pin a plain-HTTP dev server (ADR-002).
 */
export function securityHeaders(nodeEnv: string | undefined): ResponseHeader[] {
  if (nodeEnv !== 'production') return BASE_HEADERS;
  return [...BASE_HEADERS, STRICT_TRANSPORT_SECURITY];
}

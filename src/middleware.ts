import { APP_ROUTES } from '@/_constants/routes';
import {
  isRateLimitedPath,
  rateLimitKey,
  resolveClientIdentifier,
} from '@/_lib/rateLimitIdentity';
import {
  buildContentSecurityPolicy,
  createNonce,
} from '@/_lib/contentSecurityPolicy';
import { canAccess, resolveRedirect } from '@/_lib/routeAccess';
import type { SecurityContext } from '@/_types/securityContext';
import { auth } from '@/auth';
import { NextResponse, type NextRequest } from 'next/server';

const CSP_HEADER = 'Content-Security-Policy';

const AUTH_PATHS = [
  APP_ROUTES.SIGN_IN,
  APP_ROUTES.SIGN_IN_ACTIVATE,
  APP_ROUTES.SIGN_UP,
];
const AUTH_PREFIXES = [APP_ROUTES.ROUTE_PRIVATE];
// Auth.js's own route handler (app/api/auth/[...nextauth]/route.ts) is the
// only thing that may run its core request pipeline for these paths.
// Wrapping them in the `auth()` middleware HOC as well — as this file used
// to do by including this prefix in AUTH_PREFIXES — runs that pipeline a
// second time per request: confirmed by curl against a clean dev server
// returning two different `authjs.csrf-token` Set-Cookie headers on one
// GET /api/auth/csrf response. During the Google OAuth leg this corrupts
// the PKCE cookie (the code_challenge sent to Google is derived from one
// pipeline run, the verifier actually stored in the cookie from the other),
// surfacing as `InvalidCheck: pkceCodeVerifier value could not be parsed`
// on callback — reproduced locally and root-caused this way.
const API_AUTH_PREFIX = '/api/auth';

function tooManyRequests(): NextResponse {
  return new NextResponse('Too Many Requests', { status: 429 });
}

/**
 * Without the KV variables (local dev) there is no limiter to run. With them,
 * a store failure in production blocks the request instead of silently
 * switching protection off (ADR-001); elsewhere it only warns.
 */
async function enforceRateLimit(
  headers: Headers,
  path: string
): Promise<NextResponse | undefined> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return;

  const identifier = resolveClientIdentifier(
    headers,
    process.env.RENDER === 'true'
  );

  try {
    const { ratelimit } = await import('@/_lib/ratelimit');
    const { success, reason } = await ratelimit.limit(
      rateLimitKey(identifier, path)
    );
    // On timeout Upstash answers `success: true`; that is the store being
    // unreachable, not the client being within its limit.
    if (reason === 'timeout') throw new Error('Rate limit store timed out.');
    if (!success) return tooManyRequests();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Rate Limit Error:', error);
      return;
    }
    console.error('Rate limit store unavailable; blocking request.', {
      path,
      error: error instanceof Error ? error.name : 'unknown',
    });
    return tooManyRequests();
  }
}

/**
 * Next reads the nonce from the request's CSP header and stamps it on the
 * scripts it renders, so the policy goes on the forwarded request as well as
 * on the response (ADR-002). Development keeps its permissive, nonce-less
 * policy.
 */
function securityContext(request: NextRequest): SecurityContext {
  const nonce =
    process.env.NODE_ENV === 'development' ? undefined : createNonce();
  const policy = buildContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CSP_HEADER, policy);
  if (nonce) requestHeaders.set('x-nonce', nonce);
  return { policy, requestHeaders };
}

function withPolicy(response: NextResponse, policy: string): NextResponse {
  response.headers.set(CSP_HEADER, policy);
  return response;
}

function passThrough({ policy, requestHeaders }: SecurityContext) {
  return withPolicy(
    NextResponse.next({ request: { headers: requestHeaders } }),
    policy
  );
}

// The paths Auth.js has always run on; every other page only needs the
// security headers, and skipping auth there keeps its session from rolling.
function isAuthPath(path: string): boolean {
  if (AUTH_PATHS.includes(path)) return true;
  return AUTH_PREFIXES.some(
    prefix => path === prefix || path.startsWith(`${prefix}/`)
  );
}

// Rate-limits and adds security headers to Auth.js's own routes WITHOUT
// wrapping them in the `auth()` HOC — see the comment on API_AUTH_PREFIX for
// why that wrapping is never safe here.
async function authApiMiddleware(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname;
  if (isRateLimitedPath(path)) {
    const limited = await enforceRateLimit(request.headers, path);
    if (limited) return limited;
  }
  return passThrough(securityContext(request));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authMiddleware = auth(async (req: any) => {
  const path = req.nextUrl.pathname;
  const isLogged = !!req.auth;

  if (isRateLimitedPath(path)) {
    const limited = await enforceRateLimit(req.headers, path);
    if (limited) return limited;
  }

  const security = securityContext(req);

  if (path.startsWith(APP_ROUTES.ROUTE_PRIVATE) && !isLogged) {
    return withPolicy(
      NextResponse.rewrite(new URL(APP_ROUTES.HOME, req.url), {
        request: { headers: security.requestHeaders },
      }),
      security.policy
    );
  }

  if (isLogged && !APP_ROUTES.EXCLUDED_ROUTES.includes(path)) {
    const productType = req.auth?.user?.productType;
    if (!canAccess(path, productType)) {
      return NextResponse.redirect(
        resolveRedirect({
          requestUrl: req.url,
          referer: req.headers.get('referer'),
          productType,
        }),
        307
      );
    }
  }

  return passThrough(security);
});

export default function middleware(
  request: NextRequest,
  context: Parameters<typeof authMiddleware>[1]
) {
  const path = request.nextUrl.pathname;
  if (path === API_AUTH_PREFIX || path.startsWith(`${API_AUTH_PREFIX}/`)) {
    return authApiMiddleware(request);
  }
  if (!isAuthPath(path)) {
    return passThrough(securityContext(request));
  }
  return authMiddleware(request, context);
}

export const config = {
  // Every page needs its own nonce; static files carry no scripts to guard.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

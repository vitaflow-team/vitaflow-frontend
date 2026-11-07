import 'server-only';

import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/_lib/accessTokenCookie';
import { env } from '@/_lib/env';

/**
 * Proxies one `pdf-export` backend download through to the browser
 * (ADR-012). A binary-aware sibling to `apiClient.ts` — never a
 * modification of it, since `apiClient.ts` stays JSON-only
 * (`apiClient.ts:96` unconditionally calls `response.json()`).
 *
 * Resolves the caller's own session the same way `apiClient.ts`'s
 * `ownToken: true` option does: always the caller's own
 * `vf_access_token` cookie, never an active "ver como" token — an export
 * always belongs to the person who clicked the link, not whoever they
 * might be impersonating.
 *
 * Streams the backend's response straight through with its exact status
 * code and its `Content-Type`/`Content-Disposition` headers unchanged, so
 * a 401/403/404 from the backend is relayed as-is rather than masked as a
 * generic 500 (TechSpec Testing Approach; UT-031/UT-032/UT-033).
 */
export async function proxyPdfDownload(backendPath: string): Promise<Response> {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  const requestHeaders = new Headers();
  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }
  requestHeaders.set('x-application-secret', env.APP_SECRET_KEY);

  const normalizedPath = backendPath.startsWith('/')
    ? backendPath
    : `/${backendPath}`;

  const backendResponse = await fetch(`${env.BACKEND_URL}${normalizedPath}`, {
    method: 'GET',
    headers: requestHeaders,
    cache: 'no-store',
  });

  const responseHeaders = new Headers();
  const contentType = backendResponse.headers.get('Content-Type');
  const contentDisposition = backendResponse.headers.get('Content-Disposition');
  if (contentType) {
    responseHeaders.set('Content-Type', contentType);
  }
  if (contentDisposition) {
    responseHeaders.set('Content-Disposition', contentDisposition);
  }

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

import { APP_ROUTES } from '@/_constants/routes';
import { ACCESS_DENIED_CODE, ACCESS_NOTICE_PARAM } from '@/_lib/accessNotice';

function governsPath(route: string, path: string): boolean {
  return route === path || path.startsWith(`${route}/`);
}

export function canAccess(path: string, productType?: string | null): boolean {
  if (APP_ROUTES.EXCLUDED_ROUTES.includes(path)) {
    return true;
  }

  const governingRoute = APP_ROUTES.PRIVATE.filter(
    route =>
      route.URL !== APP_ROUTES.ROUTE_PRIVATE && governsPath(route.URL, path)
  ).sort((left, right) => right.URL.length - left.URL.length)[0];

  if (!governingRoute) {
    return true;
  }

  return governingRoute.PRODUCT_TYPE.includes(productType ?? '');
}

interface ResolveRedirectInput {
  requestUrl: string;
  referer: string | null;
  productType?: string | null;
}

function isRestrictedPath(path: string): boolean {
  return (
    path === APP_ROUTES.ROUTE_PRIVATE ||
    path.startsWith(`${APP_ROUTES.ROUTE_PRIVATE}/`)
  );
}

export function resolveRedirect({
  requestUrl,
  referer,
  productType,
}: ResolveRedirectInput): URL {
  const request = new URL(requestUrl);
  let destination = new URL(APP_ROUTES.ROUTE_PRIVATE, request.origin);

  if (referer) {
    try {
      const candidate = new URL(referer);
      if (
        candidate.origin === request.origin &&
        isRestrictedPath(candidate.pathname) &&
        canAccess(candidate.pathname, productType)
      ) {
        destination = candidate;
      }
    } catch {
      // An invalid Referer is untrusted input and uses the safe fallback.
    }
  }

  destination.searchParams.set(ACCESS_NOTICE_PARAM, ACCESS_DENIED_CODE);
  return destination;
}

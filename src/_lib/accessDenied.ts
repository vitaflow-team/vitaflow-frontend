import { APP_ROUTES } from '@/_constants/routes';
import { ACCESS_DENIED_CODE, ACCESS_NOTICE_PARAM } from '@/_lib/accessNotice';
import { redirect } from 'next/navigation';

/**
 * Sends the caller to the restricted home with the same "area unavailable"
 * notice the middleware shows. `redirect` throws, so call it outside any
 * `catch`.
 */
export function redirectAccessDenied(): never {
  redirect(
    `${APP_ROUTES.ROUTE_PRIVATE}?${ACCESS_NOTICE_PARAM}=${ACCESS_DENIED_CODE}`
  );
}

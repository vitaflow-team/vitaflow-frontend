import type { ErrorEvent } from '@sentry/nextjs';

/**
 * Defense-in-depth strip of request/response data from every captured event,
 * independent of the SDK's own data-collection settings (ADR-006). Drops
 * `request.data`, `request.cookies`, and `request.headers` unconditionally —
 * not a field-name denylist — so health data or a credential can never leave
 * this app through an event body, regardless of which field it happened to
 * be in (US-006, US-006.EC-1 "fails closed").
 */
export function sentryScrub(event: ErrorEvent): ErrorEvent {
  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.headers;
  }
  return event;
}

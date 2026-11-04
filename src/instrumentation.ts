import { sentryScrub } from '@/_lib/sentryScrub';
import { parseServerEnv } from '@/_lib/serverEnv';
import * as Sentry from '@sentry/nextjs';

// The DSN is optional (local dev may run without Sentry configured): its
// absence disables capture instead of failing boot.
function initSentry(): void {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    // The installed SDK major replaced the single `sendDefaultPii: false`
    // switch ADR-006 names with this granular `dataCollection` option — same
    // guarantee (no cookies/headers/bodies collected), current API. The
    // `beforeSend` strip below is the independent second layer either way.
    dataCollection: {
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
    },
    beforeSend: sentryScrub,
  });
}

export function register(): void {
  parseServerEnv(process.env);
  initSentry();
}

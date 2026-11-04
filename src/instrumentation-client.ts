import { sentryScrub } from '@/_lib/sentryScrub';
import * as Sentry from '@sentry/nextjs';

// Browser-side counterpart to `src/instrumentation.ts`'s server/edge init.
// Next.js loads this file before any client code runs — no manual wiring
// needed beyond the file existing. The DSN is optional (local dev may run
// without Sentry configured): its absence disables capture instead of
// failing boot, same pattern as the server-side init.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Same guarantee as the server-side init in `instrumentation.ts`
    // (ADR-006): no cookies/headers/bodies collected. The `sentryScrub`
    // `beforeSend` below is the independent second layer either way.
    dataCollection: {
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
    },
    beforeSend: sentryScrub,
  });
}

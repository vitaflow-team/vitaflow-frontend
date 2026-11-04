export function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

// Without a nonce this is the development policy: React's tooling needs eval,
// and browsers ignore 'unsafe-inline' once a nonce is present (ADR-002).
function scriptSource(nonce: string | undefined): string {
  if (!nonce) {
    return "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
  }
  return `script-src 'self' 'nonce-${nonce}'`;
}

// ADR-010: subscription checkout is a plain full-page redirect to Asaas's
// hosted page (`window.location.href`), never an embedded script or iframe
// the way Stripe.js/Checkout needed — so unlike Stripe, Asaas needs no
// connect-src/frame-src entry here at all.
export function buildContentSecurityPolicy(nonce?: string): string {
  return [
    "default-src 'self'",
    scriptSource(nonce),
    // Inline styles stay allowed for now (PRD Non-Goals); adding a nonce here
    // would make browsers ignore 'unsafe-inline'.
    "style-src 'self' 'unsafe-inline'",
    // Exercise images are links the backoffice types in, from any HTTPS host.
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    // Browser-side Sentry capture (task_03) uploads its already-scrubbed
    // event envelope (ADR-006) straight to the ingest host baked into
    // `NEXT_PUBLIC_SENTRY_DSN` — without this, `connect-src 'self'` silently
    // blocks every captured browser error, in every environment, and
    // `instrumentation-client.ts`'s `Sentry.init` never actually reports.
    "connect-src 'self' https://*.sentry.io",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com",
    "frame-ancestors 'none'",
  ].join('; ');
}

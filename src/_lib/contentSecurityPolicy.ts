const STRIPE_JS = 'https://js.stripe.com';

export function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

// Without a nonce this is the development policy: React's tooling needs eval,
// and browsers ignore 'unsafe-inline' once a nonce is present (ADR-002).
function scriptSource(nonce: string | undefined): string {
  if (!nonce) {
    return `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${STRIPE_JS}`;
  }
  return `script-src 'self' 'nonce-${nonce}' ${STRIPE_JS}`;
}

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
    // Stripe's browser SDK needs its API and hosted checkout frame.
    "connect-src 'self' https://api.stripe.com",
    'frame-src https://js.stripe.com https://checkout.stripe.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com",
    "frame-ancestors 'none'",
  ].join('; ');
}

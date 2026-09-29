/** The per-request CSP and the request headers that forward it to Next. */
export interface SecurityContext {
  policy: string;
  requestHeaders: Headers;
}

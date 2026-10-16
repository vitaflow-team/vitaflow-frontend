// Plain constants only (no `server-only`, no `next/headers`): safe to import
// from Edge middleware as well as from server-only modules.
export const VIEW_AS_COOKIE_NAME = 'vf_view_as';
// Matches the backend's own 30-minute "ver como" session lifetime exactly
// (platform-admin-access ADR-004).
export const VIEW_AS_MAX_AGE_SECONDS = 30 * 60;

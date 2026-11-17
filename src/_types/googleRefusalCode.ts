/**
 * Backend codes for a Google sign-in or link that was refused for a reason
 * the person can act on. Anything else stays a generic failure.
 */
export type GoogleRefusalCode =
  | 'google_link_required'
  | 'google_receptionist_email'
  | 'google_email_mismatch'
  | 'google_identity_in_use'
  | 'google_already_linked'
  | 'invalid_intent';

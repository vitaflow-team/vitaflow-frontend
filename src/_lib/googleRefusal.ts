import { ACCESS_NOTICE_PARAM } from '@/_lib/accessNotice';
import type { GoogleRefusalCode } from '@/_types/googleRefusalCode';

/** Where the person lands, already signed in, after trying to connect Google. */
export const GOOGLE_LINK_RETURN_PATH = '/restrict/settings?tab=conta';
const SIGN_IN_PATH = '/signin';

export const GOOGLE_LINKED_NOTICE = 'google-conectado';

const REFUSAL_NOTICES: Record<GoogleRefusalCode, string> = {
  google_link_required: 'google-conta-equipe',
  google_receptionist_email: 'google-recepcionista',
  google_email_mismatch: 'google-email-diferente',
  google_identity_in_use: 'google-em-uso',
  google_already_linked: 'google-ja-vinculado',
  invalid_intent: 'google-nao-conectado',
};

export function isGoogleRefusalCode(code: unknown): code is GoogleRefusalCode {
  return typeof code === 'string' && Object.hasOwn(REFUSAL_NOTICES, code);
}

/**
 * The URL that tells the person why Google was refused: the sign-in screen
 * for a sign-in attempt, the Conta tab for someone connecting Google while
 * signed in. Only a notice code travels in it, never personal data.
 */
export function refusalRedirect(
  code: GoogleRefusalCode,
  linking: boolean
): string {
  const notice = `${ACCESS_NOTICE_PARAM}=${REFUSAL_NOTICES[code]}`;
  return linking
    ? `${GOOGLE_LINK_RETURN_PATH}&${notice}`
    : `${SIGN_IN_PATH}?${notice}`;
}

/** Destination after Google was connected, with the success notice. */
export function googleLinkedRedirect(): string {
  return `${GOOGLE_LINK_RETURN_PATH}&${ACCESS_NOTICE_PARAM}=${GOOGLE_LINKED_NOTICE}`;
}

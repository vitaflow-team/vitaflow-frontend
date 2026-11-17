import { describe, expect, it } from 'vitest';
import { getAccessNotice } from './accessNotice';
import {
  googleLinkedRedirect,
  isGoogleRefusalCode,
  refusalRedirect,
} from './googleRefusal';

const REFUSAL_CODES = [
  'google_link_required',
  'google_receptionist_email',
  'google_email_mismatch',
  'google_identity_in_use',
  'google_already_linked',
  'invalid_intent',
] as const;

function noticeOf(url: string): string | null {
  return new URL(url, 'https://app.vitaflow.test').searchParams.get('aviso');
}

describe('unified login account — UT-032 Google refusal mapping', () => {
  it.each(REFUSAL_CODES)('accepts the known code %s', code => {
    expect(isGoogleRefusalCode(code)).toBe(true);
  });

  it.each([undefined, null, '', 'invalid_token', 'constructor', 42, {}])(
    'rejects %o',
    value => {
      expect(isGoogleRefusalCode(value)).toBe(false);
    }
  );

  it('sends a refused sign-in to the sign-in screen with its notice', () => {
    expect(refusalRedirect('google_link_required', false)).toBe(
      '/signin?aviso=google-conta-equipe'
    );
    expect(refusalRedirect('google_receptionist_email', false)).toBe(
      '/signin?aviso=google-recepcionista'
    );
  });

  it('sends a refused link back to the Conta tab with its notice', () => {
    expect(refusalRedirect('google_email_mismatch', true)).toBe(
      '/restrict/settings?tab=conta&aviso=google-email-diferente'
    );
    expect(refusalRedirect('google_identity_in_use', true)).toBe(
      '/restrict/settings?tab=conta&aviso=google-em-uso'
    );
  });

  it.each(REFUSAL_CODES)(
    'maps %s to a notice the screen can actually show, in both directions',
    code => {
      for (const linking of [true, false]) {
        const url = refusalRedirect(code, linking);

        expect(url.startsWith('/')).toBe(true);
        expect(getAccessNotice(noticeOf(url))).not.toBeNull();
      }
    }
  );

  it('returns to the Conta tab with the success notice after a link', () => {
    const url = googleLinkedRedirect();

    expect(url).toBe('/restrict/settings?tab=conta&aviso=google-conectado');
    expect(getAccessNotice(noticeOf(url))?.type).toBe('success');
  });
});

describe('unified login account — UT-033 Google notices', () => {
  it.each([
    ['google-conta-equipe', /e-mail e senha.*Configurações → Conta/],
    ['google-recepcionista', /recepção.*e-mail e senha/],
    ['google-email-diferente', /e-mail diferente/],
    ['google-ja-vinculado', /já está conectada/],
    ['google-em-uso', /outra conta/],
    ['google-nao-conectado', /Tente de novo/],
    ['google-conectado', /também pode entrar com o Google/],
  ])('has copy for %s', (code, expected) => {
    const notice = getAccessNotice(code);

    expect(notice?.title).toBeTruthy();
    expect(notice?.message).toMatch(expected);
    expect(notice?.message).not.toContain(code);
  });

  it('marks only the connected notice as a success', () => {
    expect(getAccessNotice('google-conectado')?.type).toBe('success');
    expect(getAccessNotice('google-conta-equipe')?.type).toBe('warning');
    expect(getAccessNotice('google-em-uso')?.type).toBe('error');
  });

  it('returns null for an unknown Google-looking code', () => {
    expect(getAccessNotice('google-qualquer-coisa')).toBeNull();
    expect(getAccessNotice('google_link_required')).toBeNull();
  });
});

import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { serverActionState } = vi.hoisted(() => ({
  serverActionState: {
    isPending: false,
    isSuccess: false,
    error: null as { message: string } | null,
  },
}));

vi.mock('zsa-react', () => ({
  useServerAction: () => ({ ...serverActionState, execute: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_actions/backoffice/acceptStaffInvitation', () => ({
  acceptStaffInvitation: {},
}));

import { AcceptBackofficeStaff } from './acceptBackofficeStaff';
import {
  AcceptInvitationInvalid,
  AcceptInvitationSuccess,
} from './acceptBackofficeStaffViews';

function renderForm(googleLinked = false, tier: 'EQUIPE' | 'ADMIN' = 'ADMIN') {
  return renderToStaticMarkup(
    <AcceptBackofficeStaff
      token="raw-token"
      tier={tier}
      googleLinked={googleLinked}
    />
  );
}

describe('unified login account — UT-042 staff invitation acceptance views', () => {
  beforeEach(() => {
    serverActionState.isPending = false;
    serverActionState.isSuccess = false;
    serverActionState.error = null;
  });

  it('shows the tier being offered, a password field and the way to password recovery', () => {
    const html = renderForm();

    expect(html).toContain('Admin interno');
    expect(html).toContain('type="password"');
    expect(html).toContain('autoComplete="current-password"');
    expect(html).toContain('Aceitar convite');
    expect(html).toContain('href="/signin"');
    expect(html).toContain('Esqueci minha senha');
  });

  it('names the Equipe tier for an Equipe invitation', () => {
    expect(renderForm(false, 'EQUIPE')).toContain('<strong>Equipe</strong>');
  });

  it('tells a Google-linked account that Google sign-in will carry staff access', () => {
    expect(renderForm(true)).toContain(
      'o login com Google também dará acesso à área da equipe'
    );
    expect(renderForm(false)).not.toContain('login com Google também');
  });

  it('never puts the invitation token in the markup', () => {
    expect(renderForm()).not.toContain('raw-token');
  });

  it('keeps the form and shows the message after a refused password', () => {
    serverActionState.error = { message: 'Senha incorreta.' };

    const html = renderForm();

    expect(html).toContain('role="alert"');
    expect(html).toContain('Senha incorreta.');
    expect(html).toContain('type="password"');
  });

  it('replaces the form with the success view once accepted', () => {
    serverActionState.isSuccess = true;

    const html = renderForm();

    expect(html).toContain('Tudo pronto!');
    expect(html).not.toContain('type="password"');
  });

  it('shows the invalid-link view without any form', () => {
    const html = renderToStaticMarkup(<AcceptInvitationInvalid />);

    expect(html).toContain('Convite indisponível');
    expect(html).toContain('Peça um novo convite');
    expect(html).not.toContain('<form');
  });

  it('sends an accepted person to sign in again', () => {
    expect(renderToStaticMarkup(<AcceptInvitationSuccess />)).toContain(
      'Ir para o login'
    );
  });
});

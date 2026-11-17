import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { googleEnabledMock, linkState } = vi.hoisted(() => ({
  googleEnabledMock: vi.fn(),
  linkState: {
    isPending: false,
    errorMessage: null as string | null,
  },
}));

vi.mock('@/_lib/googleSignIn', () => ({
  isGoogleSignInEnabled: googleEnabledMock,
}));
vi.mock('@/_hooks/useStartGoogleLink', () => ({
  useStartGoogleLink: () => ({ ...linkState, start: vi.fn() }),
}));

import { ConnectGooglePasswordForm } from './connectGoogleDialog';
import { GoogleConnectionCard } from './googleConnectionCard';

function render(googleLinked: boolean, isBackoffice: boolean) {
  return renderToStaticMarkup(
    <GoogleConnectionCard
      googleLinked={googleLinked}
      isBackoffice={isBackoffice}
    />
  );
}

describe('unified login account — UT-041 Google connection card', () => {
  beforeEach(() => {
    googleEnabledMock.mockReturnValue(true);
    linkState.isPending = false;
    linkState.errorMessage = null;
  });

  it.each([true, false])(
    'shows "Google conectado" and no way to connect when linked (staff: %s)',
    isBackoffice => {
      const html = render(true, isBackoffice);

      expect(html).toContain('Google conectado.');
      expect(html).not.toContain('<button');
      expect(html).not.toContain('Conectar Google');
    }
  );

  it('offers an ordinary account "Conectar Google" without asking for a password', () => {
    const html = render(false, false);

    expect(html).toContain('Conectar Google');
    expect(html).not.toContain('type="password"');
    expect(html).not.toContain('aria-haspopup="dialog"');
  });

  it('offers a staff account "Conectar Google" behind a dialog', () => {
    const html = render(false, true);

    expect(html).toContain('Conectar Google');
    expect(html).toContain('aria-haspopup="dialog"');
  });

  it('asks a staff account for its current password in that dialog', () => {
    const html = renderToStaticMarkup(<ConnectGooglePasswordForm />);

    expect(html).toContain('Sua senha atual');
    expect(html).toContain('type="password"');
    expect(html).toContain('autoComplete="current-password"');
    expect(html).toMatch(/<button[^>]*type="submit"[^>]*disabled=""/);
  });

  it('shows a refused password in place, keeping the form', () => {
    linkState.errorMessage = 'Senha incorreta. Confira e tente novamente.';

    const html = renderToStaticMarkup(<ConnectGooglePasswordForm />);

    expect(html).toContain('role="alert"');
    expect(html).toContain('Senha incorreta.');
    expect(html).toContain('type="password"');
  });

  it.each([
    [true, false],
    [false, false],
    [false, true],
  ])(
    'renders nothing when Google is not configured (linked: %s, staff: %s)',
    (googleLinked, isBackoffice) => {
      googleEnabledMock.mockReturnValue(false);

      expect(render(googleLinked, isBackoffice)).toBe('');
    }
  );
});

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The interactive children are client components with their own session and
// router needs; the view is checked for what it composes around them.
vi.mock('./loginByAccount', () => ({ LoginByAccount: () => <i>account</i> }));
vi.mock('./loginByGoogle', () => ({ LoginByGoogle: () => <i>google</i> }));
vi.mock('./newPassword', () => ({ NewPassword: () => <i>new-password</i> }));
vi.mock('./resetPassword', () => ({ default: () => <i>reset</i> }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_components/layout/accessNotice', () => ({
  AccessNotice: () => <i>notice</i>,
}));
const { googleEnabledMock } = vi.hoisted(() => ({
  googleEnabledMock: vi.fn(),
}));
vi.mock('@/_lib/googleSignIn', () => ({
  isGoogleSignInEnabled: googleEnabledMock,
}));

import { NewPasswordWrapper } from './newPasswordWrapper';
import { SigninLinks } from './signinLinks';
import { SigninView } from './signinView';

function source(file: string): string {
  return readFileSync(fileURLToPath(new URL(file, import.meta.url)), 'utf8');
}

describe('refactor — sign-in server components', () => {
  beforeEach(() => {
    googleEnabledMock.mockReturnValue(true);
  });

  // UT-008
  it('keeps no client directive in the view or the wrapper', () => {
    expect(source('./signinView.tsx')).not.toContain("'use client'");
    expect(source('./newPasswordWrapper.tsx')).not.toContain("'use client'");
  });

  // UT-008
  it('renders the sign-in view around its interactive parts', () => {
    const markup = renderToStaticMarkup(<SigninView />);

    expect(markup).toContain('id="main-content"');
    expect(markup).toContain(
      'Continue acompanhando treinos, nutrição e sono — tudo em um só lugar.'
    );
    expect(markup).toContain('Acesse sua conta');
    expect(markup).toContain('Ou acesse com');
    for (const part of ['account', 'google', 'reset', 'new-password']) {
      expect(markup).toContain(`<i>${part}</i>`);
    }
    expect(markup).toContain('Não tem conta?');
  });

  // UT-008
  it('renders the new-password dialog inside its suspense boundary', () => {
    expect(renderToStaticMarkup(<NewPasswordWrapper />)).toBe(
      '<i>new-password</i>'
    );
  });

  // UT-008
  it('keeps the links that need client code in their own leaf', () => {
    const markup = renderToStaticMarkup(<SigninLinks />);

    expect(source('./signinLinks.tsx')).toMatch(/^'use client';/);
    expect(markup).toContain('Não tem conta?');
    expect(markup).toContain('<i>reset</i>');
    expect(markup).toContain('Voltar para a página inicial');
    expect(markup).toContain('lucide-arrow-left');
  });
});

describe('unified login account — sign-in view notices and Google option', () => {
  beforeEach(() => {
    googleEnabledMock.mockReturnValue(true);
  });

  // UT-046: a refused Google sign-in lands here with `?aviso=`.
  it('mounts the notice component, so the refusal explains itself on this screen', () => {
    expect(renderToStaticMarkup(<SigninView />)).toContain('<i>notice</i>');
  });

  it('offers Google only where it is configured', () => {
    expect(renderToStaticMarkup(<SigninView />)).toContain('<i>google</i>');

    googleEnabledMock.mockReturnValue(false);
    const markup = renderToStaticMarkup(<SigninView />);

    expect(markup).not.toContain('<i>google</i>');
    expect(markup).not.toContain('Ou acesse com');
    expect(markup).toContain('<i>account</i>');
  });
});

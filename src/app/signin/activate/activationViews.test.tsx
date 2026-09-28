import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

import {
  ActivationConfirm,
  ActivationFailure,
  ActivationSuccess,
} from './activationViews';

describe('platform hardening — activation views', () => {
  it('asks for an explicit confirmation before activating', () => {
    const html = renderToStaticMarkup(
      <ActivationConfirm isPending={false} onConfirm={vi.fn()} />
    );

    expect(html).toContain('Ative sua conta');
    expect(html).toContain('Ativar minha conta');
    expect(html).not.toContain('disabled=""');
  });

  it('disables the confirmation while the activation is running', () => {
    const html = renderToStaticMarkup(
      <ActivationConfirm isPending onConfirm={vi.fn()} />
    );

    expect(html).toContain('Ativando...');
    expect(html).toContain('disabled=""');
  });

  it('keeps the success message and the way to sign in', () => {
    const html = renderToStaticMarkup(<ActivationSuccess />);

    expect(html).toContain('Bem-vindo!');
    expect(html).toContain('Ir para o login');
  });

  it('keeps the failure message', () => {
    const html = renderToStaticMarkup(<ActivationFailure />);

    expect(html).toContain('Ops!');
    expect(html).toContain('Erro ao ativar sua conta.');
  });
});

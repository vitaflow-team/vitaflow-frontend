import { signUpSchema } from '@/_schema/signup';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/users/postSignup', () => ({ actionSignUp: vi.fn() }));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

import { SignupForm } from './signupForm';

const VALID = {
  name: 'Ana Souza',
  email: 'Ana@Example.test',
  password: 'Senha123',
  checkPassword: 'Senha123',
  termsAccepted: true,
  healthDataConsent: true,
};

/** First capture group of every match, in document order. */
function captures(markup: string, pattern: RegExp): string[] {
  const found: string[] = [];
  for (const match of markup.matchAll(pattern)) found.push(match[1]);
  return found;
}

function issuesOf(values: Record<string, unknown>) {
  const result = signUpSchema.safeParse(values);
  return result.success
    ? {}
    : Object.fromEntries(
        result.error.issues.map(issue => [issue.path.join('.'), issue.message])
      );
}

describe('refactor — composed SignupForm', () => {
  // UT-006 / UT-003
  it('renders the hero, every field, both consents and the actions', () => {
    const markup = renderToStaticMarkup(<SignupForm />);

    expect(markup).toContain('id="main-content"');
    expect(markup).toContain(
      'Comece hoje a acompanhar sua evolução com o apoio de quem entende.'
    );
    expect(markup).toContain('Crie sua conta gratuita');
    for (const label of ['Nome:', 'E-mail:', 'Senha:', 'Confirme sua senha:']) {
      expect(markup).toContain(label);
    }
    expect(markup).toContain('Termos de Uso');
    expect(markup).toContain('Autorizo o tratamento dos meus dados de saúde');
    expect(markup.match(/role="checkbox"/g)).toHaveLength(2);
    expect(markup).toContain('Criar conta');
    expect(markup).toContain('Voltar para o login');
  });

  // UT-003: the composed pieces bind exactly the fields the schema validates.
  it('binds each text input to a schema field', () => {
    const markup = renderToStaticMarkup(<SignupForm />);
    const names = captures(markup, /<input[^>]* name="([^"]+)"/g);

    expect(names).toEqual(['name', 'email', 'password', 'checkPassword']);
    expect(Object.keys(signUpSchema.shape)).toEqual(
      expect.arrayContaining([...names, 'termsAccepted', 'healthDataConsent'])
    );
  });
});

describe('refactor — signup validation', () => {
  // UT-003: validation rules are unchanged.
  it('accepts a complete signup and rejects each broken rule', () => {
    expect(issuesOf(VALID)).toEqual({});
    expect(issuesOf({ ...VALID, name: 'A' })).toEqual({
      name: 'Informe seu nome',
    });
    expect(issuesOf({ ...VALID, email: 'ana' })).toEqual({
      email: 'Informe um e-mail válido',
    });
    expect(issuesOf({ ...VALID, checkPassword: 'Senha124' })).toEqual({
      checkPassword: 'As senhas devem ser iguais',
    });
    expect(
      issuesOf({ ...VALID, termsAccepted: false, healthDataConsent: false })
    ).toEqual({
      termsAccepted:
        'É preciso aceitar os Termos de Uso e a Política de Privacidade.',
      healthDataConsent:
        'É preciso autorizar o tratamento dos seus dados de saúde.',
    });
  });
});

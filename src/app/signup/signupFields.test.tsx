import { Form } from '@/_components/ui/form';
import type { signUpFormData } from '@/_schema/signup';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import {
  SignupCredentialField,
  SignupCredentialsFields,
} from './signupCredentialsFields';
import {
  PolicyLink,
  SignupConsentField,
  SignupHealthConsentField,
  SignupTermsField,
} from './signupTermsField';

function Harness({
  values,
  children,
}: {
  values?: Partial<signUpFormData>;
  children: ReactNode;
}) {
  const methods = useForm<signUpFormData>({
    defaultValues: {
      name: 'Ana',
      email: 'ana@example.test',
      password: 'Senha123',
      checkPassword: '',
      termsAccepted: false,
      healthDataConsent: false,
      ...values,
    },
  });
  return (
    <Form {...methods}>
      <form>{children}</form>
    </Form>
  );
}

/** First capture group of every match, in document order. */
function captures(markup: string, pattern: RegExp): string[] {
  const found: string[] = [];
  for (const match of markup.matchAll(pattern)) found.push(match[1]);
  return found;
}

function render(node: ReactNode, values?: Partial<signUpFormData>) {
  return renderToStaticMarkup(<Harness values={values}>{node}</Harness>);
}

describe('refactor — signup credential fields', () => {
  // UT-003
  it('renders each input variant bound to its field', () => {
    const text = render(
      <SignupCredentialField
        name="name"
        label="Nome:"
        disabled={false}
        variant="text"
      />
    );
    const email = render(
      <SignupCredentialField
        name="email"
        label="E-mail:"
        disabled={false}
        variant="email"
      />
    );
    const password = render(
      <SignupCredentialField
        name="password"
        label="Senha:"
        disabled
        variant="password"
      />
    );

    expect(text).toContain('value="Ana"');
    expect(text).not.toContain('<svg');
    expect(email).toContain('value="ana@example.test"');
    expect(email).toContain('lucide-mail');
    expect(password).toContain('type="password"');
    expect(password).toContain('aria-label="Mostrar senha"');
    expect(password).toContain('opacity-60');
  });
});

describe('refactor — signup credentials group', () => {
  // UT-003 / UT-005
  it('lists the four credentials in order, empty values included', () => {
    const markup = render(<SignupCredentialsFields disabled={false} />, {
      name: '',
      email: '',
      password: '',
    });
    const labels = captures(
      markup,
      /<label[^>]*data-slot="form-label"[^>]*>([^<]+)</g
    );

    expect(labels).toEqual([
      'Nome:',
      'E-mail:',
      'Senha:',
      'Confirme sua senha:',
    ]);
    expect(markup.match(/value=""/g)).toHaveLength(4);
  });
});

describe('refactor — signup consent fields', () => {
  // UT-003
  it('opens the legal documents in a new tab', () => {
    const markup = renderToStaticMarkup(
      <PolicyLink href="/terms">Termos de Uso</PolicyLink>
    );

    expect(markup).toContain('href="/terms"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
  });

  // UT-003 / UT-005
  it('renders an unchecked consent box with its label', () => {
    const markup = render(
      <SignupConsentField name="termsAccepted" disabled>
        Aceito
      </SignupConsentField>
    );

    expect(markup).toContain('role="checkbox"');
    expect(markup).toContain('aria-checked="false"');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('Aceito');
  });
});

describe('refactor — signup consent texts', () => {
  // UT-003
  it('reflects an accepted consent', () => {
    const markup = render(<SignupTermsField disabled={false} />, {
      termsAccepted: true,
    });

    expect(markup).toContain('aria-checked="true"');
    expect(markup).toContain('Li e aceito os <a');
    expect(markup).toContain('Termos de Uso</a> e a <a');
    expect(markup).toContain('Política de Privacidade</a>.');
  });

  // UT-003
  it('asks for the health data consent with the privacy link', () => {
    const markup = render(<SignupHealthConsentField disabled={false} />);

    expect(markup).toContain(
      'Autorizo o tratamento dos meus dados de saúde (peso, altura, medidas, treinos e alimentação) que eu vier a registrar na plataforma, conforme a <a'
    );
    expect(markup).toContain('href="/privacy"');
  });
});

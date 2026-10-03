import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AddStudentConfirmStep } from './addStudentConfirmStep';
import { AddStudentEmailStep } from './addStudentEmailStep';
import { AddStudentRegisterStep } from './addStudentRegisterStep';

const noop = vi.fn();

function confirm(
  props: Partial<Parameters<typeof AddStudentConfirmStep>[0]> = {}
) {
  return renderToStaticMarkup(
    <AddStudentConfirmStep
      email="diego@exemplo.com"
      accountName="Diego Martins"
      isPending={false}
      error={null}
      onLink={noop}
      onCancel={noop}
      onRegisterWithout={noop}
      {...props}
    />
  );
}

function register(
  props: Partial<Parameters<typeof AddStudentRegisterStep>[0]> = {}
) {
  return renderToStaticMarkup(
    <AddStudentRegisterStep
      email="novo@exemplo.com"
      isPending={false}
      error={null}
      onSubmit={noop}
      onEditEmail={noop}
      {...props}
    />
  );
}

describe('add student panel steps', () => {
  it('UT-114 shows the account holder, "Já tem uma conta Vita Flow" and "Vincular aluno"', () => {
    const html = confirm();

    expect(html).toContain('Já tem uma conta Vita Flow');
    expect(html).toContain('Diego Martins');
    expect(html).toContain('Vincular aluno');
    expect(html).toContain('Cadastrar sem conta de usuário');
  });

  it('UT-115 offers "Cadastrar sem conta de usuário" with name and e-mail required', () => {
    const html = register();

    expect(html).toContain('Cadastrar sem conta de usuário');
    expect(html).toContain('novo@exemplo.com');
    expect(html).toMatch(/<input[^>]*aria-required="true"[^>]*>/);
    expect(html).toContain('name="name"');
  });

  it('UT-117 disables the link and register actions while a request is pending', () => {
    expect(confirm({ isPending: true })).toMatch(
      /<button[^>]*disabled=""[^>]*>Vinculando…/
    );
    expect(register({ isPending: true })).toMatch(
      /<button[^>]*disabled=""[^>]*type="submit"|type="submit"[^>]*disabled=""/
    );
  });

  it('UT-118 shows the failure and keeps the form in place', () => {
    const html = register({ error: 'Falhou ao cadastrar.' });

    expect(html).toContain('role="alert"');
    expect(html).toContain('Falhou ao cadastrar.');
    expect(html).toContain('name="name"');
  });

  it('UT-121 and UT-122 show the message the panel was given, in an alert', () => {
    expect(
      confirm({ error: 'Muitas tentativas. Aguarde alguns instantes.' })
    ).toContain('Aguarde alguns instantes');
    expect(
      register({ error: 'Você já cadastrou um aluno com este e-mail.' })
    ).toContain('já cadastrou um aluno');
  });

  it('UT-120 the e-mail step asks for a valid e-mail and starts empty', () => {
    const html = renderToStaticMarkup(
      <AddStudentEmailStep
        defaultEmail=""
        isPending={false}
        error={null}
        onSubmit={noop}
      />
    );

    expect(html).toContain('E-mail do aluno');
    expect(html).toContain('type="email"');
    expect(html).toContain('Continuar');
  });

  it('UT-117 disables the e-mail step while the lookup runs', () => {
    const html = renderToStaticMarkup(
      <AddStudentEmailStep
        defaultEmail="a@b.com"
        isPending
        error={null}
        onSubmit={noop}
      />
    );

    expect(html).toContain('Verificando…');
    expect(html).toMatch(/<button[^>]*disabled=""/);
  });
});

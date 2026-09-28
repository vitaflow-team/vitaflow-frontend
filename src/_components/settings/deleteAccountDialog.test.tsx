import { DeleteAccountDialog } from '@/_components/settings/deleteAccountDialog';
import type { ComponentProps, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// The action signs out and talks to Stripe on import; the dialog is checked
// by the markup it produces, not by what the confirm button runs.
vi.mock('@/_actions/users/deleteAccount', () => ({
  deleteAccount: vi.fn(),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));

// The Radix alert dialog starts closed and portals its content, so none of it
// reaches static markup. This double keeps the structure inline and forwards
// `disabled`, which is what the confirm step decides.
vi.mock('@/_components/ui/alert-dialog', () => {
  const Pass = ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  );
  const Action = ({
    children,
    disabled,
  }: {
    children?: ReactNode;
    disabled?: boolean;
  }) => (
    <button type="button" disabled={disabled}>
      {children}
    </button>
  );
  return {
    AlertDialog: Pass,
    AlertDialogTrigger: Pass,
    AlertDialogContent: Pass,
    AlertDialogHeader: Pass,
    AlertDialogFooter: Pass,
    AlertDialogTitle: Pass,
    AlertDialogDescription: Pass,
    AlertDialogCancel: Action,
    AlertDialogAction: Action,
  };
});

function render(
  props: Partial<ComponentProps<typeof DeleteAccountDialog>> = {}
): string {
  return renderToStaticMarkup(
    <DeleteAccountDialog
      email="ana@example.com"
      clientsCount={0}
      isProfessional={false}
      hasPaidSubscription={false}
      {...props}
    />
  );
}

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('test coverage — delete account dialog', () => {
  // UT-011
  it('asks for the e-mail and keeps the final button disabled until it is typed', () => {
    const html = render();

    expect(text(html)).toContain('Excluir conta…');
    expect(text(html)).toContain('Excluir sua conta?');
    expect(text(html)).toContain('Esta ação não pode ser desfeita.');
    expect(text(html)).toContain(
      'Para confirmar, digite seu e-mail: ana@example.com'
    );
    expect(html).toContain('type="email"');
    expect(html).toContain(
      '<button type="button" disabled="">Excluir definitivamente</button>'
    );
    // Cancel stays available while nothing is running.
    expect(html).toContain('<button type="button">Cancelar</button>');
  });
});

describe('test coverage — delete account dialog warnings', () => {
  // UT-011
  it('says nothing about clients or billing for a free personal account', () => {
    const body = text(render());

    expect(body).not.toContain('aluno');
    expect(body).not.toContain('sem reembolso');
  });

  // UT-011
  it.each([
    [null, 'Seus alunos/pacientes cadastrados também serão apagados.'],
    [1, '1 aluno/paciente será apagado.'],
    [3, '3 alunos/pacientes serão apagados.'],
  ])(
    'warns a professional with %j clients which ones go too',
    (clientsCount, line) => {
      const body = text(render({ isProfessional: true, clientsCount }));

      expect(body).toContain(line);
    }
  );

  // UT-011
  it('stays quiet about clients for a professional without any', () => {
    const body = text(render({ isProfessional: true, clientsCount: 0 }));

    expect(body).not.toContain('aluno');
  });

  // UT-011
  it('warns that the paid period is lost when a subscription is running', () => {
    const body = text(render({ hasPaidSubscription: true }));

    expect(body).toContain('Sua assinatura será cancelada na hora');
    expect(body).toContain('sem reembolso');
  });
});

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SelectedStudentCheckin } from './selectedStudentCheckin';

const STUDENT = { id: 's1', name: 'Diego Martins' };

function render(overrides: {
  confirmation?: {
    createdAt: string;
    notice: 'SEE_ADMINISTRATION' | null;
  } | null;
  isPending?: boolean;
  error?: string | null;
}) {
  return renderToStaticMarkup(
    <SelectedStudentCheckin
      student={STUDENT}
      confirmation={overrides.confirmation ?? null}
      isPending={overrides.isPending ?? false}
      error={overrides.error ?? null}
      onConfirm={() => {}}
      onBack={() => {}}
      onReset={() => {}}
    />
  );
}

describe('SelectedStudentCheckin — gym-checkin US-002, US-003', () => {
  it('asks to confirm the check-in of the chosen student, with a way back', () => {
    const html = render({});

    expect(html).toContain('Confirmar check-in');
    expect(html).toContain('Diego Martins');
    expect(html).toContain('Voltar');
  });

  it('says it is registering while the request runs', () => {
    expect(render({ isPending: true })).toContain('Registrando...');
  });

  it('shows the confirmation instead of the buttons once registered', () => {
    const html = render({
      confirmation: { createdAt: '2026-11-17T14:30:00.000Z', notice: null },
    });

    expect(html).toContain('Check-in registrado');
    expect(html).not.toContain('Voltar');
  });

  it('shows a failed check-in as an alert', () => {
    expect(render({ error: 'Falhou' })).toContain('role="alert"');
  });
});

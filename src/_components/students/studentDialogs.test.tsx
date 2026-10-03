import type { Student } from '@/_types/students';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/students/deleteStudent', () => ({
  deleteStudent: vi.fn(),
}));
vi.mock('@/_actions/students/updateStudent', () => ({
  updateStudent: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));
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

import { EditStudentForm } from './editStudentForm';
import { RemoveStudentDialog } from './removeStudentDialog';

const STUDENT: Student = {
  id: 's1',
  name: 'Diego Martins',
  email: 'diego@exemplo.com',
  phone: '(11) 98888-7777',
  birthDate: '1995-03-10',
  hasAccount: false,
  userId: null,
  createdAt: '2026-09-15T15:00:00.000Z',
  overview: { latest: null, variation: null, currentWorkout: null },
};

function remove(hasAssessments: boolean) {
  return renderToStaticMarkup(
    <RemoveStudentDialog
      studentId="s1"
      studentName="Diego Martins"
      hasAssessments={hasAssessments}
    />
  );
}

describe('remove student dialog', () => {
  it('UT-148 names the student and says the assessment history will be permanently lost', () => {
    const html = remove(true);

    expect(html).toContain('Remover Diego Martins?');
    expect(html).toContain(
      'O histórico de avaliações físicas e os treinos serão perdidos permanentemente.'
    );
  });

  it('UT-149 says there is no history to lose for a student without assessments', () => {
    const html = remove(false);

    expect(html).toContain('não tem avaliações registradas');
    expect(html).not.toContain('O histórico de avaliações físicas');
  });

  it('UT-150 offers a cancel that is not the destructive button', () => {
    const html = remove(true);

    expect(html).toContain('Cancelar');
    expect(html.match(/Remover aluno/g)).toHaveLength(1);
  });

  it('UT-113 shows a student name with markup as text', () => {
    const html = renderToStaticMarkup(
      <RemoveStudentDialog
        studentId="s1"
        studentName="<b>x</b>"
        hasAssessments
      />
    );

    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(html).not.toContain('<b>x</b>');
  });
});

describe('edit student form', () => {
  it('UT-152 shows name, phone and birth date with the saved values', () => {
    const html = renderToStaticMarkup(
      <EditStudentForm student={STUDENT} onDone={vi.fn()} />
    );

    expect(html).toContain('value="Diego Martins"');
    expect(html).toContain('value="(11) 98888-7777"');
    expect(html).toContain('value="1995-03-10"');
    expect(html).toContain('Salvar');
  });

  it('UT-153 leaves the e-mail editable without an account and read-only with one', () => {
    const unlinked = renderToStaticMarkup(
      <EditStudentForm student={STUDENT} onDone={vi.fn()} />
    );
    const linked = renderToStaticMarkup(
      <EditStudentForm
        student={{ ...STUDENT, hasAccount: true, userId: 'u1' }}
        onDone={vi.fn()}
      />
    );

    expect(unlinked).not.toMatch(/readOnly=""/);
    expect(linked).toMatch(/readOnly=""/);
    expect(linked).toContain('aria-readonly="true"');
  });

  it('UT-154 marks the name as required', () => {
    const html = renderToStaticMarkup(
      <EditStudentForm student={STUDENT} onDone={vi.fn()} />
    );

    expect(html).toContain('aria-required="true"');
  });
});

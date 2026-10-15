import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { AcademiaEmployment } from '@/_types/academia';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    isError: false,
    execute: vi.fn(),
  }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_actions/academia/registerAcademiaStudent', () => ({
  registerAcademiaStudent: {},
}));
vi.mock('@/_components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}));

import { RegisterStudentPanel } from './registerStudentPanel';

const EMPLOYMENTS: AcademiaEmployment[] = [
  {
    id: 'e1',
    educatorId: 'educator-1',
    status: 'ACTIVE',
    startedAt: '2026-01-01T00:00:00.000Z',
    endedAt: null,
    educator: { id: 'educator-1', name: 'Ana Souza', email: 'ana@exemplo.com' },
  },
];

describe('RegisterStudentPanel — gym-students US-004, US-008', () => {
  it('shows the trigger, the name/e-mail fields, and the educator picker scoped to employed educators', () => {
    const html = renderToStaticMarkup(
      <RegisterStudentPanel employments={EMPLOYMENTS} />
    );

    expect(html).toContain('Novo aluno');
    expect(html).toContain('Cadastrar aluno da academia');
    expect(html).toContain('Nome');
    expect(html).toContain('E-mail');
    expect(html).toContain('Atribuir a');
    expect(html).toContain('Sem educador');
    expect(html).toContain('Ana Souza');
  });

  it('defaults the educator picker to unassigned when no employments are given', () => {
    const html = renderToStaticMarkup(
      <RegisterStudentPanel employments={[]} />
    );

    expect(html).toContain('Sem educador');
  });
});

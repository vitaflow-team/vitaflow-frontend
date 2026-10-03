import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { pendingMock } = vi.hoisted(() => ({ pendingMock: { value: false } }));

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: pendingMock.value,
    execute: vi.fn(),
  }),
}));
vi.mock('@/_actions/students/workouts/createWorkout', () => ({
  createWorkout: {},
}));
vi.mock('@/_actions/students/workouts/duplicateWorkout', () => ({
  duplicateWorkout: {},
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
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

import { DuplicateWorkoutDialog } from './duplicateWorkoutDialog';
import { NewWorkoutForm } from './newWorkoutForm';
import { StudentChecklist } from './studentChecklist';

const STUDENTS = [
  { id: 's1', name: 'Ana', email: 'ana@example.com' },
  { id: 's2', name: 'Bruno', email: 'bruno@example.com' },
] as never[];

describe('new workout form', () => {
  beforeEach(() => {
    pendingMock.value = false;
  });

  it('UT-090 asks for a title', () => {
    const html = renderToStaticMarkup(<NewWorkoutForm studentId="s1" />);

    expect(html).toContain('Título do treino');
    expect(html).toContain('required');
    expect(html).toContain('Criar treino');
  });

  it('UT-094 disables the creation button while the request runs', () => {
    pendingMock.value = true;

    const html = renderToStaticMarkup(<NewWorkoutForm studentId="s1" />);

    expect(html).toContain('disabled=""');
    expect(html).toContain('Criando…');
  });
});

describe('duplicate dialog', () => {
  beforeEach(() => {
    pendingMock.value = false;
  });

  function dialog() {
    return renderToStaticMarkup(
      <DuplicateWorkoutDialog
        studentId="s1"
        workoutId="w1"
        students={STUDENTS}
      />
    );
  }

  it('UT-116 lists the students, marks the current one and disables the action with none marked', () => {
    const html = dialog();

    expect(html).toContain('Ana (este aluno)');
    expect(html).toContain('Bruno');
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html).toContain('0 selecionado(s).');
    expect(html).toContain('no máximo 20 alunos por vez');
    expect(html).toMatch(/disabled=""[^>]*>Criar cópias/);
  });

  it('UT-117 disables the action and says it is copying while pending', () => {
    pendingMock.value = true;

    const html = dialog();

    expect(html).toMatch(/disabled=""[^>]*>Copiando…/);
  });

  it('says nobody is notified and that drafts are created', () => {
    const html = dialog();

    expect(html).toContain('como rascunho');
    expect(html).toContain('Nenhum aluno é avisado');
  });
});

describe('student checklist', () => {
  it('UT-116 disables unmarked students at the limit of twenty and keeps marked ones usable', () => {
    const students = Array.from({ length: 25 }, (_, index) => ({
      id: `s${index}`,
      name: `Aluno ${index}`,
      email: `a${index}@example.com`,
    })) as never[];
    const selected = Array.from({ length: 20 }, (_, index) => `s${index}`);

    const html = renderToStaticMarkup(
      <StudentChecklist
        students={students}
        currentStudentId="s0"
        selected={selected}
        onChange={() => {}}
      />
    );

    const boxes = html.match(/<input[^>]*type="checkbox"[^>]*>/g) ?? [];
    const disabled = boxes.filter(box => box.includes('disabled=""'));
    expect(boxes).toHaveLength(25);
    expect(disabled).toHaveLength(5);
    expect(disabled.every(box => !box.includes('checked'))).toBe(true);
    expect(html).toContain('20 selecionado(s).');
  });
});

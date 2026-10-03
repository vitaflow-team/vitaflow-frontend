import type { Assessment } from '@/_types/students';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/students/createAssessment', () => ({
  createAssessment: vi.fn(),
}));
vi.mock('@/_actions/students/updateAssessment', () => ({
  updateAssessment: vi.fn(),
}));
vi.mock('@/_actions/students/deleteAssessment', () => ({
  deleteAssessment: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

// The Radix dialogs start closed and portal their content, so none of it
// reaches static markup. These doubles keep the structure inline.
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
// The row hands its form dialog a trigger and the assessment being edited.
vi.mock('./assessmentFormDialog', () => ({
  AssessmentFormDialog: ({
    trigger,
    existing,
  }: {
    trigger: ReactNode;
    existing?: Assessment;
  }) => <div data-editing={existing?.id}>{trigger}</div>,
}));

import { AssessmentForm } from './assessmentForm';
import { AssessmentHistory } from './assessmentHistory';
import { AssessmentPagination } from './assessmentPagination';
import { DeclarationDialog } from './declarationDialog';
import { DeleteAssessmentButton } from './deleteAssessmentButton';
import { VariationLine } from './variationLine';

function assessment(
  id: string,
  overrides: Partial<Assessment> = {}
): Assessment {
  return {
    id,
    studentId: 's1',
    assessedOn: '2026-09-15',
    weightKg: 78.2,
    heightCm: 179,
    bodyFatPercent: 18.4,
    restingHeartRate: null,
    flexibilityCm: null,
    armCm: null,
    chestCm: null,
    waistCm: null,
    abdomenCm: null,
    hipCm: null,
    thighCm: null,
    calfCm: null,
    createdAt: '2026-09-15T15:00:00.000Z',
    ...overrides,
  };
}

function form(props: Partial<Parameters<typeof AssessmentForm>[0]> = {}) {
  return renderToStaticMarkup(
    <AssessmentForm
      studentId="s1"
      previous={assessment('a0', { heightCm: 181 })}
      declarationAccepted
      onSaved={vi.fn()}
      onDirtyChange={vi.fn()}
      {...props}
    />
  );
}

describe('assessment form', () => {
  it('UT-132 opens with today and the previous assessment height', () => {
    const html = form();
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
    }).format(new Date());

    expect(html).toContain(`value="${today}"`);
    expect(html).toContain('value="181"');
  });

  it('UT-133 marks date, weight and height as required and the rest as optional', () => {
    const html = form();

    expect(html.match(/aria-required="true"/g)).toHaveLength(3);
    expect(html).toContain('Composição e condicionamento (opcional)');
    expect(html).toContain('Circunferências (opcional)');
  });

  it('UT-139 declares numeric keyboards for the numeric fields', () => {
    const html = form();

    expect(html).toContain('inputMode="decimal"');
    expect(html).toContain('inputMode="numeric"');
    expect(html).not.toMatch(/name="weightKg"[^>]*type="number"/);
  });

  it('UT-136 shows the saving state on the only submit button', () => {
    const html = form();

    expect(html.match(/type="submit"/g)).toHaveLength(1);
    expect(html).toContain('Salvar avaliação');
  });

  it('UT-144 opens an edit with the saved values', () => {
    const html = form({
      existing: assessment('a1', { weightKg: 77.5 }),
      previous: null,
    });

    expect(html).toContain('value="77,5"');
    expect(html).toContain('value="2026-09-15"');
  });
});

describe('declaration dialog', () => {
  it('UT-140 states the responsibility and offers to accept or cancel', () => {
    const html = renderToStaticMarkup(
      <DeclarationDialog open onAccept={vi.fn()} onDecline={vi.fn()} />
    );

    expect(html).toContain('Declaração de responsabilidade');
    expect(html).toContain('dados de saúde');
    expect(html).toContain('Li e aceito');
    expect(html).toContain('Cancelar');
  });
});

describe('assessment history', () => {
  it('UT-142 lists the assessments with date, weight and body fat, "—" when missing', () => {
    const html = renderToStaticMarkup(
      <AssessmentHistory
        assessments={[
          assessment('a2'),
          assessment('a1', {
            assessedOn: '2026-08-18',
            weightKg: 79,
            bodyFatPercent: null,
          }),
        ]}
        latest={assessment('a2')}
        declarationAccepted
      />
    );

    expect(html.indexOf('15/09/2026')).toBeLessThan(html.indexOf('18/08/2026'));
    expect(html).toContain('78,2 kg');
    expect(html).toContain('Gordura corporal: 18,4%');
    expect(html).toContain('Gordura corporal: —');
  });

  it('UT-144 gives each row an edit and a delete control named by its date', () => {
    const html = renderToStaticMarkup(
      <AssessmentHistory
        assessments={[assessment('a1')]}
        latest={assessment('a1')}
        declarationAccepted
      />
    );

    expect(html).toContain('data-editing="a1"');
    expect(html).toContain('aria-label="Editar avaliação de 15/09/2026"');
    expect(html).toContain('aria-label="Excluir avaliação de 15/09/2026"');
  });

  it('UT-145 says there are no assessments yet', () => {
    const html = renderToStaticMarkup(
      <AssessmentHistory assessments={[]} latest={null} declarationAccepted />
    );

    expect(html).toContain('Nenhuma avaliação registrada ainda');
  });

  it('UT-147 lists two assessments of the same date', () => {
    const html = renderToStaticMarkup(
      <AssessmentHistory
        assessments={[
          assessment('a2', { weightKg: 77 }),
          assessment('a1', { weightKg: 78 }),
        ]}
        latest={assessment('a2')}
        declarationAccepted
      />
    );

    expect(html.match(/15\/09\/2026/g)?.length).toBeGreaterThanOrEqual(2);
    expect(html).toContain('77 kg');
    expect(html).toContain('78 kg');
  });
});

describe('assessment variation and pagination', () => {
  it('UT-143 shows the changes, and "sem variação" for a zero change', () => {
    const changed = renderToStaticMarkup(
      <VariationLine variation={{ weightKg: -2.1, bodyFatPoints: -1.5 }} />
    );
    const flat = renderToStaticMarkup(
      <VariationLine variation={{ weightKg: 0, bodyFatPoints: null }} />
    );

    expect(changed).toContain('Peso: −2,1 kg');
    expect(changed).toContain('Gordura corporal: −1,5 pp');
    expect(flat).toContain('Peso: sem variação');
    expect(renderToStaticMarkup(<VariationLine variation={null} />)).toBe('');
  });

  it('UT-146 shows how to reach older assessments when there are more than 20', () => {
    const html = renderToStaticMarkup(
      <AssessmentPagination studentId="s1" page={1} total={45} pageSize={20} />
    );

    expect(html).toContain('Avaliações mais antigas');
    expect(html).toContain('href="/restrict/students/s1/assessment?page=2"');
    expect(html).toContain('Página 1 de 3');
    expect(html).not.toContain('Avaliações mais recentes');
  });

  it('shows no pagination for 20 or fewer', () => {
    expect(
      renderToStaticMarkup(
        <AssessmentPagination
          studentId="s1"
          page={1}
          total={20}
          pageSize={20}
        />
      )
    ).toBe('');
  });
});

describe('delete assessment', () => {
  it('UT-144 asks for confirmation naming the date before anything is sent', () => {
    const html = renderToStaticMarkup(
      <DeleteAssessmentButton
        studentId="s1"
        assessmentId="a1"
        assessedOn="2026-09-15"
      />
    );

    expect(html).toContain('Excluir a avaliação de 15/09/2026?');
    expect(html).toContain('Cancelar');
  });
});

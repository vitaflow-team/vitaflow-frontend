import type { Student } from '@/_types/students';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./editStudentDialog', () => ({
  EditStudentDialog: () => <button type="button">Editar</button>,
}));
vi.mock('./removeStudentDialog', () => ({
  RemoveStudentDialog: ({ hasAssessments }: { hasAssessments: boolean }) => (
    <button type="button" data-has-assessments={String(hasAssessments)}>
      Remover
    </button>
  ),
}));

import { StudentHeader } from './studentHeader';
import { StudentNotFound } from './studentNotFound';
import { StudentOverviewCard } from './studentOverviewCard';
import { StudentTabList } from './studentTabList';

const STUDENT: Student = {
  id: 's1',
  name: 'Diego Martins',
  email: 'diego@exemplo.com',
  phone: '(11) 98888-7777',
  birthDate: '1995-03-10',
  hasAccount: true,
  userId: 'user-9',
  createdAt: '2026-09-15T15:00:00.000Z',
  overview: { latest: null, variation: null, currentWorkout: null },
};

const LATEST = {
  id: 'a1',
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
};

describe('student record header', () => {
  it('UT-124 shows the age, "Aluno desde", the e-mail and the account chip', () => {
    const html = renderToStaticMarkup(<StudentHeader student={STUDENT} />);

    expect(html).toMatch(/\d+ anos/);
    expect(html).toContain('Aluno desde setembro de 2026');
    expect(html).toContain('diego@exemplo.com');
    expect(html).toContain('Com conta');
  });

  it('UT-124 leaves the age out when there is no birth date', () => {
    const html = renderToStaticMarkup(
      <StudentHeader student={{ ...STUDENT, birthDate: null }} />
    );

    expect(html).not.toMatch(/\d+ anos/);
    expect(html).toContain('Aluno desde setembro de 2026');
  });

  it('UT-125 shows "Mensagem" only for a student with an account', () => {
    const linked = renderToStaticMarkup(<StudentHeader student={STUDENT} />);
    const unlinked = renderToStaticMarkup(
      <StudentHeader
        student={{ ...STUDENT, hasAccount: false, userId: null }}
      />
    );

    expect(linked).toContain('Mensagem');
    expect(linked).toContain('href="/restrict/messages/user-9"');
    expect(unlinked).not.toContain('Mensagem');
    expect(unlinked).toContain('Sem conta');
  });

  it('UT-127 draws Vita Flow › Alunos › the student name', () => {
    const html = renderToStaticMarkup(<StudentHeader student={STUDENT} />);

    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toMatch(
      /Vita Flow<\/a>[\s\S]*Alunos<\/a>[\s\S]*aria-current="page"[^>]*>Diego Martins/
    );
    expect(html).toContain('href="/restrict/students"');
  });

  it('tells the remove dialog whether there is history to lose', () => {
    const none = renderToStaticMarkup(<StudentHeader student={STUDENT} />);
    const some = renderToStaticMarkup(
      <StudentHeader
        student={{
          ...STUDENT,
          overview: { latest: LATEST, variation: null, currentWorkout: null },
        }}
      />
    );

    expect(none).toContain('data-has-assessments="false"');
    expect(some).toContain('data-has-assessments="true"');
  });

  it('UT-113 renders a student name with markup as text', () => {
    const html = renderToStaticMarkup(
      <StudentHeader
        student={{ ...STUDENT, name: '<img src=x onerror=alert(1)>' }}
      />
    );

    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });
});

describe('student record tabs', () => {
  it('UT-088 lists exactly Visão geral, Avaliação física and Treinos', () => {
    const html = renderToStaticMarkup(
      <StudentTabList studentId="s1" selected="overview" />
    );

    expect(html.match(/role="tab"/g)).toHaveLength(3);
    expect(html).toContain('Visão geral');
    expect(html).toContain('Avaliação física');
    expect(html).toContain('Treinos');
    expect(html).not.toMatch(/Horários|Vídeos|Cobrança|Academia/);
  });

  it('UT-168 marks the assessment tab as the selected one', () => {
    const html = renderToStaticMarkup(
      <StudentTabList studentId="s1" selected="assessment" />
    );

    expect(html).toMatch(
      /href="\/restrict\/students\/s1\/assessment"[^>]*aria-selected="true"|aria-selected="true"[^>]*href="\/restrict\/students\/s1\/assessment"/
    );
    expect(html.match(/aria-selected="true"/g)).toHaveLength(1);
  });
});

describe('student overview', () => {
  it('UT-128 shows the latest date, body fat, weight, height and the change since the first', () => {
    const html = renderToStaticMarkup(
      <StudentOverviewCard
        studentId="s1"
        overview={{
          latest: LATEST,
          variation: { weightKg: -2.1, bodyFatPoints: -1.5 },
          currentWorkout: null,
        }}
      />
    );

    expect(html).toContain('15/09/2026');
    expect(html).toContain('18,4%');
    expect(html).toContain('78,2 kg');
    expect(html).toContain('179 cm');
    expect(html).toContain('Peso: −2,1 kg');
    expect(html).toContain('Gordura corporal: −1,5 pp');
  });

  it('UT-129 says there is no assessment and offers "Nova avaliação", with no placeholder numbers', () => {
    const html = renderToStaticMarkup(
      <StudentOverviewCard
        studentId="s1"
        overview={{ latest: null, variation: null, currentWorkout: null }}
      />
    );

    expect(html).toContain('Nenhuma avaliação registrada ainda.');
    expect(html).toContain('Nova avaliação');
    expect(html).toContain('href="/restrict/students/s1/assessment?nova=1"');
    expect(html).not.toMatch(/\d+,\d kg/);
  });

  it('UT-130 leaves the change out with a single assessment', () => {
    const html = renderToStaticMarkup(
      <StudentOverviewCard
        studentId="s1"
        overview={{ latest: LATEST, variation: null, currentWorkout: null }}
      />
    );

    expect(html).not.toContain('Desde a primeira avaliação');
    expect(html).not.toContain('sem variação');
  });

  it('UT-131 states that body fat was not recorded', () => {
    const html = renderToStaticMarkup(
      <StudentOverviewCard
        studentId="s1"
        overview={{
          latest: { ...LATEST, bodyFatPercent: null },
          variation: null,
          currentWorkout: null,
        }}
      />
    );

    expect(html).toContain('Gordura corporal não registrada nesta avaliação.');
  });
});

describe('student not found', () => {
  it('UT-167 shows "Aluno não encontrado" with a link back to the list', () => {
    const html = renderToStaticMarkup(<StudentNotFound reason="not-found" />);

    expect(html).toContain('Aluno não encontrado');
    expect(html).toContain('href="/restrict/students"');
    expect(html).toContain('Voltar para Alunos');
  });

  it('UT-167 reads a refused load the same as a missing student', () => {
    const forbidden = renderToStaticMarkup(
      <StudentNotFound reason="forbidden" />
    );

    expect(forbidden).toContain('Aluno não encontrado');
  });

  it('says it could not load when the backend failed', () => {
    const html = renderToStaticMarkup(<StudentNotFound reason="failed" />);

    expect(html).toContain('Não foi possível carregar o aluno');
  });
});

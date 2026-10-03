import type { StudentListItem } from '@/_types/students';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./addStudentPanel', () => ({
  AddStudentPanel: ({ triggerLabel }: { triggerLabel?: string }) => (
    <button type="button">{triggerLabel}</button>
  ),
}));

import { StudentsEmptyState } from './studentsEmptyState';
import { StudentsList } from './studentsList';
import { StudentsNoResults } from './studentsNoResults';
import { StudentsPagination } from './studentsPagination';

const STUDENTS: StudentListItem[] = [
  {
    id: 's1',
    name: 'Diego Martins',
    email: 'diego@exemplo.com',
    hasAccount: true,
    lastAssessedOn: '2026-09-15',
  },
  {
    id: 's2',
    name: 'Ana Souza',
    email: 'ana@exemplo.com',
    hasAccount: false,
    lastAssessedOn: null,
  },
];

describe('students list', () => {
  it('UT-109 shows name, e-mail, the account chip and the last assessment or "Sem avaliação"', () => {
    const html = renderToStaticMarkup(<StudentsList students={STUDENTS} />);

    expect(html).toContain('Diego Martins');
    expect(html).toContain('diego@exemplo.com');
    expect(html).toContain('Com conta');
    expect(html).toContain('Última avaliação: 15/09/2026');
    expect(html).toContain('Ana Souza');
    expect(html).toContain('Sem conta');
    expect(html).toContain('Sem avaliação');
    expect(html).toContain('href="/restrict/students/s1"');
  });

  it('UT-110 shows the first-use explanation and an "Adicionar aluno" action', () => {
    const html = renderToStaticMarkup(<StudentsEmptyState />);

    expect(html).toContain('Você ainda não tem alunos');
    expect(html).toContain('Adicionar aluno');
  });

  it('UT-111 says nothing was found and offers to clear the search', () => {
    const html = renderToStaticMarkup(<StudentsNoResults search="zzz" />);

    expect(html).toContain('Nenhum aluno encontrado');
    expect(html).toContain('“zzz”');
    expect(html).toContain('Limpar busca');
    expect(html).toContain('href="/restrict/students"');
  });

  it('UT-113 renders a name with markup as visible text and creates no element', () => {
    const hostile: StudentListItem = {
      ...STUDENTS[0],
      name: '<img src=x onerror=alert(1)>',
    };
    const html = renderToStaticMarkup(<StudentsList students={[hostile]} />);

    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).not.toContain('<img');
  });

  it('UT-113 renders a hostile search term as visible text too', () => {
    const html = renderToStaticMarkup(
      <StudentsNoResults search="<script>alert(1)</script>" />
    );

    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('pages with real links that keep the search', () => {
    const html = renderToStaticMarkup(
      <StudentsPagination search="ana" page={2} total={120} pageSize={50} />
    );

    expect(html).toContain('Página 2 de 3');
    expect(html).toContain('href="/restrict/students?q=ana"');
    expect(html).toContain('href="/restrict/students?q=ana&amp;page=3"');
  });

  it('shows no pagination for a single page', () => {
    expect(
      renderToStaticMarkup(
        <StudentsPagination page={1} total={10} pageSize={50} />
      )
    ).toBe('');
  });
});

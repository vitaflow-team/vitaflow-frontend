import type { StudentList } from '@/_types/students';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./addStudentPanel', () => ({
  AddStudentPanel: () => <button type="button">Adicionar aluno</button>,
}));
vi.mock('./studentSearch', () => ({
  StudentSearch: () => <input type="search" />,
}));

import { StudentsView } from './studentsView';

const LIST: StudentList = {
  items: [
    {
      id: 's1',
      name: 'Diego Martins',
      email: 'diego@exemplo.com',
      hasAccount: true,
      lastAssessedOn: null,
      nextSession: null,
      financialSituation: null,
    },
  ],
  total: 1,
  page: 1,
  pageSize: 20,
};

describe('students view — pending filter visibility', () => {
  it('UT-128 shows the "Pendentes" filter only when the professional is Premium', () => {
    const notPremium = renderToStaticMarkup(<StudentsView list={LIST} />);
    expect(notPremium).not.toContain('Pendentes');

    const premium = renderToStaticMarkup(
      <StudentsView list={LIST} isPremium />
    );
    expect(premium).toContain('Pendentes');
  });
});

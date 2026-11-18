import type { EligibleStudent } from '@/_types/eligibleStudent';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EligibleStudentsList } from './eligibleStudentsList';

const STUDENTS: EligibleStudent[] = [
  {
    clientId: 'c1',
    name: 'Ana Souza',
    planName: 'Mensal',
    amountCents: 14990,
    hasTaxId: true,
  },
  {
    clientId: 'c2',
    name: 'Bruno Lima',
    planName: 'Trimestral',
    amountCents: 39990,
    hasTaxId: false,
  },
];

function render(selected: string[], students = STUDENTS) {
  return renderToStaticMarkup(
    <EligibleStudentsList
      students={students}
      selected={selected}
      disabled={false}
      onToggle={() => {}}
      onSelectAll={() => {}}
      onClear={() => {}}
    />
  );
}

describe('EligibleStudentsList — financial-health US-015', () => {
  it('UT-143 marks the student without a tax ID with a warning in words, and only that student', () => {
    const html = render(['c1']);

    const warning = 'Sem CPF ou CNPJ cadastrado';
    expect(html.split(warning)).toHaveLength(2);
    expect(html.indexOf(warning)).toBeGreaterThan(html.indexOf('Bruno Lima'));
    expect(html.indexOf(warning)).toBeLessThan(
      html.indexOf('Trimestral') + 200
    );
  });

  it('lists each student with the plan and the monthly price', () => {
    const html = render([]);

    expect(html).toContain('Ana Souza');
    expect(html).toContain('Mensal');
    expect(html).toMatch(/R\$\s149,90 por mês/);
    expect(html).toMatch(/R\$\s399,90 por mês/);
  });

  it('checks the selected students and counts them for the screen reader', () => {
    const html = render(['c1']);

    expect(html.match(/checked=""/g)).toHaveLength(1);
    expect(html).toContain('1 de 2 selecionados');
    expect(html).toContain('aria-live="polite"');
  });

  it('says there is nothing to activate when no student qualifies (US-015.EC-1)', () => {
    const html = render([], []);

    expect(html).toContain('Nenhum aluno para ativar');
    expect(html).not.toContain('Selecionar todos');
  });
});

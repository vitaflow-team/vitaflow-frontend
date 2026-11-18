import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EligibleStudentRow } from './eligibleStudentRow';

const STUDENT = {
  clientId: 'c1',
  name: 'Ana Souza',
  planName: 'Mensal',
  amountCents: 14990,
  hasTaxId: true,
};

function render(overrides: {
  hasTaxId?: boolean;
  checked?: boolean;
  disabled?: boolean;
}) {
  return renderToStaticMarkup(
    <ul>
      <EligibleStudentRow
        student={{ ...STUDENT, hasTaxId: overrides.hasTaxId ?? true }}
        checked={overrides.checked ?? false}
        disabled={overrides.disabled ?? false}
        onToggle={() => {}}
      />
    </ul>
  );
}

describe('EligibleStudentRow — financial-health US-015', () => {
  it('names the student with the plan and the monthly price, behind a labelled checkbox', () => {
    const html = render({});

    expect(html).toContain('Ana Souza');
    expect(html).toContain('Mensal');
    expect(html).toMatch(/R\$\s149,90 por mês/);
    expect(html).toContain('<label for="eligible-c1"');
    expect(html).toContain('id="eligible-c1"');
  });

  it('UT-143 warns, in words, about a missing tax ID, and only then', () => {
    expect(render({ hasTaxId: true })).not.toContain('Sem CPF ou CNPJ');
    expect(render({ hasTaxId: false })).toContain(
      'Sem CPF ou CNPJ cadastrado: este aluno será ignorado na ativação.'
    );
  });

  it('reflects the selection and the busy state', () => {
    expect(render({ checked: true })).toMatch(/\schecked=""/);
    expect(render({ checked: false })).not.toMatch(/\schecked=""/);
    expect(render({ disabled: true })).toMatch(/\sdisabled=""/);
  });
});

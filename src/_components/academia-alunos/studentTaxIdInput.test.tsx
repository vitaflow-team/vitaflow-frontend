import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StudentTaxIdInput } from './studentTaxIdInput';

describe('StudentTaxIdInput — financial-health US-012.EC-1', () => {
  const html = renderToStaticMarkup(
    <StudentTaxIdInput value="529.982.247-25" onChange={() => {}} />
  );

  it('asks for the tax ID, required, with a numeric keyboard', () => {
    expect(html).toContain('CPF ou CNPJ do aluno');
    expect(html).toContain('inputMode="numeric"');
    expect(html).toContain('aria-required="true"');
    expect(html).toContain('value="529.982.247-25"');
  });

  it('explains why in words', () => {
    expect(html).toContain('O aluno ainda não tem CPF ou CNPJ salvo');
    expect(html).toContain('sem ele a mensalidade não pode ser emitida');
  });
});

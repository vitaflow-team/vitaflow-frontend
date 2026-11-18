import { describe, expect, it } from 'vitest';
import {
  panelCopy,
  personBillingHref,
  professionalProfileOf,
} from './financialPanelCopy';

describe('financial panel copy and links', () => {
  it('words each audience for its own people', () => {
    expect(panelCopy('PHYSICAL_EDUCATOR').people).toBe('alunos');
    expect(panelCopy('NUTRITIONIST').people).toBe('pacientes');
    expect(panelCopy('ACADEMIA').people).toBe('alunos');
    expect(panelCopy('ACADEMIA').overdueColumn).toBe('Mensalidades em atraso');
    expect(panelCopy('ACADEMIA').title).toBe('Financeiro da academia');
  });

  it('picks the nutritionist wording only for nutritionists', () => {
    expect(professionalProfileOf('NUTRITIONIST')).toBe('NUTRITIONIST');
    expect(professionalProfileOf('PHYSICAL_EDUCATOR')).toBe(
      'PHYSICAL_EDUCATOR'
    );
    expect(professionalProfileOf(null)).toBe('PHYSICAL_EDUCATOR');
    expect(professionalProfileOf(undefined)).toBe('PHYSICAL_EDUCATOR');
  });

  it("leads each row to the person's existing billing area", () => {
    expect(personBillingHref('PHYSICAL_EDUCATOR', 'c1')).toBe(
      '/restrict/students/c1/billing'
    );
    expect(personBillingHref('NUTRITIONIST', 'c1')).toBe(
      '/restrict/patients/c1/cobranca'
    );
    expect(personBillingHref('ACADEMIA', 'c1')).toBe(
      '/restrict/academia-alunos/c1'
    );
  });

  it('encodes an id before putting it in an address', () => {
    expect(personBillingHref('PHYSICAL_EDUCATOR', 'a/b?c')).toBe(
      '/restrict/students/a%2Fb%3Fc/billing'
    );
  });
});

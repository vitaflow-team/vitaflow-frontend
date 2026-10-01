import { describe, expect, it } from 'vitest';
import {
  availableTabs,
  parseProfessionalDiscoveryTab,
  professionalDiscoveryTabHref,
} from './professionalDiscoveryTabs';

describe('professional discovery tabs', () => {
  it('shows only buscar/solicitacoes to a non-professional account', () => {
    expect(availableTabs(false)).toEqual(['buscar', 'solicitacoes']);
  });

  it('shows all four tabs to a professional account', () => {
    expect(availableTabs(true)).toEqual([
      'buscar',
      'solicitacoes',
      'recebidas',
      'perfil',
    ]);
  });

  it('falls back to buscar for a missing or unknown value', () => {
    expect(parseProfessionalDiscoveryTab(undefined, true)).toBe('buscar');
    expect(parseProfessionalDiscoveryTab('invalido', true)).toBe('buscar');
    expect(parseProfessionalDiscoveryTab(['buscar', 'perfil'], true)).toBe(
      'buscar'
    );
  });

  it('falls back to buscar when a non-professional requests a professional-only tab', () => {
    expect(parseProfessionalDiscoveryTab('recebidas', false)).toBe('buscar');
    expect(parseProfessionalDiscoveryTab('perfil', false)).toBe('buscar');
  });

  it('accepts a professional-only tab for a professional account', () => {
    expect(parseProfessionalDiscoveryTab('recebidas', true)).toBe('recebidas');
    expect(parseProfessionalDiscoveryTab('perfil', true)).toBe('perfil');
  });

  it('builds a shareable href per tab', () => {
    expect(professionalDiscoveryTabHref('solicitacoes')).toBe(
      '/restrict/professionals?tab=solicitacoes'
    );
  });
});

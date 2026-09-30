import { describe, expect, it } from 'vitest';
import { parseProgressTab, progressTabHref } from './progressTabs';

describe('progress tabs', () => {
  it('keeps every known tab', () => {
    expect(parseProgressTab('medidas')).toBe('medidas');
    expect(parseProgressTab('fotos')).toBe('fotos');
  });

  it('falls back to Medidas for unknown, empty, repeated and other-case values', () => {
    expect(parseProgressTab(undefined)).toBe('medidas');
    expect(parseProgressTab('')).toBe('medidas');
    expect(parseProgressTab('xyz')).toBe('medidas');
    expect(parseProgressTab('FOTOS')).toBe('medidas');
    expect(parseProgressTab(['fotos', 'medidas'])).toBe('medidas');
  });

  it('builds the tab address and keeps extra parameters', () => {
    expect(progressTabHref('fotos')).toBe('/restrict/progress?tab=fotos');
    expect(progressTabHref('fotos', { semanas: '8' })).toBe(
      '/restrict/progress?tab=fotos&semanas=8'
    );
  });
});

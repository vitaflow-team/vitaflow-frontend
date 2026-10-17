import { describe, expect, it } from 'vitest';
import { parsePatientsParams, patientsHref, searchHref } from './patientsList';

describe('parsePatientsParams', () => {
  it('reads a trimmed search term', () => {
    expect(parsePatientsParams({ q: '  diego  ' })).toEqual({
      search: 'diego',
    });
  });

  it('treats a blank or missing term as no search', () => {
    expect(parsePatientsParams({ q: '  ' })).toEqual({ search: undefined });
    expect(parsePatientsParams({})).toEqual({ search: undefined });
  });

  it('takes the first value of a repeated param', () => {
    expect(parsePatientsParams({ q: ['a', 'b'] })).toEqual({ search: 'a' });
  });
});

describe('patientsHref', () => {
  it('stays the bare path with no search', () => {
    expect(patientsHref({})).toBe('/restrict/patients');
  });

  it('adds the search term as ?q=', () => {
    expect(patientsHref({ search: 'ana' })).toBe('/restrict/patients?q=ana');
  });
});

describe('searchHref', () => {
  it('clears the search when the term is blank', () => {
    expect(searchHref('   ')).toBe('/restrict/patients');
  });

  it('trims the typed term', () => {
    expect(searchHref('  ana  ')).toBe('/restrict/patients?q=ana');
  });
});

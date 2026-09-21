import { describe, expect, it } from 'vitest';
import { getAccessNotice, stripNoticeParam } from './accessNotice';

describe('restricted access notice', () => {
  it('UT-017 maps the fixed code to safe Portuguese copy', () => {
    const notice = getAccessNotice('sem-permissao');

    expect(notice?.title).toBe('Área indisponível');
    expect(notice?.message).toMatch(/área não está disponível.*tipo de conta/i);
    expect(notice?.message).not.toContain('Something went wrong');
    expect(notice?.message).not.toContain('sem-permissao');
  });

  it('UT-018 ignores unknown, absent, and hostile codes', () => {
    expect(getAccessNotice('foo')).toBeNull();
    expect(getAccessNotice(null)).toBeNull();
    expect(getAccessNotice('<script>alert(1)</script>')).toBeNull();
  });

  it('UT-019 removes only the notice parameter', () => {
    expect(stripNoticeParam('?aviso=sem-permissao&tab=2')).toBe('?tab=2');
  });

  it('UT-020 returns an empty search when notice is the only parameter', () => {
    expect(stripNoticeParam('?aviso=sem-permissao')).toBe('');
  });

  it('UT-021 preserves searches without a notice and empty searches', () => {
    expect(stripNoticeParam('?tab=2')).toBe('?tab=2');
    expect(stripNoticeParam('')).toBe('');
  });
});

describe('account deletion notice', () => {
  it('UT-028 maps the deletion code to a success notice', () => {
    const notice = getAccessNotice('conta-excluida');

    expect(notice?.title).toBe('Conta excluída');
    expect(notice?.type).toBe('success');
    expect(notice?.message).toMatch(/conta foi excluída/i);
    expect(notice?.message).not.toContain('conta-excluida');
  });

  it('UT-028 keeps the access-denied notice on the default info type', () => {
    const notice = getAccessNotice('sem-permissao');

    expect(notice?.title).toBe('Área indisponível');
    expect(notice?.type ?? 'info').toBe('info');
  });

  it('UT-028 still shows nothing for unknown and absent codes', () => {
    expect(getAccessNotice('conta-excluida-2')).toBeNull();
    expect(getAccessNotice('constructor')).toBeNull();
    expect(getAccessNotice(null)).toBeNull();
  });
});

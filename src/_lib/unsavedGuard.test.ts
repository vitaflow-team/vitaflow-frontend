import { describe, expect, it } from 'vitest';
import { shouldInterceptClick, type ClickInfo } from './unsavedGuard';

const ORIGIN = 'http://localhost:3000';
const CURRENT = `${ORIGIN}/restrict/settings?tab=perfil`;

function click(overrides: Partial<ClickInfo> = {}): ClickInfo {
  return {
    href: '/restrict/settings?tab=plano',
    target: null,
    download: false,
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    defaultPrevented: false,
    ...overrides,
  };
}

describe('unsaved changes guard', () => {
  it('UT-026 intercepts a plain click on another in-app address', () => {
    expect(shouldInterceptClick(click(), CURRENT, ORIGIN)).toBe(true);
    expect(
      shouldInterceptClick(
        click({ href: `${ORIGIN}/restrict/settings?tab=conta` }),
        CURRENT,
        ORIGIN
      )
    ).toBe(true);
    expect(
      shouldInterceptClick(click({ target: '_self' }), CURRENT, ORIGIN)
    ).toBe(true);
  });

  it('UT-027 leaves every click that does not navigate this tab alone', () => {
    const cases: [string, ClickInfo][] = [
      ['same URL', click({ href: '/restrict/settings?tab=perfil' })],
      ['same absolute URL', click({ href: CURRENT })],
      ['hash only', click({ href: '#conteudo' })],
      [
        'hash on the same address',
        click({ href: '/restrict/settings?tab=perfil#fim' }),
      ],
      ['external origin', click({ href: 'https://stripe.com/checkout' })],
      ['other protocol', click({ href: 'mailto:alguem@exemplo.com' })],
      ['new tab', click({ target: '_blank' })],
      ['download', click({ download: true })],
      ['ctrl click', click({ ctrlKey: true })],
      ['meta click', click({ metaKey: true })],
      ['shift click', click({ shiftKey: true })],
      ['alt click', click({ altKey: true })],
      ['middle button', click({ button: 1 })],
      ['right button', click({ button: 2 })],
      ['already prevented', click({ defaultPrevented: true })],
      ['no href', click({ href: null })],
    ];

    for (const [name, info] of cases) {
      expect(shouldInterceptClick(info, CURRENT, ORIGIN), name).toBe(false);
    }
  });
});

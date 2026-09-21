import { describe, expect, it } from 'vitest';
import { parseSettingsTab, settingsTabHref } from './settingsTabs';

describe('settings tabs', () => {
  it('UT-015 keeps every known tab', () => {
    expect(parseSettingsTab('perfil')).toBe('perfil');
    expect(parseSettingsTab('plano')).toBe('plano');
    expect(parseSettingsTab('conta')).toBe('conta');
  });

  it('UT-016 falls back to Perfil for unknown, empty, repeated and other-case values', () => {
    expect(parseSettingsTab(undefined)).toBe('perfil');
    expect(parseSettingsTab('')).toBe('perfil');
    expect(parseSettingsTab('xyz')).toBe('perfil');
    expect(parseSettingsTab('PLANO')).toBe('perfil');
    expect(parseSettingsTab(['plano', 'conta'])).toBe('perfil');
  });

  it('UT-017 builds the tab address and keeps extra parameters', () => {
    expect(settingsTabHref('plano')).toBe('/restrict/settings?tab=plano');
    expect(settingsTabHref('plano', { checkout_session_id: 'cs_1' })).toBe(
      '/restrict/settings?tab=plano&checkout_session_id=cs_1'
    );
  });
});

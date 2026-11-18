import { describe, expect, it } from 'vitest';
import {
  parseSettingsTab,
  settingsTabHref,
  settingsTabsForType,
} from './settingsTabs';

describe('settings tabs', () => {
  it('UT-015 keeps every known tab', () => {
    expect(parseSettingsTab('perfil')).toBe('perfil');
    expect(parseSettingsTab('plano')).toBe('plano');
    expect(parseSettingsTab('conta')).toBe('conta');
    expect(parseSettingsTab('notificacoes')).toBe('notificacoes');
  });

  it('UT-016 falls back to Perfil for unknown, empty, repeated and other-case values', () => {
    expect(parseSettingsTab(undefined)).toBe('perfil');
    expect(parseSettingsTab('')).toBe('perfil');
    expect(parseSettingsTab('xyz')).toBe('perfil');
    expect(parseSettingsTab('PLANO')).toBe('perfil');
    expect(parseSettingsTab(['plano', 'conta'])).toBe('perfil');
  });

  it('UT-121 the cobrança tab appears for professionals and gym owners only', () => {
    expect(settingsTabsForType('PHYSICAL_EDUCATOR')).toContain('cobranca');
    expect(settingsTabsForType('NUTRITIONIST')).toContain('cobranca');
    expect(settingsTabsForType('ACADEMIA')).toContain('cobranca');
    expect(settingsTabsForType('USER')).not.toContain('cobranca');
    expect(settingsTabsForType(null)).not.toContain('cobranca');
  });

  it('UT-142 includes cobrança for ACADEMIA, NUTRITIONIST and PHYSICAL_EDUCATOR, not for USER', () => {
    for (const type of ['ACADEMIA', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR']) {
      expect(settingsTabsForType(type)).toContain('cobranca');
    }
    expect(settingsTabsForType('USER')).not.toContain('cobranca');
    expect(settingsTabsForType('RECEPTIONIST')).not.toContain('cobranca');
  });

  it('UT-142 gives a gym owner the cobrança tab but not the professional packages catalog', () => {
    expect(settingsTabsForType('ACADEMIA')).not.toContain('pacotes');
    expect(settingsTabsForType('NUTRITIONIST')).toContain('pacotes');
    expect(settingsTabsForType('PHYSICAL_EDUCATOR')).toContain('pacotes');
  });

  it('UT-017 builds the tab address and keeps extra parameters', () => {
    expect(settingsTabHref('plano')).toBe('/restrict/settings?tab=plano');
    expect(settingsTabHref('plano', { checkout_session_id: 'cs_1' })).toBe(
      '/restrict/settings?tab=plano&checkout_session_id=cs_1'
    );
  });
});

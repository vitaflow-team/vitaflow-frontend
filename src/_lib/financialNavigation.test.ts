import { describe, expect, it } from 'vitest';
import { canAccess } from './routeAccess';
import {
  getBottomNavItems,
  getMenuGroups,
  getTopbarContext,
  sectionsForType,
} from './navigation';

const PROFESSIONAL_PATH = '/restrict/financeiro';
const GYM_PATH = '/restrict/academia-financeiro';

function menuUrl(type: string | null, title: string): string | undefined {
  return getMenuGroups(type)[0].items.find(item => item.title === title)?.url;
}

describe('financial panels — route gating', () => {
  it('UT-136 denies the gym route to nutritionists, educators, receptionists and users', () => {
    for (const type of [
      'NUTRITIONIST',
      'PHYSICAL_EDUCATOR',
      'RECEPTIONIST',
      'USER',
    ]) {
      expect(canAccess(GYM_PATH, type)).toBe(false);
    }
    expect(canAccess(GYM_PATH, 'ACADEMIA')).toBe(true);
  });

  it('UT-136 allows the professional route to educators and nutritionists and denies a gym owner', () => {
    expect(canAccess(PROFESSIONAL_PATH, 'PHYSICAL_EDUCATOR')).toBe(true);
    expect(canAccess(PROFESSIONAL_PATH, 'NUTRITIONIST')).toBe(true);
    expect(canAccess(PROFESSIONAL_PATH, 'ACADEMIA')).toBe(false);
    expect(canAccess(PROFESSIONAL_PATH, 'RECEPTIONIST')).toBe(false);
    expect(canAccess(PROFESSIONAL_PATH, 'USER')).toBe(false);
    expect(canAccess(PROFESSIONAL_PATH, null)).toBe(false);
  });

  it('UT-136 governs the pages below each route the same way', () => {
    expect(canAccess(`${GYM_PATH}/x`, 'NUTRITIONIST')).toBe(false);
    expect(canAccess(`${PROFESSIONAL_PATH}/x`, 'ACADEMIA')).toBe(false);
    expect(canAccess('/restrict/financeiro-antigo', 'USER')).toBe(true);
  });
});

describe('financial panels — navigation', () => {
  it('shows each type only its own financial route', () => {
    expect(menuUrl('PHYSICAL_EDUCATOR', 'Financeiro')).toBe(PROFESSIONAL_PATH);
    expect(menuUrl('NUTRITIONIST', 'Financeiro')).toBe(PROFESSIONAL_PATH);
    expect(menuUrl('ACADEMIA', 'Financeiro')).toBe(GYM_PATH);
    for (const type of ['USER', 'RECEPTIONIST', null]) {
      expect(menuUrl(type, 'Financeiro')).toBeUndefined();
    }
  });

  it('adds the section to the plan change summary of professionals and gyms only', () => {
    expect(sectionsForType('NUTRITIONIST')).toContain('Financeiro');
    expect(sectionsForType('ACADEMIA')).toContain('Financeiro');
    expect(sectionsForType('USER')).not.toContain('Financeiro');
  });

  it('keeps the bottom bar on its first sections, with no financial entry', () => {
    for (const type of ['NUTRITIONIST', 'PHYSICAL_EDUCATOR', 'ACADEMIA']) {
      const urls = getBottomNavItems(type).map(item => item.url);

      expect(urls).toHaveLength(5);
      expect(urls).not.toContain(PROFESSIONAL_PATH);
      expect(urls).not.toContain(GYM_PATH);
    }
  });

  it('shows only the page name in the topbar of each financial route', () => {
    expect(getTopbarContext(PROFESSIONAL_PATH)).toEqual({
      kind: 'title',
      title: 'Financeiro',
    });
    expect(getTopbarContext(GYM_PATH)).toEqual({
      kind: 'title',
      title: 'Financeiro da academia',
    });
  });
});

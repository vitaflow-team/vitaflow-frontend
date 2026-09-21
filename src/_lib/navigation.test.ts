import { describe, expect, it } from 'vitest';
import type { AppRoute } from '@/_constants/routes';
import { ChartNoAxesCombined } from 'lucide-react';
import {
  getBottomNavItems,
  getFirstName,
  getMenuGroups,
  getTopbarContext,
  isRouteActive,
  sectionsForType,
} from './navigation';

describe('restricted shell navigation — isRouteActive', () => {
  it('UT-001 matches the exact section path', () => {
    expect(isRouteActive('/restrict/progress', '/restrict/progress')).toBe(
      true
    );
  });

  it('UT-002 matches a page inside the section', () => {
    expect(isRouteActive('/restrict/workouts/0', '/restrict/workouts')).toBe(
      true
    );
  });

  it('UT-003 matches the restricted root on its own path', () => {
    expect(isRouteActive('/restrict', '/restrict')).toBe(true);
  });

  it('UT-004 does not match the root from a nested path', () => {
    expect(isRouteActive('/restrict/progress', '/restrict')).toBe(false);
  });

  it('UT-005 does not match a path that only shares a name prefix', () => {
    expect(
      isRouteActive('/restrict/workouts-archive', '/restrict/workouts')
    ).toBe(false);
  });

  it('UT-006 matches the settings path', () => {
    expect(isRouteActive('/restrict/settings', '/restrict/settings')).toBe(
      true
    );
  });

  it('UT-007 highlights nothing on an unknown restricted path', () => {
    const urls = [
      ...getMenuGroups('USER').flatMap(group => group.items),
      ...getMenuGroups('NUTRITIONIST').flatMap(group => group.items),
      ...getBottomNavItems('USER'),
      ...getBottomNavItems('NUTRITIONIST'),
    ].map(item => item.url);

    for (const url of urls) {
      expect(isRouteActive('/restrict/unknown', url)).toBe(false);
    }
  });
});

describe('restricted shell navigation — getBottomNavItems', () => {
  it('UT-008 lists the user destinations with the short label', () => {
    expect(getBottomNavItems('USER').map(item => item.title)).toEqual([
      'Início',
      'Treinos',
      'Evolução',
      'Conta',
    ]);
  });

  it('UT-009 lists the professional destinations', () => {
    expect(getBottomNavItems('NUTRITIONIST').map(item => item.title)).toEqual([
      'Início',
      'Pessoas',
      'Treinos',
      'Evolução',
      'Conta',
    ]);
  });

  it('UT-010 keeps the open-to-all destinations with no product type', () => {
    expect(getBottomNavItems(null).map(item => item.title)).toEqual([
      'Início',
      'Conta',
    ]);
  });

  it('UT-013 caps the bar at five items with Conta last', () => {
    const routes: AppRoute[] = ['a', 'b', 'c', 'd', 'e', 'f'].map(name => ({
      TITLE: name.toUpperCase(),
      URL: `/restrict/${name}`,
      ICON: ChartNoAxesCombined,
      PRODUCT_TYPE: ['USER'],
    }));

    const items = getBottomNavItems('USER', routes);

    expect(items).toHaveLength(5);
    expect(items.map(item => item.title)).toEqual([
      'A',
      'B',
      'C',
      'D',
      'Conta',
    ]);
  });
});

describe('restricted shell navigation — getMenuGroups', () => {
  it('UT-011 groups the user menu and keeps Início for a typeless account', () => {
    expect(
      getMenuGroups('USER').map(group => ({
        label: group.label,
        items: group.items.map(item => item.title),
      }))
    ).toEqual([
      { label: 'Meu dia', items: ['Início', 'Treinos', 'Minha evolução'] },
      { label: 'Conta', items: ['Configurações'] },
    ]);

    expect(
      getMenuGroups(null).map(group => ({
        label: group.label,
        items: group.items.map(item => item.title),
      }))
    ).toEqual([
      { label: 'Meu dia', items: ['Início'] },
      { label: 'Conta', items: ['Configurações'] },
    ]);
  });

  it('UT-012 gives the professional Pessoas alongside Minha evolução', () => {
    const groups = getMenuGroups('PHYSICAL_EDUCATOR');

    expect(groups[0].label).toBe('Meu dia');
    expect(groups[0].items.map(item => item.title)).toEqual([
      'Início',
      'Pessoas',
      'Treinos',
      'Minha evolução',
    ]);
    expect(groups[1].items.map(item => item.title)).toEqual(['Configurações']);
  });
});

describe('restricted shell navigation — getTopbarContext', () => {
  it('UT-014 builds the workout form trail', () => {
    expect(getTopbarContext('/restrict/workouts/0')).toEqual({
      kind: 'trail',
      items: [
        { label: 'Vita Flow', href: '/restrict' },
        { label: 'Treinos', href: '/restrict/workouts' },
        { label: 'Cadastro de treino' },
      ],
    });
  });

  it('UT-015 never shows the raw id of a dynamic segment', () => {
    const context = getTopbarContext('/restrict/clients/123');

    expect(context).toEqual({
      kind: 'trail',
      items: [
        { label: 'Vita Flow', href: '/restrict' },
        { label: 'Pessoas', href: '/restrict/clients' },
        { label: 'Cliente' },
      ],
    });
    expect(JSON.stringify(context)).not.toContain('123');
  });

  it('UT-016 shows only the page name on top-level pages', () => {
    expect(getTopbarContext('/restrict')).toEqual({
      kind: 'title',
      title: 'Início',
    });
    expect(getTopbarContext('/restrict/progress')).toEqual({
      kind: 'title',
      title: 'Minha evolução',
    });
    expect(getTopbarContext('/restrict/workouts')).toEqual({
      kind: 'title',
      title: 'Treinos',
    });
    expect(getTopbarContext('/restrict/settings')).toEqual({
      kind: 'title',
      title: 'Configurações',
    });
    expect(getTopbarContext('/restrict/clients')).toEqual({
      kind: 'title',
      title: 'Pessoas',
    });
  });

  it('UT-017 shows nothing for an unknown path', () => {
    expect(getTopbarContext('/restrict/unknown')).toBeNull();
  });
});

describe('restricted shell navigation — getFirstName', () => {
  it('UT-018 takes the first word and ignores extra spacing', () => {
    expect(getFirstName('Fernando Vicari')).toBe('Fernando');
    expect(getFirstName('  Ana   Maria ')).toBe('Ana');
  });

  it('UT-019 returns an empty string when there is no name', () => {
    expect(getFirstName(null)).toBe('');
    expect(getFirstName(undefined)).toBe('');
    expect(getFirstName('')).toBe('');
    expect(getFirstName('   ')).toBe('');
  });

  it('UT-020 leaves a single long name untouched', () => {
    expect(getFirstName('Maximiliano')).toBe('Maximiliano');
  });
});

describe('professional personal use — navigation', () => {
  it('UT-013 gives a professional five bottom items with Conta last', () => {
    for (const type of ['NUTRITIONIST', 'PHYSICAL_EDUCATOR']) {
      const items = getBottomNavItems(type).map(item => item.title);

      expect(items).toEqual([
        'Início',
        'Pessoas',
        'Treinos',
        'Evolução',
        'Conta',
      ]);
      expect(items).toHaveLength(5);
      expect(items.at(-1)).toBe('Conta');
    }

    const userItems = getBottomNavItems('USER').map(item => item.title);
    expect(userItems).toEqual(['Início', 'Treinos', 'Evolução', 'Conta']);
    expect(userItems.at(-1)).toBe('Conta');
  });

  it('UT-014 includes Minha evolução in the professional menu', () => {
    for (const type of ['NUTRITIONIST', 'PHYSICAL_EDUCATOR']) {
      const sections = getMenuGroups(type)[0].items.map(item => item.title);

      expect(sections).toContain('Minha evolução');
      expect(sections).toEqual([
        'Início',
        'Pessoas',
        'Treinos',
        'Minha evolução',
      ]);
    }
  });

  it('UT-021 lists the sections each type sees', () => {
    expect(sectionsForType('USER')).toEqual([
      'Início',
      'Treinos',
      'Minha evolução',
    ]);

    for (const type of ['NUTRITIONIST', 'PHYSICAL_EDUCATOR']) {
      expect(sectionsForType(type)).toEqual([
        'Início',
        'Pessoas',
        'Treinos',
        'Minha evolução',
      ]);
    }

    expect(sectionsForType(null)).toEqual(['Início']);
  });
});

import { describe, expect, it } from 'vitest';
import { peopleShortcut } from './homeShortcuts';

describe('professional home shortcut', () => {
  it('points a nutritionist to Pessoas', () => {
    expect(peopleShortcut('NUTRITIONIST')).toMatchObject({
      TITLE: 'Pessoas',
      URL: '/restrict/clients',
    });
  });

  it('points a physical educator to Alunos, never to Pessoas', () => {
    expect(peopleShortcut('PHYSICAL_EDUCATOR')).toMatchObject({
      TITLE: 'Alunos',
      URL: '/restrict/students',
    });
  });

  it('offers nothing to a regular user or a typeless account', () => {
    expect(peopleShortcut('USER')).toBeNull();
    expect(peopleShortcut(null)).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import { getAvatarView } from './avatarView';
import { getInitialsName } from './getInitials';

describe('avatar display state', () => {
  it('UT-026 returns no initials for missing or blank names', () => {
    expect(getInitialsName(null)).toBe('');
    expect(getInitialsName(undefined)).toBe('');
    expect(getInitialsName('')).toBe('');
    expect(getInitialsName('   ')).toBe('');
  });

  it('UT-027 returns initials from known names', () => {
    expect(getInitialsName('Fernando Vicari')).toBe('FV');
    expect(getInitialsName('ana')).toBe('AN');
  });

  it('UT-028 uses a skeleton while loading', () => {
    expect(getAvatarView('loading', undefined)).toEqual({ kind: 'skeleton' });
  });

  it('UT-029 uses the authenticated name in the avatar', () => {
    expect(getAvatarView('authenticated', 'Fernando Vicari')).toEqual({
      kind: 'avatar',
      name: 'Fernando Vicari',
    });
  });

  it('UT-030 does not leave unauthenticated users on a skeleton', () => {
    expect(getAvatarView('unauthenticated', undefined)).toEqual({
      kind: 'avatar',
      name: undefined,
    });
  });
});

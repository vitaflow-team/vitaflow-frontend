export type AvatarView =
  | { kind: 'skeleton' }
  | { kind: 'avatar'; name?: string | null };

export function getAvatarView(
  status: string,
  name?: string | null
): AvatarView {
  if (status === 'loading') {
    return { kind: 'skeleton' };
  }

  return { kind: 'avatar', name };
}

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./progress/recordFormModal', () => ({
  RecordFormModal: ({
    trigger,
    focusField,
  }: {
    trigger: ReactNode;
    focusField?: string;
  }) => <div data-focus={focusField ?? 'none'}>{trigger}</div>,
}));

import { UserAvatar } from './layout/userAvatar';
import { FloatingRegisterButton } from './progress/floatingRegisterButton';
import { UpdateHeightButton } from './progress/updateHeightButton';

// NotificationsBell was reviewed here while it was a dependency-free,
// synchronous stub. It is now a real async Server Component with
// server-only data dependencies (notificationsData.ts) — a different
// category from the simple client-primitive wrappers below, and no longer
// renderable via a plain renderToStaticMarkup call in this suite. Its own
// behavior is covered by notificationsList.test.tsx and
// notificationsPopoverContent.test.tsx instead.
const REVIEWED = [
  './layout/userAvatar.tsx',
  './progress/floatingRegisterButton.tsx',
  './progress/updateHeightButton.tsx',
];

describe('refactor — reviewed client boundaries', () => {
  // UT-008: each one only composes client primitives, so none is a client module.
  it.each(REVIEWED)('%s has no client directive', file => {
    const source = readFileSync(
      fileURLToPath(new URL(file, import.meta.url)),
      'utf8'
    );

    expect(source).not.toContain("'use client'");
  });

  // UT-008
  it('renders the avatar fallback initials', () => {
    const markup = renderToStaticMarkup(
      <UserAvatar size="lg" src={null} name="Ana Souza" />
    );

    expect(markup).toContain('h-40 w-40');
    expect(markup).toContain('AS');
  });

  // UT-008
  it('hands the register and height triggers to the modal', () => {
    const floating = renderToStaticMarkup(<FloatingRegisterButton />);
    const height = renderToStaticMarkup(<UpdateHeightButton />);

    expect(floating).toContain('data-focus="none"');
    expect(floating).toContain('aria-label="Registrar novo"');
    expect(height).toContain('data-focus="heightCm"');
    expect(height).toContain('Atualizar');
  });
});

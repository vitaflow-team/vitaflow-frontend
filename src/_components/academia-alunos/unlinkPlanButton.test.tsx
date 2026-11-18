import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    isError: false,
    execute: vi.fn(),
  }),
}));
vi.mock('@/_actions/academia/unlinkAccessPlan', () => ({
  unlinkAccessPlan: {},
}));
vi.mock('@/_components/ui/alert-dialog', () => {
  const Pass = ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  );
  return {
    AlertDialog: Pass,
    AlertDialogTrigger: Pass,
    AlertDialogContent: Pass,
    AlertDialogHeader: Pass,
    AlertDialogFooter: Pass,
    AlertDialogTitle: Pass,
    AlertDialogDescription: Pass,
    AlertDialogCancel: Pass,
  };
});

import { UnlinkPlanButton } from './unlinkPlanButton';

describe('UnlinkPlanButton — financial-health US-014', () => {
  const html = renderToStaticMarkup(
    <UnlinkPlanButton
      clientId="client-1"
      studentName="Diego Martins"
      onUnlinked={() => {}}
    />
  );

  it('names the student and the action', () => {
    expect(html).toContain('Desvincular plano');
    expect(html).toContain('Desvincular Diego Martins do plano?');
  });

  it('explains the consequences, including that overdue fees stay owed', () => {
    expect(html).toContain('deixam de ser emitidas');
    expect(html).toContain('ainda não venceram são canceladas');
    expect(html).toContain('em atraso continuam em aberto');
  });
});

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    isError: false,
    execute: vi.fn(),
  }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_actions/academia/getCurrentAccessPlan', () => ({
  getCurrentAccessPlan: {},
}));
vi.mock('@/_actions/academia/assignAccessPlan', () => ({
  assignAccessPlan: {},
}));
vi.mock('@/_actions/academia/listAccessPlansCatalog', () => ({
  listAccessPlansCatalog: {},
}));
vi.mock('@/_components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

import { StudentAccessPlanPanel } from './studentAccessPlanPanel';

describe('StudentAccessPlanPanel — gym-checkin US-006, US-007', () => {
  it("shows the trigger button naming the student's record", () => {
    const html = renderToStaticMarkup(
      <StudentAccessPlanPanel clientId="client-1" studentName="Diego Martins" />
    );

    expect(html).toContain('Plano de acesso');
    expect(html).toContain('Diego Martins');
  });
});

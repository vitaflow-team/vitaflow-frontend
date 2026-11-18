import type { CurrentAccessPlan } from '@/_types/studentAccessPlan';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { planState } = vi.hoisted(() => ({
  planState: {
    open: true,
    current: null as CurrentAccessPlan | null,
    catalog: [] as unknown[],
  },
}));

vi.mock('@/_hooks/useStudentAccessPlan', () => ({
  useStudentAccessPlan: () => ({
    ...planState,
    handleOpen: vi.fn(),
    changed: vi.fn(),
  }),
}));
vi.mock('./planAssignSection', () => ({
  PlanAssignSection: ({
    hasPlan,
    availability,
  }: {
    hasPlan: boolean;
    availability: string;
  }) => (
    <p>
      atribuir:{String(hasPlan)}:{availability}
    </p>
  ),
}));
vi.mock('./changeTermsForm', () => ({
  ChangeTermsForm: () => <p>alterar mensalidade</p>,
}));
vi.mock('./unlinkPlanButton', () => ({
  UnlinkPlanButton: () => <p>desvincular</p>,
}));
vi.mock('@/_components/ui/dialog', () => {
  const Pass = ({ children }: { children?: ReactNode }) => <>{children}</>;
  return {
    Dialog: Pass,
    DialogTrigger: Pass,
    DialogContent: Pass,
    DialogHeader: Pass,
    DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  };
});

import { StudentAccessPlanPanel } from './studentAccessPlanPanel';

const VALID: CurrentAccessPlan = {
  plan: {
    validityType: 'DAYS',
    validityValue: 30,
    expiresAt: '2026-12-10T12:00:00.000Z',
    assignedAt: '2026-11-10T12:00:00.000Z',
  },
  status: 'VALID',
  remaining: null,
};

function render(billing: 'READY' | 'NOT_CONNECTED' = 'READY') {
  return renderToStaticMarkup(
    <StudentAccessPlanPanel
      clientId="client-1"
      studentName="Diego Martins"
      billing={billing}
    />
  );
}

describe('StudentAccessPlanPanel — gym-checkin US-006, US-007; financial-health US-012, US-014', () => {
  beforeEach(() => {
    planState.current = null;
    planState.catalog = [];
  });

  it("shows the trigger button naming the student's record", () => {
    const html = render();

    expect(html).toContain('Plano de acesso');
    expect(html).toContain('Diego Martins');
  });

  it('offers only the link, with no unlink or terms, for a student without a plan', () => {
    planState.current = { plan: null, status: 'NO_PLAN', remaining: null };

    const html = render();

    expect(html).toContain('Sem plano atribuído');
    expect(html).toContain('atribuir:false:READY');
    expect(html).not.toContain('desvincular');
    expect(html).not.toContain('alterar mensalidade');
  });

  it('offers swapping the plan, changing the terms and unlinking when a plan is assigned', () => {
    planState.current = VALID;

    const html = render();

    expect(html).toContain('Expira em 10/12/2026');
    expect(html).toContain('atribuir:true:READY');
    expect(html).toContain('alterar mensalidade');
    expect(html).toContain('desvincular');
  });

  it('hands the billing availability to the assign section', () => {
    expect(render('NOT_CONNECTED')).toContain('atribuir:false:NOT_CONNECTED');
  });
});

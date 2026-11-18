'use client';

import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { useStudentAccessPlan } from '@/_hooks/useStudentAccessPlan';
import type { GymBillingAvailability } from '@/_types/gymBillingAvailability';
import { CreditCard } from 'lucide-react';
import { ChangeTermsForm } from './changeTermsForm';
import { CurrentPlanSummary } from './currentPlanSummary';
import { PlanAssignSection } from './planAssignSection';
import { UnlinkPlanButton } from './unlinkPlanButton';

interface StudentAccessPlanPanelProps {
  clientId: string;
  studentName: string;
  /** Whether the gym can start charging monthly fees now. */
  billing: GymBillingAvailability;
}

/** The student's access plan: link or swap it with the monthly fee, change its terms, or end it (US-006, US-012, US-014). */
export function StudentAccessPlanPanel({
  clientId,
  studentName,
  billing,
}: StudentAccessPlanPanelProps) {
  const plan = useStudentAccessPlan(clientId);
  const hasPlan = plan.current !== null && plan.current.status !== 'NO_PLAN';

  return (
    <Dialog
      open={plan.open}
      onOpenChange={isOpen => void plan.handleOpen(isOpen)}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <CreditCard aria-hidden="true" />
          Plano de acesso
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Plano de acesso de {studentName}</DialogTitle>
        </DialogHeader>
        {plan.current && <CurrentPlanSummary current={plan.current} />}
        <PlanAssignSection
          clientId={clientId}
          catalog={plan.catalog}
          hasPlan={hasPlan}
          availability={billing}
          onAssigned={() => void plan.changed()}
        />
        {hasPlan && (
          <>
            <ChangeTermsForm
              clientId={clientId}
              onChanged={() => void plan.changed()}
            />
            <UnlinkPlanButton
              clientId={clientId}
              studentName={studentName}
              onUnlinked={() => void plan.changed()}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

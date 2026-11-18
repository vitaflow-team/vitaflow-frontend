'use client';

import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { useBulkActivation } from '@/_hooks/useBulkActivation';
import { ActivationOutcome } from './activationOutcome';
import { BulkActivationActions } from './bulkActivationActions';
import { EligibleStudentsList } from './eligibleStudentsList';

/** Starts the monthly fee of the students linked to a plan before billing existed (US-015). */
export function BulkActivationDialog() {
  const bulk = useBulkActivation();
  const students = bulk.students ?? [];
  const busy = bulk.isLoading || bulk.isRunning;

  return (
    <Dialog onOpenChange={isOpen => isOpen && void bulk.load()}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Ativar cobrança mensal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ativar cobrança mensal</DialogTitle>
          <DialogDescription>
            Cobra a mensalidade dos alunos que já estavam vinculados a um plano.
            A primeira cobrança é emitida agora, pelo preço do plano.
          </DialogDescription>
        </DialogHeader>
        <FormError message={bulk.loadError} />
        {bulk.students && (
          <EligibleStudentsList
            students={students}
            selected={bulk.selected}
            disabled={busy}
            onToggle={bulk.toggle}
            onSelectAll={bulk.selectAll}
            onClear={bulk.clear}
          />
        )}
        {bulk.outcome && (
          <ActivationOutcome outcome={bulk.outcome} students={students} />
        )}
        {students.length > 0 && (
          <BulkActivationActions
            dueDay={bulk.dueDay}
            onDueDayChange={bulk.setDueDay}
            selectedCount={bulk.selected.length}
            busy={busy}
            running={bulk.isRunning}
            onRun={() => void bulk.run()}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

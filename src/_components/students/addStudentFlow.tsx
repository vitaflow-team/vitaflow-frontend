'use client';

import { useAddStudent } from '@/_hooks/useAddStudent';
import type { EducatorEmployment } from '@/_types/educatorEmployment';
import { AddStudentConfirmStep } from './addStudentConfirmStep';
import { AddStudentEmailStep } from './addStudentEmailStep';
import { AddStudentRegisterStep } from './addStudentRegisterStep';

interface AddStudentFlowProps {
  onDone: () => void;
  employments: EducatorEmployment[];
}

export function AddStudentFlow({ onDone, employments }: AddStudentFlowProps) {
  const flow = useAddStudent(onDone);
  const { state, isPending } = flow;

  if (state.step === 'confirm') {
    return (
      <AddStudentConfirmStep
        email={state.email}
        accountName={state.accountName}
        isPending={isPending}
        error={state.error}
        onLink={flow.link}
        onCancel={flow.cancelConfirm}
        onRegisterWithout={flow.registerWithoutAccount}
      />
    );
  }

  if (state.step === 'register') {
    return (
      <AddStudentRegisterStep
        email={state.email}
        isPending={isPending}
        error={state.error}
        onSubmit={flow.register}
        onEditEmail={flow.editEmail}
      />
    );
  }

  return (
    <AddStudentEmailStep
      defaultEmail={state.email}
      isPending={isPending}
      error={state.error}
      onSubmit={flow.submitEmail}
      employments={employments}
      ownership={state.ownership}
      academiaId={state.academiaId}
      onOwnershipChange={flow.setOwnership}
      onAcademiaChange={flow.setAcademia}
    />
  );
}

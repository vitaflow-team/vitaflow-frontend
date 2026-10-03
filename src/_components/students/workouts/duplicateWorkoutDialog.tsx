'use client';

import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { useDuplicateWorkout } from '@/_hooks/useDuplicateWorkout';
import type { StudentListItem } from '@/_types/students';
import { Copy } from 'lucide-react';
import { FormError } from '../formError';
import { StudentChecklist } from './studentChecklist';

interface DuplicateWorkoutDialogProps {
  studentId: string;
  workoutId: string;
  students: StudentListItem[];
}

/** Copies the workout to 1 to 20 of the educator's students, as drafts. */
export function DuplicateWorkoutDialog({
  studentId,
  workoutId,
  students,
}: DuplicateWorkoutDialogProps) {
  const copy = useDuplicateWorkout(studentId, workoutId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Copy aria-hidden="true" />
          Duplicar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Duplicar treino</DialogTitle>
          <DialogDescription>
            Cada aluno escolhido recebe uma cópia como rascunho. Nenhum aluno é
            avisado. Você também pode copiar para este mesmo aluno.
          </DialogDescription>
        </DialogHeader>
        <StudentChecklist
          students={students}
          currentStudentId={studentId}
          selected={copy.selected}
          onChange={copy.setSelected}
        />
        {copy.done !== null && (
          <p role="status" className="text-sm font-medium">
            {copy.done === 1
              ? 'Uma cópia criada.'
              : `${copy.done} cópias criadas.`}
          </p>
        )}
        <FormError message={copy.error} />
        <Button
          type="button"
          disabled={copy.isPending || !copy.canSubmit}
          onClick={() => void copy.submit()}
        >
          {copy.isPending ? 'Copiando…' : 'Criar cópias'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

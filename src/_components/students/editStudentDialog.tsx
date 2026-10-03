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
import type { Student } from '@/_types/students';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { EditStudentForm } from './editStudentForm';

interface EditStudentDialogProps {
  student: Student;
}

export function EditStudentDialog({ student }: EditStudentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil aria-hidden="true" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar aluno</DialogTitle>
          <DialogDescription>
            {student.hasAccount
              ? 'O e-mail de um aluno com conta não pode ser alterado.'
              : 'Altere os dados do cadastro do aluno.'}
          </DialogDescription>
        </DialogHeader>
        {open && (
          <EditStudentForm student={student} onDone={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

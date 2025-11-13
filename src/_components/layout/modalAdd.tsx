'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { Button } from '../ui/button';

export function ModalAdd({
  children,
  title,
  formId,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  formId: string;
}>) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="link">Adicionar</Button>
      </DialogTrigger>
      <DialogContent className="border-2 shadow-2xl border-primary">
        <DialogHeader>
          <DialogTitle className="pb-2">{title}</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-32">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" form={formId}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

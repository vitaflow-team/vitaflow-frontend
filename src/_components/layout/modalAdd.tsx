'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';

export function ModalAdd({
  children,
  title,
}: Readonly<{
  children: React.ReactNode;
  title: string;
}>) {
  return (
    <Dialog>
      <DialogTrigger>
        <span className="text-sm">Adicionar</span>
      </DialogTrigger>
      <DialogContent className="border-2 shadow-2xl border-primary">
        <DialogHeader>
          <DialogTitle className="pb-2">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

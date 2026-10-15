'use client';

import { inviteAcademiaMember } from '@/_actions/academia/inviteAcademiaMember';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { FormError } from '@/_components/students/formError';
import {
  inviteAcademiaMemberSchema,
  type InviteAcademiaMemberData,
} from '@/_schema/academia';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

export function InviteProfessorPanel() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const action = useServerAction(inviteAcademiaMember);
  const methods = useForm<InviteAcademiaMemberData>({
    resolver: zodResolver(inviteAcademiaMemberSchema),
    defaultValues: { email: '', kind: 'EMPLOYMENT' },
  });

  async function submit(values: InviteAcademiaMemberData) {
    const [, error] = await action.execute(values);
    if (!error) {
      methods.reset({ email: '', kind: 'EMPLOYMENT' });
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus aria-hidden="true" />
          Convidar professor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar professor</DialogTitle>
          <DialogDescription>
            Informe o e-mail do educador físico. Se ele já tem conta, o convite
            fica pendente para ele aceitar ou recusar.
          </DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(submit)}
            className="flex flex-col gap-3"
            noValidate
          >
            <FormField
              control={methods.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail do educador</FormLabel>
                  <FormControl>
                    <Input {...field} icon={Mail} disabled={action.isPending} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormError message={action.isError ? action.error.message : null} />
            <Button type="submit" disabled={action.isPending}>
              {action.isPending ? 'Convidando...' : 'Enviar convite'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

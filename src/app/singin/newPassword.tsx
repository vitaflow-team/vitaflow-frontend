'use client';

import { actionNewPassword } from '@/_actions/actionNewPassword';
import { RemoveParams } from '@/_components/layout/removeParams';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/_components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { InputPassword } from '@/_components/ui/inputPass';
import { useAlertHook } from '@/_hooks/alert_hook';
import { newPasswordFormData, newPasswordSchema } from '@/_schema/newPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

export function NewPassword() {
  const methods = useForm<newPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      checkPassword: '',
    },
  });
  const router = useRouter();
  const { isPending, execute } = useServerAction(actionNewPassword);
  const { openError } = useAlertHook();

  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token');

  const [token, setToken] = useState(initialToken);
  const [isDialogOpen, setIsDialogOpen] = useState(!!initialToken);

  if (!token) {
    return null;
  }

  async function submitNewPassword({
    password,
    checkPassword,
  }: newPasswordFormData) {
    const [error] = await execute({ password, checkPassword, token });
    if (error) {
      console.log('Erro ao alterar a senha', error);
      openError(
        error.message || 'Erro desconhecido ao salvar a senha do usuário.',
        'Atenção!',
        'error'
      );
      return;
    }

    setIsDialogOpen(false);
  }

  return (
    <RemoveParams>
      <Dialog
        open={isDialogOpen}
        onOpenChange={open => {
          if (!open) {
            setToken(null);
          }
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="border-2 shadow-2xl border-primary w-full sm:w-3/4 lg:w-2/4 xl:w-1/3 2xl:w-1/4">
          <DialogHeader>
            <DialogDescription className="flex flex-col font-semibold w-full text-base">
              <span>Quase lá!</span>
              <span>
                Escolha uma nova senha para proteger sua conta. Basta preencher
                os campos abaixo.
              </span>
            </DialogDescription>
          </DialogHeader>

          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(submitNewPassword)}
              className="flex flex-col w-full"
            >
              <FormField
                control={methods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha:</FormLabel>
                    <FormControl>
                      <InputPassword
                        id="password"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="checkPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme sua senha:</FormLabel>
                    <FormControl>
                      <InputPassword
                        id="checkPassword"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-2">
                <DialogClose asChild>
                  <Button variant="outline" className="w-full sm:w-32">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" className="w-full sm:w-32">
                  Alterar senha
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </RemoveParams>
  );
}

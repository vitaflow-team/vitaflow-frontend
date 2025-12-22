'use client';

import { actionResetPassword } from '@/_actions/users/postResetPassword';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/_components/ui/alert-dialog';
import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import {
  resetPasswordFormDate,
  resetPasswordSchema,
} from '@/_schema/resetPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

export default function ResetPassword() {
  const { execute } = useServerAction(actionResetPassword);

  const methods = useForm<resetPasswordFormDate>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function submitResetPassword(values: resetPasswordFormDate) {
    await execute(values);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="w-full text-center">
          <Button variant="link" size="default">
            Esqueci minha senha
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col justify-center items-center content-center w-full">
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(submitResetPassword)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Esqueci minha senha</AlertDialogTitle>
                <AlertDialogDescription className="py-2">
                  Digite seu endereço de e-mail abaixo e enviaremos um link para
                  você criar uma nova senha.
                </AlertDialogDescription>
                <FormField
                  control={methods.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail:</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          icon={Mail}
                          placeholder="E-mail"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 mt-4">
                <AlertDialogCancel className="w-full sm:w-32">
                  Fechar
                </AlertDialogCancel>
                <AlertDialogAction type="submit" className="w-full sm:w-32">
                  Enviar
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

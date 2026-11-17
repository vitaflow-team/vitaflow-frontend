'use client';

import { acceptStaffInvitation } from '@/_actions/backoffice/acceptStaffInvitation';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { InputPassword } from '@/_components/ui/inputPass';
import {
  acceptStaffInvitationSchema,
  type AcceptStaffInvitationFormData,
} from '@/_schema/backoffice';
import type { BackofficeTier } from '@/_types/backofficeStaff';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import {
  AcceptInvitationIntro,
  AcceptInvitationSuccess,
  PasswordRecoveryHint,
} from './acceptBackofficeStaffViews';

const passwordOnlySchema = acceptStaffInvitationSchema.pick({ password: true });

interface PasswordFormProps {
  methods: UseFormReturn<AcceptStaffInvitationFormData>;
  isPending: boolean;
  errorMessage: string | null;
  onSubmit: (values: AcceptStaffInvitationFormData) => Promise<void>;
}

function PasswordForm({
  methods,
  isPending,
  errorMessage,
  onSubmit,
}: PasswordFormProps) {
  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2"
        noValidate
      >
        <FormField
          control={methods.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha da sua conta:</FormLabel>
              <FormControl>
                <InputPassword
                  {...field}
                  autoComplete="current-password"
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormError message={errorMessage} />
        <Button
          type="submit"
          className="w-full py-6 text-lg"
          disabled={isPending}
        >
          {isPending ? 'Confirmando...' : 'Aceitar convite'}
        </Button>
      </form>
    </Form>
  );
}

interface AcceptBackofficeStaffProps {
  token: string;
  tier: BackofficeTier;
  googleLinked: boolean;
}

/**
 * The person accepts by typing the password of the account they already
 * have (US-008). A wrong password leaves the form in place for another try.
 */
export function AcceptBackofficeStaff({
  token,
  tier,
  googleLinked,
}: AcceptBackofficeStaffProps) {
  const { execute, isPending, isSuccess, error } = useServerAction(
    acceptStaffInvitation
  );
  const methods = useForm<AcceptStaffInvitationFormData>({
    resolver: zodResolver(passwordOnlySchema),
    defaultValues: { password: '' },
  });

  if (isSuccess) return <AcceptInvitationSuccess />;

  async function submit({ password }: AcceptStaffInvitationFormData) {
    await execute({ token, password });
  }

  return (
    <>
      <AcceptInvitationIntro tier={tier} googleLinked={googleLinked} />
      <PasswordForm
        methods={methods}
        isPending={isPending}
        errorMessage={error ? error.message : null}
        onSubmit={submit}
      />
      <PasswordRecoveryHint />
    </>
  );
}

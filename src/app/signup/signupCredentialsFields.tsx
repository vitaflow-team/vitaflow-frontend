'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { InputPassword } from '@/_components/ui/inputPass';
import type { signUpFormData } from '@/_schema/signup';
import { Mail } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface SignupCredentialFieldProps {
  name: 'name' | 'email' | 'password' | 'checkPassword';
  label: string;
  disabled: boolean;
  variant: 'text' | 'email' | 'password';
}

/** One labelled signup input: plain text, e-mail with its icon, or password. */
export function SignupCredentialField({
  name,
  label,
  disabled,
  variant,
}: SignupCredentialFieldProps) {
  const { control } = useFormContext<signUpFormData>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {variant === 'password' ? (
              <InputPassword {...field} disabled={disabled} />
            ) : (
              <Input
                {...field}
                icon={variant === 'email' ? Mail : undefined}
                disabled={disabled}
              />
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
}

interface SignupCredentialsFieldsProps {
  disabled: boolean;
}

/** Name, e-mail, password and its confirmation. */
export function SignupCredentialsFields({
  disabled,
}: SignupCredentialsFieldsProps) {
  return (
    <>
      <SignupCredentialField
        name="name"
        label="Nome:"
        disabled={disabled}
        variant="text"
      />
      <SignupCredentialField
        name="email"
        label="E-mail:"
        disabled={disabled}
        variant="email"
      />
      <SignupCredentialField
        name="password"
        label="Senha:"
        disabled={disabled}
        variant="password"
      />
      <SignupCredentialField
        name="checkPassword"
        label="Confirme sua senha:"
        disabled={disabled}
        variant="password"
      />
    </>
  );
}

'use client';

import { Checkbox } from '@/_components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import type { signUpFormData } from '@/_schema/signup';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

interface PolicyLinkProps {
  href: '/terms' | '/privacy';
  children: ReactNode;
}

/** Legal document link, opened in a new tab so the form keeps its values. */
export function PolicyLink({ href, children }: PolicyLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-primary"
    >
      {children}
    </Link>
  );
}

interface SignupConsentFieldProps {
  name: 'termsAccepted' | 'healthDataConsent';
  disabled: boolean;
  children: ReactNode;
}

/** A consent checkbox; `children` is its label text. */
export function SignupConsentField({
  name,
  disabled,
  children,
}: SignupConsentFieldProps) {
  const { control } = useFormContext<signUpFormData>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-row items-start gap-2 mt-2 mb-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={checked => field.onChange(checked === true)}
              disabled={disabled}
            />
          </FormControl>
          <FormLabel className="h-auto font-normal leading-snug">
            {children}
          </FormLabel>
        </FormItem>
      )}
    />
  );
}

interface SignupTermsFieldProps {
  disabled: boolean;
}

/** Acceptance of the Terms of Use and the Privacy Policy. */
export function SignupTermsField({ disabled }: SignupTermsFieldProps) {
  return (
    <SignupConsentField name="termsAccepted" disabled={disabled}>
      Li e aceito os <PolicyLink href="/terms">Termos de Uso</PolicyLink> e a{' '}
      <PolicyLink href="/privacy">Política de Privacidade</PolicyLink>.
    </SignupConsentField>
  );
}

/** Consent to process the health data the user will record. */
export function SignupHealthConsentField({ disabled }: SignupTermsFieldProps) {
  return (
    <SignupConsentField name="healthDataConsent" disabled={disabled}>
      Autorizo o tratamento dos meus dados de saúde (peso, altura, medidas,
      treinos e alimentação) que eu vier a registrar na plataforma, conforme a{' '}
      <PolicyLink href="/privacy">Política de Privacidade</PolicyLink>.
    </SignupConsentField>
  );
}

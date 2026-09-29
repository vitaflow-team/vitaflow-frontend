'use client';

import { Card, CardTitle } from '@/_components/ui/card';
import { formatPhone } from '@/_lib/stringUtils';
import { Mail } from 'lucide-react';
import { ProfileTextField } from './profileTextField';

interface PersonalDataFieldsProps {
  disabled: boolean;
}

/** "Dados pessoais" card: name, e-mail, birth date and phone. */
export function PersonalDataFields({ disabled }: PersonalDataFieldsProps) {
  return (
    <Card className="h-fit gap-3 p-5">
      <CardTitle className="text-base">Dados pessoais</CardTitle>

      <ProfileTextField
        name="name"
        label="Nome"
        id="name"
        disabled={disabled}
      />

      <ProfileTextField
        name="email"
        label="E-Mail"
        id="email"
        disabled={disabled}
        icon={Mail}
      />

      <div className="grid gap-x-4 sm:grid-cols-2">
        <ProfileTextField
          name="birthDate"
          label="Data de nascimento"
          id="birthDate"
          disabled={disabled}
          type="date"
          max={new Date().toISOString().split('T')[0]}
        />

        <ProfileTextField
          name="phone"
          label="Telefone"
          id="phone"
          disabled={disabled}
          formatOnBlur={formatPhone}
        />
      </div>
    </Card>
  );
}

'use client';

import { Card, CardTitle } from '@/_components/ui/card';
import { formatCep } from '@/_lib/stringUtils';
import { ProfileTextField } from './profileTextField';

interface AddressFieldsProps {
  disabled: boolean;
}

/** Postal code and state side by side, then the city. */
export function AddressLocationFields({ disabled }: AddressFieldsProps) {
  return (
    <>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <ProfileTextField
          name="address.postalCode"
          label="CEP"
          id="postalCode"
          disabled={disabled}
          formatOnBlur={formatCep}
        />
        <ProfileTextField
          name="address.region"
          label="Estado"
          id="region"
          disabled={disabled}
        />
      </div>

      <ProfileTextField
        name="address.city"
        label="Cidade"
        id="city"
        disabled={disabled}
      />
    </>
  );
}

/** "Endereço" card: street, complement, district, postal code, state and city. */
export function AddressFields({ disabled }: AddressFieldsProps) {
  return (
    <Card className="h-fit gap-3 p-5">
      <CardTitle className="text-base">Endereço</CardTitle>

      <ProfileTextField
        name="address.addressLine1"
        label="Endereço"
        id="addressLine1"
        disabled={disabled}
      />

      <div className="grid gap-x-4 sm:grid-cols-2">
        <ProfileTextField
          name="address.addressLine2"
          label="Complemento"
          id="addressLine2"
          disabled={disabled}
        />
        <ProfileTextField
          name="address.district"
          label="Bairro"
          id="district"
          disabled={disabled}
        />
      </div>

      <AddressLocationFields disabled={disabled} />
    </Card>
  );
}

'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { useFormContext, useWatch } from 'react-hook-form';

interface CompetenceMonthFieldProps {
  disabled: boolean;
}

/** One native month picker backing the schema's separate year/month fields. */
export function CompetenceMonthField({ disabled }: CompetenceMonthFieldProps) {
  const { control, setValue } = useFormContext<{
    competenceYear: number;
    competenceMonth: number;
  }>();
  const year = useWatch({ control, name: 'competenceYear' });

  return (
    <FormField
      control={control}
      name="competenceMonth"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>Competência</FormLabel>
          <FormControl>
            <Input
              type="month"
              value={`${year}-${String(field.value).padStart(2, '0')}`}
              onChange={event => {
                const [year, month] = event.target.value.split('-').map(Number);
                setValue('competenceYear', year);
                setValue('competenceMonth', month);
              }}
              disabled={disabled}
              required
              aria-required="true"
            />
          </FormControl>
          <FormMessage role="alert" />
        </FormItem>
      )}
    />
  );
}

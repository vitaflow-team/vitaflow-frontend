import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import type { AcademiaEmployment } from '@/_types/academia';
import { WEEKDAY_LABELS, WEEKDAYS } from '@/_lib/turmaSchedule';
import type { Control, FieldValues, Path } from 'react-hook-form';

const UNASSIGNED = '';

interface TurmaFormFieldsProps<T extends FieldValues> {
  control: Control<T>;
  disabled: boolean;
  includeEducatorPicker?: boolean;
  employments?: AcademiaEmployment[];
}

export function TurmaFormFields<T extends FieldValues>({
  control,
  disabled,
  includeEducatorPicker,
  employments = [],
}: TurmaFormFieldsProps<T>) {
  return (
    <>
      <FormField
        control={control}
        name={'name' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da turma</FormLabel>
            <FormControl>
              <Input {...field} disabled={disabled} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={'weekday' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dia da semana</FormLabel>
            <FormControl>
              <select
                {...field}
                disabled={disabled}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {WEEKDAYS.map(weekday => (
                  <option key={weekday} value={weekday}>
                    {WEEKDAY_LABELS[weekday]}
                  </option>
                ))}
              </select>
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex gap-3">
        <FormField
          control={control}
          name={'startTime' as Path<T>}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Início</FormLabel>
              <FormControl>
                <Input {...field} type="time" disabled={disabled} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={'durationMinutes' as Path<T>}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Duração (min)</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={1} disabled={disabled} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name={'capacity' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacidade</FormLabel>
            <FormControl>
              <Input {...field} type="number" min={1} disabled={disabled} />
            </FormControl>
          </FormItem>
        )}
      />
      {includeEducatorPicker && (
        <FormField
          control={control}
          name={'professionalId' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Educador responsável</FormLabel>
              <FormControl>
                <select
                  {...field}
                  disabled={disabled}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value={UNASSIGNED}>Sem responsável</option>
                  {employments.map(employment => (
                    <option
                      key={employment.educatorId}
                      value={employment.educatorId}
                    >
                      {employment.educator.name}
                    </option>
                  ))}
                </select>
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </>
  );
}

'use client';

import { Button } from '@/_components/ui/button';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { Checkbox } from '@/_components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { Title } from '@/_components/ui/title';
import { formatDateToISO } from '@/_lib/formatDateToISO';
import { workoutFormData, workoutSchema } from '@/_schema/workout';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function FormWorkout() {
  const methods = useForm<workoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      id: undefined,
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      daysOfWeek: [],
      warmUp: '',
      restBetweenExercises: 0,
      exercises: [
        {
          name: '',
          videoLink: '',
          variations: [
            {
              weight: 0,
              reps: 0,
              restBetweenReps: 0,
            },
          ],
        },
      ],
    },
  });

  const DAYS_OF_WEEK = [
    { id: 'Sun', label: 'Domingo' },
    { id: 'Mon', label: 'Segunda-feira' },
    { id: 'Tue', label: 'Terça-feira' },
    { id: 'Wed', label: 'Quarta-feira' },
    { id: 'Thu', label: 'Quinta-feira' },
    { id: 'Fri', label: 'Sexta-feira' },
    { id: 'Sat', label: 'Sábado' },
  ] as const;

  async function submitWorking({ description }: workoutFormData) {}

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitWorking)}
        className="flex flex-col w-full gap-2 p-1"
      >
        <Title styled="form" label="Cadastro de treinos">
          <div className="flex gap-2 py-2 md:py-0 w-full justify-between md:justify-end">
            <Button type="submit" className="w-32">
              Salvar
            </Button>
            <ButtonLink
              url="/restrict/workouts"
              label="Cancelar"
              className="w-32"
            />
          </div>
        </Title>

        <div className="grid grid-rows-2 md:grid-rows-none md:grid-cols-4 xl:grid-cols-6 md:gap-4 w-full">
          <FormField
            control={methods.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2 xl:col-span-3">
                <FormLabel>Descrição do treino</FormLabel>
                <FormControl>
                  <Input id="description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="warmUp"
            render={({ field }) => (
              <FormItem className="md:col-span-2 xl:col-span-3">
                <FormLabel>Aquecimento</FormLabel>
                <FormControl>
                  <Input id="warmUp" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:grid grid-rows-2 md:grid-rows-none md:grid-cols-4 xl:grid-cols-6 md:gap-x-4 w-full">
          <FormField
            control={methods.control}
            name="daysOfWeek"
            render={({ field }) => (
              <FormItem className="relative col-span-full xl:col-span-3 w-full">
                <FormLabel>Selecione os dias do treino</FormLabel>
                <div className="w-full rounded-md border border-input px-4 md:col-span-3 min-h-28 gap-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-0 py-3 items-center content-between">
                    {DAYS_OF_WEEK.map(day => (
                      <FormItem
                        key={day.id}
                        className="flex flex-row items-center gap-2 m-0 min-h-10"
                      >
                        <FormControl>
                          <Checkbox
                            id={day.id}
                            checked={field.value.includes(day.id)}
                            onCheckedChange={checked => {
                              if (checked) {
                                field.onChange([...field.value, day.id]);
                              } else {
                                field.onChange(
                                  field.value.filter(value => value !== day.id)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <Label htmlFor={day.id}>{day.label}</Label>
                      </FormItem>
                    ))}
                  </div>
                </div>
              </FormItem>
            )}
          />
          <div className="col-span-full xl:col-span-3 w-full">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={methods.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data inicial</FormLabel>
                    <FormControl>
                      <Input
                        id="startDate"
                        type="date"
                        {...field}
                        value={field.value ? formatDateToISO(field.value) : ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data final</FormLabel>
                    <FormControl>
                      <Input
                        id="endDate"
                        type="date"
                        {...field}
                        value={field.value ? formatDateToISO(field.value) : ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={methods.control}
                name="restBetweenExercises"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intervalo (seg)</FormLabel>
                    <FormControl>
                      <Input
                        id="restBetweenExercises"
                        type="number"
                        placeholder="Intervalo (seg)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>

      <Title size="h2" styled="form" label="Exercícios" className="flex-row">
        <Button variant="link">Adicionar</Button>
      </Title>
    </Form>
  );
}

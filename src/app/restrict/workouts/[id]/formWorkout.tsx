'use client';

import { Button } from '@/_components/ui/button';
import { ButtonLink } from '@/_components/ui/buttonLink';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/_components/ui/form';
import { Textarea } from '@/_components/ui/textarea';
import { Title } from '@/_components/ui/title';
import { workoutFormData, workoutSchema } from '@/_schema/workout';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function FormWorkout() {
  const methods = useForm<workoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      description: '',
    },
  });

  async function submitWorking({ description }: workoutFormData) {}

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitWorking)}
        className="flex flex-col w-full gap-2"
      >
        <Title
          label="Adicionar treinos"
          className="flex items-center justify-between border-b border-primary text-left py-1"
        >
          <div className="flex gap-2">
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

        <FormField
          control={methods.control}
          name="description"
          render={({ field }) => (
            <FormItem className="h-40">
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Informe a descrição do treino"
                  rows={3}
                  className="h-20 bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

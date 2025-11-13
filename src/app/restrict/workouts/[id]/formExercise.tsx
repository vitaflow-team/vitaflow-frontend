'use client';

import { ModalAdd } from '@/_components/layout/modalAdd';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { zodResolverFixed } from '@/_lib/zodResolverHelper';
import { exerciseFormData, exerciseSchema } from '@/_schema/exercise';
import { useForm } from 'react-hook-form';

export default function FormExercice() {
  const methods = useForm<exerciseFormData, undefined, exerciseFormData>({
    resolver: zodResolverFixed(exerciseSchema),
    defaultValues: {
      name: '',
      videoLink: '',
      weight: 0,
      reps: 0,
      restBetweenReps: 0,
    },
  });

  async function submitExercice({
    name,
    videoLink,
    weight,
    reps,
    restBetweenReps,
  }: exerciseFormData) {
    console.log(name, videoLink, weight, reps, restBetweenReps);
    return;
  }

  const formId = 'exercise-form';

  return (
    <ModalAdd title="Exercício" formId={formId}>
      <Form {...methods}>
        <form
          id={formId}
          onSubmit={methods.handleSubmit(submitExercice)}
          className="flex flex-col w-full gap-2 p-1"
        >
          <div className="grid grid-cols-3 gap-x-4 w-full">
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Exercício:</FormLabel>
                  <FormControl>
                    <Input id="name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="videoLink"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Link:</FormLabel>
                  <FormControl>
                    <Input id="videoLink" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="col-span-3 md:col-span-1">
                  <FormLabel>Peso:</FormLabel>
                  <FormControl>
                    <Input
                      id="weight"
                      type="number"
                      inputMode="numeric"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="reps"
              render={({ field }) => (
                <FormItem className="col-span-3 md:col-span-1">
                  <FormLabel>Repetições:</FormLabel>
                  <FormControl>
                    <Input
                      id="reps"
                      type="number"
                      inputMode="numeric"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="restBetweenReps"
              render={({ field }) => (
                <FormItem className="col-span-3 md:col-span-1">
                  <FormLabel>Intervalo:</FormLabel>
                  <FormControl>
                    <Input
                      id="restBetweenReps"
                      type="number"
                      inputMode="numeric"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </ModalAdd>
  );
}

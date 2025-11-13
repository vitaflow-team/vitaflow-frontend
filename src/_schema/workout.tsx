import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';
import { exerciseSchema } from './exercise';

export const workoutSchema = z
  .object({
    id: z.string().optional(),
    description: z
      .string()
      .min(2, 'Obrigatório')
      .max(200, 'Descrição muito longa'),
    startDate: z.date('Obrigatório'),
    endDate: z.date('Obrigatório'),
    daysOfWeek: z
      .array(z.enum(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']))
      .min(1, 'Mínimo um dia da semana'),
    warmUp: z.string().optional(),
    restBetweenExercises: z
      .number()
      .min(0, 'Tempo de descanso inválido')
      .optional(),
    exercises: z
      .array(z.object(exerciseSchema))
      .min(1, 'Adicione pelo menos um exercício'),
  })
  .refine(data => data.endDate >= data.startDate, {
    message: 'Deve ser maior ou igual à inicial',
    path: ['endDate'],
  });

export type workoutFormData = z.infer<typeof workoutSchema>;

export const workoutColumnDef: ColumnDef<workoutFormData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div>{row.getValue('id')}</div>;
    },
    size: 60,
    minSize: 60,
    meta: {
      align: 'right',
      mobile: false,
    },
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => {
      return <div>{row.getValue('description')}</div>;
    },
    meta: {
      align: 'left',
      mobile: true,
    },
  },
];

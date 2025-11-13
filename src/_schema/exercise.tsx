import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

export const exerciseSchema = z.object({
  name: z.string().min(1, 'Obrigatório'),
  videoLink: z.url('Link do vídeo inválido').optional().or(z.literal('')),
  weight: z.coerce.number().min(0, 'Inválido'),
  reps: z.coerce.number().min(0, 'Inválido'),
  restBetweenReps: z.coerce.number().min(0, 'Tempo de descanso inválido'),
});

export type exerciseFormData = z.infer<typeof exerciseSchema>;

export const exerciseColumnDef: ColumnDef<exerciseFormData>[] = [
  {
    accessorKey: 'name',
    header: 'Exercício',
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
    meta: {
      align: 'left',
      mobile: true,
    },
  },
  {
    accessorKey: 'weight',
    header: 'Peso',
    cell: ({ row }) => {
      return <div>{row.getValue('weight')}</div>;
    },
    size: 60,
    meta: {
      align: 'right',
      mobile: true,
    },
  },
  {
    accessorKey: 'reps',
    header: 'Rep.',
    cell: ({ row }) => {
      return <div>{row.getValue('reps')}</div>;
    },
    size: 45,
    meta: {
      align: 'right',
      mobile: true,
    },
  },
  {
    accessorKey: 'restBetweenReps',
    header: 'Int.',
    cell: ({ row }) => {
      return <div>{row.getValue('restBetweenReps')}</div>;
    },
    size: 45,
    meta: {
      align: 'right',
      mobile: true,
    },
  },
];

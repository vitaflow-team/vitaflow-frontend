import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  birthDate: z.string(),
  professionalId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Client = z.infer<typeof clientSchema>;

export const clientColumnDef: ColumnDef<Client>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
  },
];

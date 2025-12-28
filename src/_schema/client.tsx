import { phoneRegex } from '@/_constants/regex';
import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

export const clientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'O nome é obrigatório'),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Inválido')
    .min(10, 'Número muito curto')
    .max(20, 'Número muito longo'),
  email: z.email('Inválido').toLowerCase(),
  birthDate: z
    .string()
    .trim()
    .refine(
      value => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      { message: 'Data inválida' }
    )
    .refine(
      value => {
        const date = new Date(value);
        const maxDate = new Date();
        maxDate.setHours(0, 0, 0, 0);
        maxDate.setDate(maxDate.getDate() - 1);

        return date <= maxDate;
      },
      {
        message: 'Data inválida',
      }
    ),
  professionalId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Client = z.infer<typeof clientSchema>;

export const clientColumnDef: ColumnDef<Client>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    meta: {
      mobile: true,
    },
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'E-Mail',
    size: 240,
    meta: {
      align: 'left',
      mobile: false,
    },
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
    size: 140,
    meta: {
      align: 'right',
      mobile: true,
    },
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
  },
];

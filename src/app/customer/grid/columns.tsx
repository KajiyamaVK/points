'use client'

import { ColumnDef } from '@tanstack/react-table'
import { SortedGridHeader } from '@/components/ui/sortedGridHeader'
import { ICustomer } from '../newCustomer/formSchema'

export const columns: ColumnDef<ICustomer>[] = [
  {
    accessorKey: 'cpf',
    header: 'CPF',
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => <SortedGridHeader column={column} label="Nome" />,
  },
  {
    header: 'Telefone',
    accessorKey: 'tel',
  },
  {
    header: 'Pontos disponíveis',
    accessorKey: 'points',
  },
]

import { z } from 'zod'
import { formatNumber, validateCPF } from '@/app/customer/newCustomer/functions'

export const ZCustomer = z.object({
  id: z.number().optional(),
  customerName: z.string({ required_error: 'Nome é obrigatório' }).min(1, { message: 'Nome é obrigatório' }),
  cpf: z
    .string()
    .optional()
    .refine(
      (cpf) => {
        if (!cpf || formatNumber(cpf).length === 11) {
          return true
        } else {
          return false
        }
      },
      { message: 'CPF deve ter 11 dígitos' },
    )
    .refine(
      (cpf) => {
        if (cpf && formatNumber(cpf)?.length === 11) return validateCPF(cpf)
        return true
      },
      { message: 'CPF inválido' },
    ),

  tel: z
    .string()
    .optional()
    .refine(
      (tel) => {
        if (!tel || formatNumber(tel).length === 11 || formatNumber(tel).length === 10) {
          return true
        } else {
          return false
        }
      },
      { message: 'Telefone deve ter 11 dígitos' },
    ),
  points: z.string(),
})

export type ICustomer = z.infer<typeof ZCustomer>

export const formSchema = ZCustomer.extend({
  pointsAvailable: z.string(),
})

export type IForm = z.infer<typeof formSchema>

import { Dispatch, SetStateAction, useContext, useEffect } from 'react'
import { ZCustomer } from './formSchema'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { formatCPF, formatPhone } from './functions'
import { GeneralContext } from '@/generalContext'

interface IDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function NewCustomerDialog({ open, setOpen }: IDialogProps) {
  const form = useForm({
    resolver: zodResolver(ZCustomer),
    defaultValues: {
      customerName: '',
      cpf: '',
      tel: '',
      points: '',
    },
  })

  const { openAlert } = useContext(GeneralContext)

  useEffect(() => {
    if (open) {
      form.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    form.setValue('cpf', formatCPF(form.getValues('cpf')))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('cpf')])

  useEffect(() => {
    form.setValue('tel', formatPhone(form.getValues('tel')))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('tel')])

  async function saveCustomer() {
    const customer = form.getValues()

    try {
      if (!navigator.onLine) throw new Error('Sem conexão com a internet')
      await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      }).then((res) => {
        if (res.status === 201) {
          openAlert({ message: 'Cliente cadastrado com sucesso', type: 'success' })
          form.reset()
          setOpen(false)
        } else {
          res.json().then((data) => {
            console.error('Evento inesperado:', data.message)
            openAlert({ message: data.message, type: 'error' })
          })
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error:', error.message)
      openAlert({ message: error.message, type: 'error' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-white">
        <DialogHeader className={`bg-primary  text-primary-foreground p-2`}>
          <DialogTitle className="text-primary-foreground pt-2">Novo cadastro</DialogTitle>
          <DialogClose className="text-white" />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveCustomer)}>
            <div className="flex flex-col gap-3 mx-5">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <Label>Nome do cliente</Label>

                    <FormControl>
                      <Input autoFocus {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.customerName?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <Label>CPF</Label>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.cpf?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tel"
                render={({ field }) => (
                  <FormItem>
                    <Label>Telefone</Label>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.tel?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <Label>Pontos iniciais</Label>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.points?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="p-5">
              <Button type="button" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

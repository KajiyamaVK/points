import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { ICustomer } from '../newCustomer/formSchema'

export type TAction = 'add' | 'remove'

interface IDialogProps {
  open: boolean
  customer: ICustomer
  action: TAction
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function CustomerDialog({ open, setOpen, customer, action }: IDialogProps) {
  const [points, setPoints] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    setPoints('')
    setErrorMessage('')
  }, [open])

  async function savePoints() {
    if (parseInt(points) < 0) {
      setErrorMessage('Não é possível adicionar pontos negativos')
      return
    } else if (action === 'remove' && parseInt(points) > parseInt(customer.points)) {
      setErrorMessage('Não é possível remover mais pontos do que o cliente possui')
      return
    } else if (parseInt(points) === 0) {
      setErrorMessage('Valor não pode ser zero')
      return
    } else if (!points || !customer.points) {
      setErrorMessage('Valor não pode ser vazio')
      return
    }
    await fetch(`/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pointsQty: parseInt(points),
        customerId: customer.id,
        action,
        points: parseInt(customer.points),
      }),
    })
      .then(() => setOpen(false))
      .catch((error) => alert('Error: ' + error))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-white">
        <DialogHeader className={`${action === 'add' ? 'bg-primary' : 'bg-destructive'} text-primary-foreground p-2`}>
          <DialogTitle className="text-primary-foreground pt-2">
            {action === 'add' ? 'Adicionando ' : 'Removendo '} pontos
          </DialogTitle>
          <DialogClose className="text-white" />
        </DialogHeader>
        <DialogDescription className="p-5">
          <div className="flex flex-col gap-3 ">
            <span className="flex gap-2 items-end">
              <span className="text-xl">{customer.customerName}</span>(<b>Saldo atual: </b>
              {customer.points} ponto(s) )
            </span>
            <label htmlFor="#points" className="font-bold">
              {action === 'add' ? 'Adicionar ' : 'Remover '} quantos pontos?
            </label>
            <input
              type="number"
              id="points"
              autoFocus
              style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
              className="border rounded-md leading-10 max-w-[300px] p-2 text-lg"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              onKeyDown={(e) => {
                ;(e.key === 'Enter' && savePoints()) || (e.key === 'Escape' && setOpen(false))
              }}
            />
            {errorMessage && <span className="text-red-500">{errorMessage}</span>}
            <span>
              Aperte <b>enter</b> para salvar
            </span>
          </div>
        </DialogDescription>
        <DialogFooter className="p-5">
          <Button className={`${action === 'remove' && 'bg-destructive'}`} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button className={`${action === 'remove' && 'bg-destructive'}`} onClick={savePoints}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

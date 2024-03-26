'use client'

import { ReactNode, useContext } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { GeneralContext } from '@/generalContext'
import { Button } from './ui/button'

export function AlertDialog() {
  const { isOpenAlertOpen, alertParams, setIsOpenAlertOpen } = useContext(GeneralContext)

  interface IAlertData {
    title: string
    message: string
    tailwindColor?: string
  }

  const alertData: IAlertData = {} as IAlertData
  switch (alertParams?.type) {
    case 'success':
      alertData.title = 'Sucesso'
      alertData.tailwindColor = 'bg-primary'
      break
    case 'error':
      alertData.title = 'Erro'
      alertData.tailwindColor = 'bg-destructive'
      break
    case 'warning':
      alertData.title = 'Atenção'
      alertData.tailwindColor = 'bg-yellow-500'
      break
    case 'info':
      alertData.title = 'Informação'
      alertData.tailwindColor = 'bg-primary'
      break
    case 'YN':
      alertData.title = 'Confirmação'
      alertData.tailwindColor = 'bg-primary'
      break
  }

  alertData.message = alertParams?.message || ''

  let footerContent: ReactNode = [] as ReactNode
  switch (alertParams?.type) {
    case 'success':
    case 'error':
    case 'warning':
    case 'info':
      footerContent = (
        <DialogFooter>
          <DialogClose>
            <Button>OK</Button>
          </DialogClose>
        </DialogFooter>
      )
      break

    case 'YN':
      footerContent = (
        <DialogFooter>
          <DialogClose>
            <Button>Sim</Button>
          </DialogClose>
          <DialogClose>
            <Button>Não</Button>
          </DialogClose>
        </DialogFooter>
      )
      break
  }

  return (
    <Dialog open={isOpenAlertOpen} onOpenChange={setIsOpenAlertOpen}>
      <DialogContent className="bg-white p-0">
        <DialogHeader className={`${alertData.tailwindColor} p-3 text-white`}>
          <DialogTitle>{alertData.title}</DialogTitle>
        </DialogHeader>
        <div className="p-5">
          {alertData.message}
          {footerContent}
        </div>
      </DialogContent>
    </Dialog>
  )
}

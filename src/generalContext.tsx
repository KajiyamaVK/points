'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react'

type alertType = 'success' | 'error' | 'warning' | 'info' | 'YN'

interface IAlert {
  message: string
  type: alertType
}

interface IGeneralContext {
  openAlert: ({ message, type }: IAlert) => void
  isOpenAlertOpen: boolean
  setIsOpenAlertOpen: Dispatch<SetStateAction<boolean>>
  alertParams?: IAlert
}

export const GeneralContext = createContext({} as IGeneralContext)

export function GeneralProvider({ children }: { children: ReactNode }) {
  const [isOpenAlertOpen, setIsOpenAlertOpen] = useState<boolean>(false)
  const [alertParams, setAlertParams] = useState<IAlert>()
  function openAlert({ message, type }: IAlert) {
    setIsOpenAlertOpen(true)
    setAlertParams({ message, type })
  }

  return (
    <GeneralContext.Provider value={{ openAlert, isOpenAlertOpen, alertParams, setIsOpenAlertOpen }}>
      {children}
    </GeneralContext.Provider>
  )
}

'use client'

import { ICustomer } from '../newCustomer/formSchema'
import { ReactNode, useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Minus, Plus } from '@phosphor-icons/react'
import { CustomerDialog, TAction } from './dialog'
import { Button } from '@/components/ui/button'
import { NewCustomerDialog } from '../newCustomer/newCustomerDialog'
import { formatCPF, formatPhone } from '../newCustomer/functions'

export default function CustomerGrid() {
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer>({} as ICustomer)
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([])
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [skeleton, setSkeleton] = useState<ReactNode>([])
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState<boolean>(false)
  const [action, setAction] = useState<TAction>('add')

  useEffect(() => {
    renderSkeleton()
    if (customers.length === 0) fetchCustomers()
  }, [customers])

  useEffect(() => {
    setFilteredCustomers(
      customers.filter((customer) =>
        Object.values(customer).some((value) =>
          value.toString().toLowerCase().includes(searchInputValue.toLowerCase()),
        ),
      ),
    )

    if (customers.length > 0) setIsLoading(false)
  }, [searchInputValue, customers])

  useEffect(() => {
    fetchCustomers()
  }, [isDialogOpen, isNewCustomerDialogOpen])

  async function fetchCustomers() {
    try {
      if (!navigator.onLine) throw new Error('Sem conexão com a internet')
      const response = await fetch('/api/customers')
      const data = await response.json()
      setCustomers(data)
      // Logging the data received from the fetch request
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  function renderSkeleton() {
    let counter = 0
    const tempSkeleton: React.ReactNode[] = []
    while (counter < 10) {
      tempSkeleton.push(
        <tr key={`skeleton-${counter}`}>
          <td>
            <Skeleton className="w-32 h-5 bg-gray-300 m-2" />
          </td>
          <td>
            <Skeleton className="w-32 h-5 bg-gray-300 m-2" />
          </td>
          <td>
            <Skeleton className="w-32 h-5 bg-gray-300 m-2" />
          </td>
          <td>
            <Skeleton className="w-32 h-5 bg-gray-300 m-2" />
          </td>
        </tr>,
      )
      counter++
    }
    setSkeleton(tempSkeleton)
  }

  return (
    <div className="w-full  flex p-10 flex-col">
      <CustomerDialog open={isDialogOpen} setOpen={setIsDialogOpen} customer={selectedCustomer} action={action} />
      <NewCustomerDialog open={isNewCustomerDialogOpen} setOpen={setIsNewCustomerDialogOpen} />
      <h1 className="mb-10">Clientes</h1>
      <input
        type="text"
        placeholder="Pesquisar cliente"
        className="border border-gray-500 p-3 rounded-lg max-w-[500px]"
        value={searchInputValue}
        onChange={(e) => setSearchInputValue(e.target.value)}
      />
      <div className="max-w-[1000px] min-w-[1000px] mx-auto flex flex-col">
        <Button
          className="max-w-[200px] mt-10 float-right self-end mr-10"
          onClick={() => setIsNewCustomerDialogOpen(true)}
        >
          Novo cliente
        </Button>
        <table className="mt-10 border border-gray-500  rounded-lg shadow shadow-gray-500">
          <thead className="text-left  bg-primary text-primary-foreground  border-gray-500 p-5">
            <tr>
              <th className="py-2 pr-2 pl-10">Nome</th>
              <th className="p-2">CPF</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">Pontos</th>
              <th className="p-2"></th> {/*Botões de ação*/}
            </tr>
          </thead>
          <tbody className="bg-white">
            {isLoading && skeleton}
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className=" hover:bg-gray-200 hover:cursor-pointer ">
                <td className="py-2 pr-2 pl-10">{customer.customerName}</td>
                <td className="p-2">{customer.cpf ? formatCPF(customer.cpf) : '-'}</td>
                <td className="p-2">{customer.tel ? formatPhone(customer.tel) : '-'}</td>
                <td className="p-2">{customer.points}</td>
                <td>
                  <button
                    type="button"
                    className="bg-destructive text-primary-foreground p-2 rounded-full mr-2 hover:shadow hover:shadow-black"
                    onClick={() => {
                      setIsDialogOpen(true)
                      setSelectedCustomer(customer)
                      setAction('remove')
                    }}
                  >
                    <Minus />
                  </button>
                  <button
                    type="button"
                    className="bg-primary text-primary-foreground p-2 rounded-full hover:shadow hover:shadow-black"
                    onClick={() => {
                      setIsDialogOpen(true)
                      setSelectedCustomer(customer)
                      setAction('add')
                    }}
                  >
                    <Plus />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

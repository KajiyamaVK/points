import { ICustomer } from '../newCustomer/formSchema'

export async function getCustomers(): Promise<ICustomer[]> {
  const clients: ICustomer[] = await fetch('/api/customers')
    .then((res) => res.json())
    .then((data) => {
      return data
    })

  return clients
}

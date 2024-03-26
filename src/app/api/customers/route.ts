import { NextResponse } from 'next/server'
import mysql, { PoolOptions } from 'mysql2/promise'
import { formatNumber } from '@/app/customer/newCustomer/functions'

const access: PoolOptions = {
  host: 'monorail.proxy.rlwy.net',
  port: 18090,
  user: 'root',
  password: 'GIzHAYFzMCUgCEkmQUyIuCCGaAhLwlOH',
  database: 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

const Conn = mysql.createPool(access)
if (!Conn) {
  console.error('Error connecting to database')
}

export async function GET() {
  try {
    //Conn = await pool.getConnection()

    const [results] = await Conn!.query('SELECT * FROM customers')

    return NextResponse.json(results)
  } catch (error) {
    console.error(`Error fetching customers: ${error}`)
    return NextResponse.json({ error: 'Error fetching customers' }, { status: 500 })
  } finally {
    //if (Conn) Conn.release()
  }
}

export async function POST(req: Request) {
  const customer = await req.json()

  const { customerName, cpf, tel, points } = customer

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows]: any = await Conn.query(
      `
      SELECT 1 as result
      FROM customers
      WHERE cpf = ?
      AND cpf != ''`,
      [formatNumber(cpf)],
    )

    if (rows.length > 0)
      return new Response(JSON.stringify({ message: 'Cliente já cadastrado com este CPF' }), {
        status: 400,
      })
  } catch (error) {
    console.error(`Error fetching customer: ${error}`)
    return NextResponse.json({ error: 'Erro ao verificar o cliente existente.' }, { status: 500 }) // Resposta em caso de erro
  }

  try {
    await Conn.query('INSERT INTO customers (customerName, cpf, tel, points) VALUES (?, ?, ?, ?)', [
      customerName,
      cpf ? formatNumber(cpf) : null,
      formatNumber(tel),
      points,
    ])

    return new Response('Registro criado com sucesso', {
      status: 201,
    })
  } catch (error) {
    console.error(`Error adding customer: ${error}`)
    return NextResponse.json({ error: 'Error adding customer' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import mysql, { PoolOptions } from 'mysql2/promise'

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

type action = 'add' | 'remove'

export async function POST(req: Request) {
  const customer = await req.json()

  const {
    pointsQty,
    action,
    customerId,
    points,
  }: { pointsQty: number; action: action; points: number; customerId: number } = customer

  try {
    await Conn.query(
      `
      UPDATE customers
      SET points = points ${action === 'add' ? '+' : '-'} ?
      WHERE id = ?`,
      [pointsQty, customerId],
    )
    const pointsQtyCorrected = pointsQty * (action === 'add' ? 1 : -1)
    await Conn.query(
      `
      INSERT INTO transactions (customerIdFK, pointsQty, balance)
      VALUES (?, ?, ?)`,
      [customerId, pointsQtyCorrected, points + pointsQtyCorrected],
    )

    return new Response('Registro criado com sucesso', {
      status: 201,
    })
  } catch (error) {
    console.error('Error adding points:', error)
    return NextResponse.json({ error: 'Error adding customer' }, { status: 500 })
  }
}

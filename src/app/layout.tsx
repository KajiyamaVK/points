import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GeneralProvider } from '@/generalContext'
import { AlertDialog } from '@/components/AlertDialog'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pontos de Fidelidade',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <link rel="icon" href="/favicon.png" sizes="any" />
      <body className={inter.className}>
        <GeneralProvider>
          <AlertDialog />
          {children}
        </GeneralProvider>
      </body>
    </html>
  )
}

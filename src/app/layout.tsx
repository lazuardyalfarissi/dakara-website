import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DAKARA - Rock Band from Jakarta',
  description: 'Dakara is a rock band from Jakarta, Indonesia. Introducing rock music as art that deserves to be heard and enjoyed.',
  openGraph: {
    title: 'DAKARA',
    description: 'Rock band from Jakarta, Indonesia',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
import type { Metadata } from 'next'
import { Bebas_Neue, Barlow, Space_Mono, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-barlow',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-dm-serif',
  display: 'swap',
})

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
      <body className={`${bebasNeue.variable} ${barlow.variable} ${spaceMono.variable} ${dmSerifDisplay.variable}`}>
        {children}
      </body>
    </html>
  )
}
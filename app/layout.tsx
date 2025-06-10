import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Online Code Editor',
  description: 'Created By Ajay',
  generator: 'Ajay',
  icons: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

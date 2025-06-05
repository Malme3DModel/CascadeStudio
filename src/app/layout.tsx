import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cascade Studio',
  description: 'A fully integrated Scripted CAD Kernel for the browser.',
  manifest: '/manifest.json',
  themeColor: '#222222',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

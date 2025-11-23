// app/layout.tsx
import Sidebar from '@/components/Sidebar'
import './globals.css'
import { ReactNode } from 'react'
import Head from 'next/head'

export const metadata = {
  title: 'FocusZen-Dashboard',
  description: 'Plan your day and reach your goals',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </Head>
      <body className="flex min-h-screen bg-[#FAF4E4]"  cz-shortcut-listen="true">
        <Sidebar />
        <main className="flex-1 mb-20 mt-20 md:mb-0 md:mt-0 bg-[#FAF4E4]" >{children}</main>
      </body>
    </html>
  )
}

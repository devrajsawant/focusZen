// app/layout.tsx
import Sidebar from '@/components/Sidebar'
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Productivity Dashboard',
  description: 'Plan your day and reach your goals',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100" cz-shortcut-listen="true">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  )
}

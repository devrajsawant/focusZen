'use client'
// components/Sidebar.tsx
import { cn } from '@/utils/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Tasks', href: '/task' },
  { label: 'Day Planner', href: '/planner' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Dsa Tracker', href: '/dsa' },
  { label: 'Pomodoro Timer', href: '/pomodoro' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6">My Productivity</h2>
      <nav className="flex flex-col gap-4">
        {navItems.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition',
              pathname === href && 'bg-gray-300 font-semibold'
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  CalendarIcon, 
  ChartBarIcon,
  CpuChipIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import { Banknote } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="w-5 h-5" /> },
  { label: 'Tasks', href: '/task', icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
  { label: 'Planner', href: '/planner', icon: <CalendarIcon className="w-5 h-5" /> },
  { label: 'Habits', href: '/habits', icon: <ChartBarIcon className="w-5 h-5" /> },
  { label: 'Expense', href: '/expense', icon: <Banknote className="w-5 h-5" /> },
  { label: 'DSA', href: '/dsa', icon: <CpuChipIcon className="w-5 h-5" /> },
]

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on home route
  if (pathname === '/') {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 font-sans bg-white shadow-xl rounded-xl p-4 hidden md:flex flex-col h-screen justify-between border border-gray-200 transition-colors duration-200 sticky top-0">
        <div>
          <div className='flex h-fit mb-8 items-center gap-3 justify-start py-2 border-b border-grey-400'>
          <span><BeakerIcon className="w-6 h-6"/></span>
          <h2 className="text-2xl font-bold  tracking-tight text-gray-900 font-sans">  FocusZen</h2>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map(({ label, href, icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-base font-medium font-sans focus:outline-none tracking-tight',
                  pathname === href
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                tabIndex={0}
              >
                {icon}
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center px-2 py-1">
          {navItems.map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1',
                pathname === href 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <div className={cn(
                'mb-1',
                pathname === href ? 'text-blue-600' : 'text-gray-500'
              )}>
                {icon}
              </div>
              <span className="text-xs font-medium truncate">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom padding for mobile to account for bottom nav */}
      <div className="md:hidden h-20" />
    </>
  )
}

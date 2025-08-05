"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Banknote } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <HomeIcon className="w-5 h-5" /> },
  { label: "Tasks", href: "/task", icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
  { label: "Planner", href: "/planner", icon: <CalendarIcon className="w-5 h-5" /> },
  { label: "Habits", href: "/habits", icon: <ChartBarIcon className="w-5 h-5" /> },
  { label: "Expense", href: "/expense", icon: <Banknote className="w-5 h-5" /> },
];

const mobileMenuItems = [
  { label: "Account", href: "/account", icon: <UserIcon className="w-5 h-5" /> },
  { label: "Settings", href: "/settings", icon: <Cog6ToothIcon className="w-5 h-5" /> },
  { label: "About", href: "/about", icon: <InformationCircleIcon className="w-5 h-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname === "/") return null;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 font-sans bg-white shadow-xl rounded-xl p-4 hidden md:flex flex-col h-screen justify-between border border-gray-200 sticky top-0">
        <div>
          <div className="flex h-fit mb-8 items-center gap-1 justify-start py-2 border-b border-gray-200">
            <Image src="/assets/FocusZenLogo2.png" alt="focusZenLogo" width={32} height={32} />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-sans">FocusZen</h2>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map(({ label, href, icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-base font-medium font-sans focus:outline-none tracking-tight",
                  pathname === href ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {icon}
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/assets/FocusZenLogo2.png" alt="focusZenLogo" width={28} height={28} />
            <h2 className="text-xl font-bold tracking-tight text-gray-900 font-sans">FocusZen</h2>
          </div>
          <button onClick={toggleMobileMenu} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Backdrop (Always Rendered for Smooth Fade) */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 transition-opacity duration-300 ease-in-out",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobileMenu}
      />

      {/* Mobile Sidebar (Always Rendered for Smooth Slide) */}
      <aside
        className={cn(
          "md:hidden fixed top-0 right-0 h-full w-60 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900"></h3>
            <button onClick={closeMobileMenu} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4">
            <nav className="flex flex-col gap-2">
              {mobileMenuItems.map(({ label, href, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-base font-medium font-sans tracking-tight text-gray-700 hover:bg-gray-100"
                >
                  {icon}
                  <span className="truncate">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center px-2 py-1">
          {navItems.map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1",
                pathname === href ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <div className={cn("mb-1", pathname === href ? "text-blue-600" : "text-gray-500")}>{icon}</div>
              <span className="text-xs font-medium truncate">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

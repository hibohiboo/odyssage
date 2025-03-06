"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, Menu, X, Home, BookOpen, PlusCircle, User } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50 border-b border-stone-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-amber-700">
          <Compass className="h-6 w-6" />
          <span>Odyssage</span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md hover:bg-stone-100"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`flex items-center gap-1 hover:text-amber-700 transition-colors ${isActive("/") ? "text-amber-700 font-medium" : "text-stone-600"}`}
          >
            <Home className="h-4 w-4" />
            <span>ホーム</span>
          </Link>
          <Link
            href="/dashboard"
            className={`flex items-center gap-1 hover:text-amber-700 transition-colors ${isActive("/dashboard") ? "text-amber-700 font-medium" : "text-stone-600"}`}
          >
            <BookOpen className="h-4 w-4" />
            <span>シナリオ一覧</span>
          </Link>
          <Link
            href="/create"
            className={`flex items-center gap-1 hover:text-amber-700 transition-colors ${isActive("/create") ? "text-amber-700 font-medium" : "text-stone-600"}`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>新規作成</span>
          </Link>
          <Link
            href="/account"
            className={`flex items-center gap-1 hover:text-amber-700 transition-colors ${isActive("/account") ? "text-amber-700 font-medium" : "text-stone-600"}`}
          >
            <User className="h-4 w-4" />
            <span>アカウント</span>
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 paper-texture">
          <nav className="flex flex-col p-4">
            <Link
              href="/"
              onClick={closeMenu}
              className={`flex items-center gap-2 p-3 rounded-md ${isActive("/") ? "bg-amber-50 text-amber-700" : "text-stone-700"}`}
            >
              <Home className="h-5 w-5" />
              <span>ホーム</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className={`flex items-center gap-2 p-3 rounded-md ${isActive("/dashboard") ? "bg-amber-50 text-amber-700" : "text-stone-700"}`}
            >
              <BookOpen className="h-5 w-5" />
              <span>シナリオ一覧</span>
            </Link>
            <Link
              href="/create"
              onClick={closeMenu}
              className={`flex items-center gap-2 p-3 rounded-md ${isActive("/create") ? "bg-amber-50 text-amber-700" : "text-stone-700"}`}
            >
              <PlusCircle className="h-5 w-5" />
              <span>新規作成</span>
            </Link>
            <Link
              href="/account"
              onClick={closeMenu}
              className={`flex items-center gap-2 p-3 rounded-md ${isActive("/account") ? "bg-amber-50 text-amber-700" : "text-stone-700"}`}
            >
              <User className="h-5 w-5" />
              <span>アカウント</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}


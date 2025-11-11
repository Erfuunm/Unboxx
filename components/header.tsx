
"use client"

import { useState } from 'react'
import { ChevronDown, User } from 'lucide-react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Fetch user on mount
  useState(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  })

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: "#E0E0D4" }}>
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-md transition text-xl"
        style={{ color: "#2d3d2d" }}
      >
        ☰
      </button>

      {/* User Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition"
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
     <span className="text-sm font-medium" style={{ color: "#2d3d2d" }}>
  {user?.email?.split('@')[0] || 'User'}
</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border" style={{ borderColor: "#E0E0D4" }}>
            <Link
              href="/dashboard/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              Edit Profile
            </Link>
            <button
              onClick={async () => {
                const supabase = createSupabaseBrowserClient()
                await supabase.auth.signOut()
                window.location.href = '/login'
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
// app/dashboard/DashboardClient.tsx
"use client"

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import Header from '@/components/header'

export default function DashboardClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#D4D4C8' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6 bg-white">{children}</main>
      </div>
    </div>
  )
}
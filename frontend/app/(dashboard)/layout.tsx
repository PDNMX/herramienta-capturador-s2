"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Navigation } from "@/components/layout/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-government-primary"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className={`flex flex-col ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} transition-all duration-300`}>
        <Header onMenuClick={toggleSidebar} />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <Navigation />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
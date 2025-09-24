"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  FileText,
  Folder,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { NavigationItem } from "@/types"

const navigation: NavigationItem[] = [
  { name: "Inicio", href: "/inicio", icon: Home },
  { name: "Servidores Públicos", href: "/servidores", icon: Users },
  { name: "Contrataciones", href: "/contrataciones", icon: FileText },
  { name: "Expedientes", href: "/expedientes", icon: Folder },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
]

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-white border-r shadow-lg sidebar-transition lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isOpen ? "w-64" : "lg:w-16"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo and toggle */}
          <div className="flex h-14 items-center justify-between border-b px-4">
            <div className={cn("flex items-center space-x-2", !isOpen && "lg:justify-center")}>
              <div className="h-8 w-8 rounded bg-government-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">S2</span>
              </div>
              {isOpen && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-government-primary">
                    Sistema S2
                  </span>
                  <span className="text-xs text-gray-500">
                    Servidores Públicos
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hidden lg:flex"
            >
              {isOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      !isOpen && "lg:justify-center lg:px-2",
                      isActive && "bg-government-primary/10 text-government-primary border-r-2 border-government-primary"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isOpen && "mr-2")} />
                    {isOpen && <span>{item.name}</span>}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className={cn("text-center", !isOpen && "lg:px-0")}>
              {isOpen ? (
                <div>
                  <p className="text-xs text-gray-500">
                    Plataforma Digital Nacional
                  </p>
                  <p className="text-xs text-gray-400">
                    Versión 1.0.0
                  </p>
                </div>
              ) : (
                <div className="h-8 w-8 mx-auto bg-mexico-green rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PDN</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
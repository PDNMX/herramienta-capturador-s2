"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  name: string
  href?: string
}

interface NavigationProps {
  items?: BreadcrumbItem[]
}

const routeNames: Record<string, string> = {
  "/inicio": "Inicio",
  "/servidores": "Servidores Públicos",
  "/contrataciones": "Contrataciones",
  "/expedientes": "Expedientes",
  "/reportes": "Reportes",
}

export function Navigation({ items }: NavigationProps) {
  const pathname = usePathname()

  const breadcrumbItems = items || generateBreadcrumbs(pathname)

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        href="/inicio"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                "hover:text-foreground transition-colors",
                index === breadcrumbItems.length - 1 && "text-foreground font-medium"
              )}
            >
              {item.name}
            </Link>
          ) : (
            <span
              className={cn(
                index === breadcrumbItems.length - 1 && "text-foreground font-medium"
              )}
            >
              {item.name}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ""
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const name = routeNames[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)

    breadcrumbs.push({
      name,
      href: index === pathSegments.length - 1 ? undefined : currentPath,
    })
  })

  return breadcrumbs
}
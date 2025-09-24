"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Folder, BarChart3, LogOut } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-primary rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S2</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Sistema de Servidores Públicos
              </h1>
              <p className="text-sm text-muted-foreground">Dashboard Principal</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-foreground">
                {session.user.first_name} {session.user.last_name}
              </span>
              <Badge variant="secondary">{session.user.role}</Badge>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              ¡Bienvenido, {session.user.first_name}!
            </h2>
            <p className="text-muted-foreground">
              Has iniciado sesión exitosamente en el Sistema de Servidores Públicos
            </p>
          </div>

          {/* User Info Card */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Información del Usuario</CardTitle>
              <CardDescription>
                Datos de tu sesión actual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">Email:</span>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
              <div>
                <span className="font-medium">Nombre:</span>
                <p className="text-muted-foreground">
                  {session.user.first_name} {session.user.last_name}
                </p>
              </div>
              <div>
                <span className="font-medium">Rol:</span>
                <Badge className="ml-2">{session.user.role}</Badge>
              </div>
              <div>
                <span className="font-medium">ID de Usuario:</span>
                <p className="text-muted-foreground text-sm font-mono">{session.user.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Servidores Públicos</CardTitle>
                <CardDescription>
                  Gestionar servidores públicos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Contrataciones</CardTitle>
                <CardDescription>
                  Procedimientos de contratación
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Folder className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Expedientes</CardTitle>
                <CardDescription>
                  Gestión de expedientes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Reportes</CardTitle>
                <CardDescription>
                  Analytics y reportes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">
                ✅ Autenticación con Directus exitosa
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
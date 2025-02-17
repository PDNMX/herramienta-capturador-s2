"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import logoS5w from "@/components/s5-logo-white.svg"
import logoS5d from "@/components/s5-logo-color.svg"
import { BarChart3, Search, ArrowRight, Shield, InfoIcon as Transparency, UserCheck } from "lucide-react"

export function Landing() {
  const { theme } = useTheme()

  return (
    <main className="relative min-h-screen overflow-hidden gradient-background">
      <div className="container relative mx-auto px-4 py-12">
        <div className="mb-16 flex flex-col items-center justify-center space-y-8">
          <Image
            src={theme === "dark" ? logoS5w : logoS5d}
            alt="Logo Sistema 5"
            width={500}
            height={200}
            className="h-48 w-auto"
          />
          <h1 className="text-center text-5xl font-bold tracking-tighter text-foreground sm:text-6xl md:text-7xl">
            Sistema 5
          </h1>
          <p className="max-w-[800px] text-center text-xl sm:text-2xl text-foreground">
            Sistema de Denuncias Públicas de Faltas Administrativas y Hechos de Corrupción
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mb-20 flex flex-wrap justify-center gap-6">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            asChild
          >
            <Link href="/presentar-denuncia">
              Iniciar Denuncia
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-background/10 backdrop-blur-sm border-primary/20 text-foreground hover:bg-accent hover:text-accent-foreground text-lg px-8 py-6"
          >
            <BarChart3 className="w-5 h-5" />
            Estadísticas Nacionales
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-background/10 backdrop-blur-sm border-primary/20 text-foreground hover:bg-accent hover:text-accent-foreground text-lg px-8 py-6"
          >
            <Search className="w-5 h-5" />
            Consultar Estatus
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="border-border bg-card/70 backdrop-blur">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Shield className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl text-primary">Seguro y Confidencial</CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-card-foreground">
              Garantizamos la protección y confidencialidad de tu información en todo momento.
            </CardContent>
          </Card>

          <Card className="border-border bg-card/70 backdrop-blur">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Transparency className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl text-primary">Proceso Transparente</CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-card-foreground">
              Seguimiento claro y transparente del estado de tu denuncia en cada etapa.
            </CardContent>
          </Card>

          <Card className="border-border bg-card/70 backdrop-blur">
            <CardHeader className="flex flex-row items-center space-x-4">
              <UserCheck className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl text-primary">Fácil de Usar</CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-card-foreground">
              Interfaz intuitiva diseñada para facilitar el proceso de denuncia.
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
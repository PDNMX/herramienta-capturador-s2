import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, Search, Info, ArrowRight } from "lucide-react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LogoS5 from "@/components/s5-logo-white.svg";

export default function PaginaInicio() {
  return (
    <div className="min-h-screen bg-background gradient-background">
      <Header />

      <main className="container mx-auto px-4 pt-12 pb-8 space-y-12">
        {/* Hero Section */}
        <Card className="overflow-hidden border-2 border-custom-primary shadow-xl mt-16 h-[63vh]">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="grid md:grid-cols-2 h-full flex-1">
              {/* Columna izquierda */}
              <div className="header-gradient h-full p-8 md:p-10 lg:p-12 flex flex-col justify-between">
                <div className="flex flex-col items-center md:items-start">
                  <Image
                    src={LogoS5 || "/placeholder.svg"}
                    alt="Logo Sistema 5"
                    width={100}
                    height={100}
                    className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-6 md:space-y-8">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center md:text-left">
                    Sistema 5
                  </h1>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90 leading-tight text-center md:text-left">
                    Sistema de Denuncias Públicas de Faltas Administrativas y
                    Hechos de Corrupción
                  </h2>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="bg-background dark:bg-background/5 h-full p-8 md:p-10 lg:p-12 flex flex-col justify-between">
                <div className="space-y-6">
                  <p className="text-lg md:text-xl lg:text-2xl text-foreground dark:text-white/90 leading-relaxed">
                    Bienvenido a nuestra plataforma segura y eficiente para
                    presentar denuncias. Su participación es fundamental para
                    construir un México más justo y transparente.
                  </p>
                  <div className="flex items-start gap-3 text-foreground dark:text-white/90">
                    <Info className="h-6 w-6 flex-shrink-0 mt-1 text-custom-primary" />
                    <span className="text-base md:text-lg">
                      Todos los datos proporcionados son tratados con estricta
                      confidencialidad.
                    </span>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button className="bg-custom-primary hover:bg-custom-primary/90 text-white text-base md:text-lg px-6 py-3 md:py-4 h-auto transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                    <span>Inicia tu denuncia ahora</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-effect border-2 border-custom-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Search className="h-6 w-6 text-custom-primary" />
                <h4 className="font-medium">Seguimiento de Denuncias</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Consulta el estado de tu denuncia en tiempo real
              </p>
              <Button
                variant="outline"
                className="w-full border-custom-primary text-custom-primary hover:bg-custom-primary hover:text-white transition-colors duration-300"
                asChild
              >
                <Link href="/seguimiento">Consultar Estado</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-2 border-custom-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-6 w-6 text-custom-primary" />
                <h4 className="font-medium">Estadísticas</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Accede a datos actualizados sobre denuncias
              </p>
              <Button
                variant="outline"
                className="w-full border-custom-primary text-custom-primary hover:bg-custom-primary hover:text-white transition-colors duration-300"
                asChild
              >
                <Link href="/estadisticas">Ver Datos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

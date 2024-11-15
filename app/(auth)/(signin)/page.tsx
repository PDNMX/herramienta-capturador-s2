import React from "react";
import Image from "next/image";
import Link from "next/link";
import LogoS5 from "@/components/s5-logo-color.svg";
import { BarChart3, FileText, Search } from 'lucide-react';
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaginaInicio() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section - Ajustado para mejor centrado y espaciado */}
        <section className="relative w-full py-16 md:py-24 flex items-center justify-center bg-gradient-to-b from-background to-background/80">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center space-y-6">
              <Image 
                src={LogoS5} 
                alt="Logo S5" 
                width={180} 
                height={180} 
                className="mx-auto" 
              />
              <h1 className="text-3xl md:text-5xl font-bold">
                Sistema 5
              </h1>
              <h2 className="text-xl md:text-3xl text-muted-foreground font-medium">
                Sistema de denuncias públicas de faltas administrativas y hechos de corrupción
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Una plataforma segura y eficiente para presentar y dar
                seguimiento a denuncias en México. Juntos construimos un país
                más justo y transparente.
              </p>
            </div>
          </div>
        </section>

        {/* Main Features - Mejorado el espaciado y la presentación */}
        <section className="w-full bg-background">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  icon: <FileText className="h-8 w-8 text-primary" />,
                  title: "Presentar Denuncia",
                  description: "Realiza tu denuncia de manera fácil y segura. Nuestro sistema guiado te ayudará paso a paso en el proceso.",
                  buttonText: "Iniciar Denuncia",
                  href: "/presentar-denuncia",
                  primary: true
                },
                {
                  icon: <Search className="h-8 w-8 text-primary" />,
                  title: "Seguimiento",
                  description: "Consulta el estado de tu denuncia en tiempo real y recibe notificaciones sobre avances importantes.",
                  buttonText: "Consultar Estado",
                  href: "/seguimiento"
                },
                {
                  icon: <BarChart3 className="h-8 w-8 text-primary" />,
                  title: "Estadísticas",
                  description: "Accede a datos actualizados sobre denuncias en México y contribuye a la transparencia.",
                  buttonText: "Ver Datos",
                  href: "/estadisticas"
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-card hover:bg-card/90 transition-all hover:shadow-md flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      {feature.icon}
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <CardDescription className="mb-6 text-base">
                      {feature.description}
                    </CardDescription>
                    <div className="mt-auto">
                      <Button 
                        asChild 
                        className={`w-full ${feature.primary ? 'bg-primary hover:bg-primary/90' : ''}`}
                        variant={feature.primary ? 'default' : 'outline'}
                      >
                        <Link href={feature.href}>{feature.buttonText}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
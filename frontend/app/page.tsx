import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
          <span className="text-primary-foreground font-bold text-xl">S2</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Sistema de Servidores Públicos
        </h1>
        <p className="text-muted-foreground mb-8">
          Plataforma Digital Nacional - PDN
        </p>
        <div className="space-y-4">
          <a
            href="/login"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Acceder al Sistema
          </a>
          <div className="text-sm text-muted-foreground">
            <p>Sistema inicializado correctamente ✅</p>
            <p>Puerto: 3002</p>
            <p>Versión: 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
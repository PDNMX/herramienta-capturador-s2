//@ts-nocheck
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Search } from "lucide-react"

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-effect border-2 border-custom-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Search className="h-6 w-6 text-custom-primary" />
            <h4 className="font-medium">Seguimiento de Denuncias</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Consulta el estado de tu denuncia en tiempo real</p>
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
          <p className="text-sm text-muted-foreground mb-4">Accede a datos actualizados sobre denuncias</p>
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
  )
}


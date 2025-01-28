// @ts-nocheck
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SeguimientoModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function SeguimientoModal({ isOpen, onOpenChange }: SeguimientoModalProps) {
  const [folio, setFolio] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simular una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Aquí iría la lógica real para consultar el folio
      console.log("Consultando folio:", folio)

      // Simular un error para demostración
      if (folio === "12345") {
        throw new Error("Folio no encontrado")
      }

      // Si todo va bien, cerrar el modal
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar el folio")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-custom-primary flex items-center gap-2">
            <Search className="h-6 w-6" />
            Consulta de Denuncia
          </DialogTitle>
          <DialogDescription className="text-base">
            Ingrese el folio de seguimiento para verificar el estado de su denuncia.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="folio" className="text-sm font-medium">
              Número de Folio
            </Label>
            <Input
              id="folio"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              className="w-full"
              placeholder="Ej. 123456789"
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Consultando..." : "Consultar Estado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
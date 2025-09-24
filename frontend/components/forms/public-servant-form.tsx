"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { publicServantSchema, type PublicServantFormData } from "@/lib/validations"
import { cn } from "@/lib/utils"
import { Loader2, Save, X } from "lucide-react"

interface PublicServantFormProps {
  initialData?: Partial<PublicServantFormData>
  onSubmit: (data: PublicServantFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function PublicServantForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: PublicServantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PublicServantFormData>({
    resolver: zodResolver(publicServantSchema),
    defaultValues: {
      nombres: initialData?.nombres || "",
      primer_apellido: initialData?.primer_apellido || "",
      segundo_apellido: initialData?.segundo_apellido || "",
      curp: initialData?.curp || "",
      rfc_con_homoclave: initialData?.rfc_con_homoclave || "",
      genero: initialData?.genero || "M",
      institucion_dependencia: initialData?.institucion_dependencia || "",
      puesto_cargo: initialData?.puesto_cargo || "",
      tipo_area: initialData?.tipo_area || "",
      nivel_responsabilidad: initialData?.nivel_responsabilidad || "",
      tipo_procedimiento: initialData?.tipo_procedimiento || [],
      superior_inmediato: initialData?.superior_inmediato || "",
      observaciones: initialData?.observaciones || "",
      fecha_ingreso: initialData?.fecha_ingreso || "",
      fecha_egreso: initialData?.fecha_egreso || "",
    },
  })

  const handleSubmit = async (data: PublicServantFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const procedimientoOptions = [
    { value: "licitacion_publica", label: "Licitación Pública" },
    { value: "invitacion_tres", label: "Invitación a Cuando Menos Tres Personas" },
    { value: "adjudicacion_directa", label: "Adjudicación Directa" },
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? "Editar Servidor Público" : "Registrar Servidor Público"}
        </CardTitle>
        <CardDescription>
          Complete la información del servidor público que interviene en procedimientos de contrataciones públicas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Personal</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nombres" className="text-sm font-medium">
                  Nombres *
                </label>
                <Input
                  id="nombres"
                  {...form.register("nombres")}
                  className={cn(
                    form.formState.errors.nombres && "border-red-500"
                  )}
                  placeholder="Nombre(s) completo(s)"
                />
                {form.formState.errors.nombres && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.nombres.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="primer_apellido" className="text-sm font-medium">
                  Primer Apellido *
                </label>
                <Input
                  id="primer_apellido"
                  {...form.register("primer_apellido")}
                  className={cn(
                    form.formState.errors.primer_apellido && "border-red-500"
                  )}
                  placeholder="Primer apellido"
                />
                {form.formState.errors.primer_apellido && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.primer_apellido.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="segundo_apellido" className="text-sm font-medium">
                  Segundo Apellido
                </label>
                <Input
                  id="segundo_apellido"
                  {...form.register("segundo_apellido")}
                  placeholder="Segundo apellido (opcional)"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="genero" className="text-sm font-medium">
                  Género *
                </label>
                <select
                  {...form.register("genero")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="curp" className="text-sm font-medium">
                  CURP *
                </label>
                <Input
                  id="curp"
                  {...form.register("curp")}
                  className={cn(
                    form.formState.errors.curp && "border-red-500"
                  )}
                  placeholder="CURP de 18 caracteres"
                  maxLength={18}
                />
                {form.formState.errors.curp && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.curp.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="rfc_con_homoclave" className="text-sm font-medium">
                  RFC con Homoclave *
                </label>
                <Input
                  id="rfc_con_homoclave"
                  {...form.register("rfc_con_homoclave")}
                  className={cn(
                    form.formState.errors.rfc_con_homoclave && "border-red-500"
                  )}
                  placeholder="RFC con homoclave"
                />
                {form.formState.errors.rfc_con_homoclave && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.rfc_con_homoclave.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Información Laboral */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Laboral</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="institucion_dependencia" className="text-sm font-medium">
                  Institución/Dependencia *
                </label>
                <Input
                  id="institucion_dependencia"
                  {...form.register("institucion_dependencia")}
                  className={cn(
                    form.formState.errors.institucion_dependencia && "border-red-500"
                  )}
                  placeholder="Nombre de la institución"
                />
                {form.formState.errors.institucion_dependencia && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.institucion_dependencia.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="puesto_cargo" className="text-sm font-medium">
                  Puesto/Cargo *
                </label>
                <Input
                  id="puesto_cargo"
                  {...form.register("puesto_cargo")}
                  className={cn(
                    form.formState.errors.puesto_cargo && "border-red-500"
                  )}
                  placeholder="Puesto o cargo actual"
                />
                {form.formState.errors.puesto_cargo && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.puesto_cargo.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="tipo_area" className="text-sm font-medium">
                  Tipo de Área *
                </label>
                <select
                  {...form.register("tipo_area")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Seleccionar tipo de área</option>
                  <option value="administrativa">Administrativa</option>
                  <option value="tecnica">Técnica</option>
                  <option value="juridica">Jurídica</option>
                  <option value="financiera">Financiera</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="nivel_responsabilidad" className="text-sm font-medium">
                  Nivel de Responsabilidad *
                </label>
                <select
                  {...form.register("nivel_responsabilidad")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Seleccionar nivel</option>
                  <option value="alto">Alto</option>
                  <option value="medio">Medio</option>
                  <option value="operativo">Operativo</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tipos de Procedimiento *
              </label>
              <div className="flex flex-wrap gap-2">
                {procedimientoOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => {
                      const current = form.getValues("tipo_procedimiento") || []
                      const updated = current.includes(option.value)
                        ? current.filter(v => v !== option.value)
                        : [...current, option.value]
                      form.setValue("tipo_procedimiento", updated)
                    }}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fecha_ingreso" className="text-sm font-medium">
                  Fecha de Ingreso *
                </label>
                <Input
                  id="fecha_ingreso"
                  type="date"
                  {...form.register("fecha_ingreso")}
                  className={cn(
                    form.formState.errors.fecha_ingreso && "border-red-500"
                  )}
                />
                {form.formState.errors.fecha_ingreso && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.fecha_ingreso.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="fecha_egreso" className="text-sm font-medium">
                  Fecha de Egreso
                </label>
                <Input
                  id="fecha_egreso"
                  type="date"
                  {...form.register("fecha_egreso")}
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="observaciones" className="text-sm font-medium">
                Observaciones
              </label>
              <textarea
                {...form.register("observaciones")}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Observaciones adicionales (opcional)"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-government-primary hover:bg-government-primary/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {initialData ? "Actualizar" : "Registrar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
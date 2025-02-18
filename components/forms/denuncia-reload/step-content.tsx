"use client"

import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface StepContentProps {
  step: number
  form: UseFormReturn<any>
}

export function StepContent({ step, form }: StepContentProps) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonimo"
              checked={form.watch("denunciante.anonimo")}
              onCheckedChange={(checked) => form.setValue("denunciante.anonimo", checked as boolean)}
            />
            <Label htmlFor="anonimo">Presentar denuncia anónima</Label>
          </div>

          {!form.watch("denunciante.anonimo") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  placeholder="Ingrese su nombre completo"
                  {...form.register("denunciante.datosDenunciante.nombre")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  placeholder="Ingrese su teléfono"
                  {...form.register("denunciante.datosDenunciante.telefono")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  {...form.register("denunciante.datosDenunciante.email")}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="proteccion"
                  checked={form.watch("denunciante.datosDenunciante.proteccion")}
                  onCheckedChange={(checked) =>
                    form.setValue("denunciante.datosDenunciante.proteccion", checked as boolean)
                  }
                />
                <Label htmlFor="proteccion">Solicitar protección como denunciante</Label>
              </div>
            </>
          )}
        </div>
      )

    case 2:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="entidad">Entidad</Label>
            <Input
              id="entidad"
              placeholder="Ingrese la entidad"
              {...form.register("ubicacionHecho.lugarHecho.entidad")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entePublico">Ente Público</Label>
            <Input
              id="entePublico"
              placeholder="Ingrese el ente público"
              {...form.register("ubicacionHecho.lugarHecho.entePublico")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaHecho">Fecha</Label>
              <Input id="fechaHecho" type="date" {...form.register("ubicacionHecho.lugarHecho.fechaHecho")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaHecho">Hora</Label>
              <Input id="horaHecho" type="time" {...form.register("ubicacionHecho.lugarHecho.horaHecho")} />
            </div>
          </div>
        </div>
      )

    case 3:
      return (
        <div className="space-y-6">
          <RadioGroup
            onValueChange={(value) =>
              form.setValue("personaDenunciada.tipoPersona", value as "SERVIDOR_PUBLICO" | "PARTICULAR")
            }
            defaultValue={form.watch("personaDenunciada.tipoPersona")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SERVIDOR_PUBLICO" id="servidor" />
              <Label htmlFor="servidor">Servidor Público</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PARTICULAR" id="particular" />
              <Label htmlFor="particular">Particular</Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="nombreDenunciado">Nombre</Label>
            <Input id="nombreDenunciado" {...form.register("personaDenunciada.nombre")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
              <Input id="apellidoPaterno" {...form.register("personaDenunciada.apellidoPaterno")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
              <Input id="apellidoMaterno" {...form.register("personaDenunciada.apellidoMaterno")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              {...form.register("personaDenunciada.descripcion")}
              placeholder="Describa a la persona denunciada..."
            />
          </div>
        </div>
      )

    case 4:
      return (
        <div className="space-y-6">
          {/* Aquí puedes agregar checkboxes para las faltas */}
          <div className="space-y-4">
            <h3 className="font-medium">Faltas Graves</h3>
            {/* Agregar checkboxes para faltas graves */}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Faltas No Graves</h3>
            {/* Agregar checkboxes para faltas no graves */}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Hechos de Corrupción</h3>
            {/* Agregar checkboxes para hechos de corrupción */}
          </div>
        </div>
      )

    case 5:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="narracion">Narración de los Hechos</Label>
            <Textarea
              id="narracion"
              {...form.register("narracionHechos")}
              placeholder="Describa detalladamente los hechos que desea denunciar..."
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Evidencias</Label>
            <Input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                form.setValue("archivosEvidencia", files)
              }}
            />
          </div>
        </div>
      )

    default:
      return null
  }
}
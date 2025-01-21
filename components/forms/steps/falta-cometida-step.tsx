//@ts-nocheck
"use client"
import type React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const faltasGraves = [
  { id: 1, label: "Cohecho" },
  { id: 2, label: "Peculado" },
  { id: 3, label: "Desvío de recursos públicos" },
  { id: 4, label: "Abuso de funciones" },
  { id: 5, label: "Actuación bajo conflicto de interés" },
]

const faltasNoGraves = [
  { id: 6, label: "Negligencia administrativa" },
  { id: 7, label: "Incumplimiento de funciones" },
  { id: 8, label: "Descuido en la conservación de recursos" },
  { id: 9, label: "Omisión en la declaración patrimonial" },
  { id: 10, label: "Violación de procedimientos de contratación" },
]

const hechosCorrupcion = [
  { id: 11, label: "Soborno" },
  { id: 12, label: "Malversación de fondos" },
  { id: 13, label: "Tráfico de influencias" },
  { id: 14, label: "Enriquecimiento ilícito" },
  { id: 15, label: "Obstrucción de la justicia" },
]

interface CheckboxGroupProps {
  title: string
  description: string
  name: string
  items: Array<{ id: number; label: string }>
  form: any
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, description, name, items, form }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormDescription className="mb-4">{description}</FormDescription>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <div className="space-y-4">
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, item.id])
                              : field.onChange(field.value?.filter((value: number) => value !== item.id))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer" htmlFor={`${name}-${item.id}`}>
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </ScrollArea>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
)

export function FaltaCometidaStep({ form }: { form: any }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Faltas y Hechos de Corrupción</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CheckboxGroup
          title="Faltas Graves"
          description="Seleccione las faltas graves que apliquen a la denuncia. Estas son violaciones serias que pueden resultar en sanciones significativas."
          name="faltasCometidas.faltasGraves"
          items={faltasGraves}
          form={form}
        />

        <Separator />

        <CheckboxGroup
          title="Faltas No Graves"
          description="Indique las faltas no graves relacionadas con la denuncia. Estas son infracciones menores que aún así requieren atención."
          name="faltasCometidas.faltasNoGraves"
          items={faltasNoGraves}
          form={form}
        />

        <Separator />

        <CheckboxGroup
          title="Hechos de Corrupción"
          description="Señale los hechos de corrupción que se aplican a esta denuncia. Estos son actos graves que comprometen la integridad del servicio público."
          name="faltasCometidas.hechosCorrupcion"
          items={hechosCorrupcion}
          form={form}
        />
      </CardContent>
    </Card>
  )
}
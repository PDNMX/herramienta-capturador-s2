//@ts-nocheck
"use client"
import type React from "react"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { UseFormReturn } from "react-hook-form"

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
  name: string
  items: Array<{ id: number; label: string }>
  form: UseFormReturn<any>
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, name, items, form }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-primary">{title}</h3>
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <ScrollArea className="h-[150px] rounded-md border p-2">
            <div className="space-y-2">
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem key={item.id} className="flex flex-row items-start space-x-2 space-y-0">
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
                      <FormLabel className="text-xs font-normal cursor-pointer" htmlFor={`${name}-${item.id}`}>
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </ScrollArea>
        </FormItem>
      )}
    />
  </div>
)

interface FaltaCometidaStepProps {
  form: UseFormReturn<any> | null
}

export function FaltaCometidaStep({ form }: FaltaCometidaStepProps) {
  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <CheckboxGroup title="Faltas Graves" name="faltasCometidas.faltasGraves" items={faltasGraves} form={form} />
      <CheckboxGroup
        title="Faltas No Graves"
        name="faltasCometidas.faltasNoGraves"
        items={faltasNoGraves}
        form={form}
      />
      <CheckboxGroup
        title="Hechos de Corrupción"
        name="faltasCometidas.hechosCorrupcion"
        items={hechosCorrupcion}
        form={form}
      />
    </div>
  )
}


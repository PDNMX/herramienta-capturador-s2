//@ts-nocheck
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Flag, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EntePublico {
  id: number
  nombre: string
  entidad?: string
}

interface EntePublicoComboboxProps {
  options: EntePublico[]
  value?: number
  onChange: (value: number | undefined) => void
  placeholder?: string
  disabled?: boolean
  entidadNombre?: string
}

export function EntePublicoCombobox({
  options,
  value,
  onChange,
  placeholder = "Seleccionar ente público",
  disabled = false,
  entidadNombre = "",
}: EntePublicoComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const renderEnteBadge = (ente: EntePublico) => {
    if (ente.entidad === "00") {
      return (
        <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
          <Flag className="h-3 w-3 mr-1" />
          Federal
        </div>
      )
    } else {
      return (
        <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
          <MapPin className="h-3 w-3 mr-1" />
          {entidadNombre}
        </div>
      )
    }
  }

  const selectedOption = options.find((option) => option.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal h-12"
          disabled={disabled}
        >
          <div className="flex items-center justify-between w-full">
            <span className="truncate">{selectedOption ? selectedOption.nombre : placeholder}</span>
            <div className="flex items-center">
              {selectedOption && renderEnteBadge(selectedOption)}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar ente público..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontraron entes públicos.</CommandEmpty>
            <CommandGroup>
              {/* Primero mostramos los entes federales */}
              {options
                .filter((option) => option.entidad === "00")
                .map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      onChange(option.id === value ? undefined : option.id)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center">
                      <Check className={cn("mr-2 h-4 w-4", value === option.id ? "opacity-100" : "opacity-0")} />
                      <span className="flex-1">{option.nombre}</span>
                    </div>
                    {renderEnteBadge(option)}
                  </CommandItem>
                ))}

              {/* Luego mostramos los entes de la entidad */}
              {options
                .filter((option) => option.entidad !== "00")
                .map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      onChange(option.id === value ? undefined : option.id)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center">
                      <Check className={cn("mr-2 h-4 w-4", value === option.id ? "opacity-100" : "opacity-0")} />
                      <span className="flex-1">{option.nombre}</span>
                    </div>
                    {renderEnteBadge(option)}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

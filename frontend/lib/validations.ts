import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const publicServantSchema = z.object({
  nombres: z
    .string()
    .min(1, "Los nombres son requeridos")
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, "Solo se permiten letras y espacios"),
  primer_apellido: z
    .string()
    .min(1, "El primer apellido es requerido")
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, "Solo se permiten letras y espacios"),
  segundo_apellido: z
    .string()
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]*$/, "Solo se permiten letras y espacios")
    .optional(),
  curp: z
    .string()
    .min(1, "El CURP es requerido")
    .length(18, "El CURP debe tener 18 caracteres")
    .regex(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/, "Formato de CURP inválido"),
  rfc_con_homoclave: z
    .string()
    .min(1, "El RFC es requerido")
    .regex(/^[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9]$/, "Formato de RFC inválido"),
  genero: z.enum(["M", "F"], {
    required_error: "El género es requerido",
  }),
  institucion_dependencia: z
    .string()
    .min(1, "La institución/dependencia es requerida"),
  puesto_cargo: z
    .string()
    .min(1, "El puesto/cargo es requerido"),
  tipo_area: z
    .string()
    .min(1, "El tipo de área es requerido"),
  nivel_responsabilidad: z
    .string()
    .min(1, "El nivel de responsabilidad es requerido"),
  tipo_procedimiento: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un tipo de procedimiento"),
  superior_inmediato: z.string().optional(),
  observaciones: z.string().optional(),
  fecha_ingreso: z
    .string()
    .min(1, "La fecha de ingreso es requerida"),
  fecha_egreso: z.string().optional(),
})

export const contractSchema = z.object({
  numero_procedimiento: z
    .string()
    .min(1, "El número de procedimiento es requerido"),
  titulo_contratacion: z
    .string()
    .min(1, "El título de la contratación es requerido"),
  descripcion: z
    .string()
    .min(1, "La descripción es requerida"),
  tipo_contratacion: z.enum(["adquisiciones", "arrendamientos", "servicios", "obra_publica"], {
    required_error: "El tipo de contratación es requerido",
  }),
  tipo_procedimiento: z.enum(["invitacion_tres", "adjudicacion_directa", "licitacion_publica"], {
    required_error: "El tipo de procedimiento es requerido",
  }),
  forma_procedimiento: z.enum(["presencial", "electronica", "mixta"], {
    required_error: "La forma del procedimiento es requerida",
  }),
  codigo_expediente: z
    .string()
    .min(1, "El código de expediente es requerido"),
  titulo_expediente: z
    .string()
    .min(1, "El título del expediente es requerido"),
  institucion_dependencia: z
    .string()
    .min(1, "La institución/dependencia es requerida"),
  unidad_compradora: z
    .string()
    .min(1, "La unidad compradora es requerida"),
  unidad_responsable: z
    .string()
    .min(1, "La unidad responsable es requerida"),
  moneda: z
    .string()
    .min(1, "La moneda es requerida"),
  precio_total: z
    .number()
    .min(0.01, "El precio total debe ser mayor a 0"),
  fecha_inicio: z
    .string()
    .min(1, "La fecha de inicio es requerida"),
  fecha_fin: z.string().optional(),
  servidores_publicos: z
    .array(z.string())
    .min(1, "Debe asignar al menos un servidor público"),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type PublicServantFormData = z.infer<typeof publicServantSchema>
export type ContractFormData = z.infer<typeof contractSchema>
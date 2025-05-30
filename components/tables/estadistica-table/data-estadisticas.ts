// Datos de ejemplo para las estadísticas del Sistema Nacional Anticorrupción
// TODO: Reemplazar con llamadas a API

export interface DenunciaMensual {
  mes: string;
  denuncias: number;
  faltasAdministrativas: number;
  hechosCorrupcion: number;
}

export interface TipoDenuncia {
  tipo: string;
  cantidad: number;
  categoria: "Hecho de Corrupción" | "Falta Administrativa";
}

export interface EstatusDenuncia {
  name: string;
  value: number;
  color: string;
}

export interface EntidadFederativa {
  entidad: string;
  nombreEntidad: string;
  count: number | string;
}

export interface Municipio {
  nombre: string;
  denuncias: number;
  faltasAdmin: number;
  hechosCorrupcion: number;
  poblacion: number;
}

export interface MunicipiosEntidad {
  entidad: string;
  totalDenuncias: number;
  municipios: Municipio[];
}

export interface MetricasPrincipales {
  totalDenuncias: number;
  hechosCorrupcion: number;
  faltasAdministrativas: number;
  tiempoPromedioResolucion: number;
  porcentajeDenunciasAnonimas: number;
  tasaResolucion: number;
}

// Datos de evolución mensual mejorados con datos mixtos más realistas
export const dataMensual = [
  { 
    mes: "Ene 2024", 
    denuncias: 145,
    faltasAdministrativas: 58,
    hechosCorrupcion: 42,
    mixtas: 28,
    sinClasificacion: 17
  },
  { 
    mes: "Feb 2024", 
    denuncias: 167,
    faltasAdministrativas: 65,
    hechosCorrupcion: 48,
    mixtas: 35,
    sinClasificacion: 19
  },
  { 
    mes: "Mar 2024", 
    denuncias: 189,
    faltasAdministrativas: 72,
    hechosCorrupcion: 55,
    mixtas: 42,
    sinClasificacion: 20
  },
  { 
    mes: "Abr 2024", 
    denuncias: 156,
    faltasAdministrativas: 61,
    hechosCorrupcion: 44,
    mixtas: 32,
    sinClasificacion: 19
  },
  { 
    mes: "May 2024", 
    denuncias: 203,
    faltasAdministrativas: 78,
    hechosCorrupcion: 62,
    mixtas: 45,
    sinClasificacion: 18
  },
  { 
    mes: "Jun 2024", 
    denuncias: 178,
    faltasAdministrativas: 69,
    hechosCorrupcion: 51,
    mixtas: 38,
    sinClasificacion: 20
  },
  { 
    mes: "Jul 2024", 
    denuncias: 224,
    faltasAdministrativas: 85,
    hechosCorrupcion: 68,
    mixtas: 52,
    sinClasificacion: 19
  },
  { 
    mes: "Ago 2024", 
    denuncias: 198,
    faltasAdministrativas: 76,
    hechosCorrupcion: 58,
    mixtas: 44,
    sinClasificacion: 20
  },
  { 
    mes: "Sep 2024", 
    denuncias: 235,
    faltasAdministrativas: 89,
    hechosCorrupcion: 72,
    mixtas: 56,
    sinClasificacion: 18
  },
  { 
    mes: "Oct 2024", 
    denuncias: 212,
    faltasAdministrativas: 81,
    hechosCorrupcion: 65,
    mixtas: 48,
    sinClasificacion: 18
  },
  { 
    mes: "Nov 2024", 
    denuncias: 267,
    faltasAdministrativas: 98,
    hechosCorrupcion: 82,
    mixtas: 68,
    sinClasificacion: 19
  },
  { 
    mes: "Dic 2024", 
    denuncias: 189,
    faltasAdministrativas: 72,
    hechosCorrupcion: 56,
    mixtas: 42,
    sinClasificacion: 19
  }
];

// Datos de tipos de denuncia basados en la Ley General de Responsabilidades Administrativas
export const dataTipos: TipoDenuncia[] = [
  // Faltas Administrativas Graves
  { tipo: "Conflicto de interés", cantidad: 245, categoria: "Falta Administrativa" },
  { tipo: "Contratación indebida", cantidad: 198, categoria: "Falta Administrativa" },
  { tipo: "Encubrimiento", cantidad: 167, categoria: "Falta Administrativa" },
  { tipo: "Desacato", cantidad: 143, categoria: "Falta Administrativa" },
  { tipo: "Obstaculización de investigaciones", cantidad: 125, categoria: "Falta Administrativa" },
  { tipo: "Uso indebido de información", cantidad: 112, categoria: "Falta Administrativa" },
  
  // Faltas Administrativas No Graves
  { tipo: "Incumplimiento de normativa", cantidad: 189, categoria: "Falta Administrativa" },
  { tipo: "Negligencia en funciones", cantidad: 156, categoria: "Falta Administrativa" },
  { tipo: "Inasistencia injustificada", cantidad: 134, categoria: "Falta Administrativa" },
  
  // Hechos de Corrupción
  { tipo: "Cohecho", cantidad: 285, categoria: "Hecho de Corrupción" },
  { tipo: "Peculado", cantidad: 234, categoria: "Hecho de Corrupción" },
  { tipo: "Malversación", cantidad: 191, categoria: "Hecho de Corrupción" },
];

// Datos de estatus con colores mejorados y semánticamente correctos
export const dataEstatus = [
  { name: "Registrada", value: 385, color: "#94a3b8" },      // Gris claro - Inicial
  { name: "Turnada", value: 280, color: "#fbbf24" },         // Amarillo - En proceso inicial
  { name: "En Proceso", value: 195, color: "#f97316" },      // Naranja - En revisión activa
  { name: "Atendida", value: 142, color: "#10b981" },        // Verde - Completada exitosamente
  { name: "Pendiente", value: 98, color: "#ef4444" },        // Rojo - Requiere atención urgente
];

// Datos de entidades federativas
export const dataEntidades: EntidadFederativa[] = [
  { entidad: "00", nombreEntidad: "Federación", count: "Fed." },
  { entidad: "01", nombreEntidad: "Aguascalientes", count: 145 },
  { entidad: "02", nombreEntidad: "Baja California", count: 320 },
  { entidad: "03", nombreEntidad: "Baja California Sur", count: 89 },
  { entidad: "04", nombreEntidad: "Campeche", count: 67 },
  { entidad: "05", nombreEntidad: "Coahuila", count: 234 },
  { entidad: "06", nombreEntidad: "Colima", count: 45 },
  { entidad: "07", nombreEntidad: "Chiapas", count: 190 },
  { entidad: "08", nombreEntidad: "Chihuahua", count: 278 },
  { entidad: "09", nombreEntidad: "Ciudad de México", count: 450 },
  { entidad: "10", nombreEntidad: "Durango", count: 123 },
  { entidad: "11", nombreEntidad: "Guanajuato", count: 210 },
  { entidad: "12", nombreEntidad: "Guerrero", count: 156 },
  { entidad: "13", nombreEntidad: "Hidalgo", count: 98 },
  { entidad: "14", nombreEntidad: "Jalisco", count: 320 },
  { entidad: "15", nombreEntidad: "México", count: 380 },
  { entidad: "16", nombreEntidad: "Michoacán", count: 165 },
  { entidad: "17", nombreEntidad: "Morelos", count: 87 },
  { entidad: "18", nombreEntidad: "Nayarit", count: 76 },
  { entidad: "19", nombreEntidad: "Nuevo León", count: 380 },
  { entidad: "20", nombreEntidad: "Oaxaca", count: 134 },
  { entidad: "21", nombreEntidad: "Puebla", count: 275 },
  { entidad: "22", nombreEntidad: "Querétaro", count: 156 },
  { entidad: "23", nombreEntidad: "Quintana Roo", count: 198 },
  { entidad: "24", nombreEntidad: "San Luis Potosí", count: 143 },
  { entidad: "25", nombreEntidad: "Sinaloa", count: 187 },
  { entidad: "26", nombreEntidad: "Sonora", count: 201 },
  { entidad: "27", nombreEntidad: "Tabasco", count: 112 },
  { entidad: "28", nombreEntidad: "Tamaulipas", count: 167 },
  { entidad: "29", nombreEntidad: "Tlaxcala", count: 54 },
  { entidad: "30", nombreEntidad: "Veracruz", count: 240 },
  { entidad: "31", nombreEntidad: "Yucatán", count: 134 },
  { entidad: "32", nombreEntidad: "Zacatecas", count: 89 },
];

// Datos de municipios por entidad
export const municipiosData: Record<string, MunicipiosEntidad> = {
  "09": { // Ciudad de México
    entidad: "Ciudad de México",
    totalDenuncias: 450,
    municipios: [
      { nombre: "Cuauhtémoc", denuncias: 89, faltasAdmin: 62, hechosCorrupcion: 27, poblacion: 545884 },
      { nombre: "Miguel Hidalgo", denuncias: 76, faltasAdmin: 54, hechosCorrupcion: 22, poblacion: 372889 },
      { nombre: "Benito Juárez", denuncias: 68, faltasAdmin: 48, hechosCorrupcion: 20, poblacion: 434153 },
      { nombre: "Venustiano Carranza", denuncias: 54, faltasAdmin: 38, hechosCorrupcion: 16, poblacion: 443704 },
      { nombre: "Gustavo A. Madero", denuncias: 47, faltasAdmin: 33, hechosCorrupcion: 14, poblacion: 1185772 },
      { nombre: "Iztapalapa", denuncias: 43, faltasAdmin: 30, hechosCorrupcion: 13, poblacion: 1835486 },
      { nombre: "Coyoacán", denuncias: 38, faltasAdmin: 27, hechosCorrupcion: 11, poblacion: 614447 },
      { nombre: "Álvaro Obregón", denuncias: 35, faltasAdmin: 25, hechosCorrupcion: 10, poblacion: 749982 }
    ]
  },
  "14": { // Jalisco
    entidad: "Jalisco",
    totalDenuncias: 320,
    municipios: [
      { nombre: "Guadalajara", denuncias: 98, faltasAdmin: 69, hechosCorrupcion: 29, poblacion: 1385629 },
      { nombre: "Zapopan", denuncias: 67, faltasAdmin: 47, hechosCorrupcion: 20, poblacion: 1476491 },
      { nombre: "Tlaquepaque", denuncias: 45, faltasAdmin: 32, hechosCorrupcion: 13, poblacion: 687127 },
      { nombre: "Tonalá", denuncias: 38, faltasAdmin: 27, hechosCorrupcion: 11, poblacion: 568983 },
      { nombre: "Puerto Vallarta", denuncias: 32, faltasAdmin: 22, hechosCorrupcion: 10, poblacion: 291839 },
      { nombre: "Tlajomulco", denuncias: 25, faltasAdmin: 18, hechosCorrupcion: 7, poblacion: 549442 },
      { nombre: "El Salto", denuncias: 15, faltasAdmin: 11, hechosCorrupcion: 4, poblacion: 183437 }
    ]
  },
  "19": { // Nuevo León
    entidad: "Nuevo León",
    totalDenuncias: 380,
    municipios: [
      { nombre: "Monterrey", denuncias: 134, faltasAdmin: 94, hechosCorrupcion: 40, poblacion: 1142194 },
      { nombre: "Guadalupe", denuncias: 67, faltasAdmin: 47, hechosCorrupcion: 20, poblacion: 678006 },
      { nombre: "San Nicolás", denuncias: 54, faltasAdmin: 38, hechosCorrupcion: 16, poblacion: 443273 },
      { nombre: "Apodaca", denuncias: 43, faltasAdmin: 30, hechosCorrupcion: 13, poblacion: 523370 },
      { nombre: "Santa Catarina", denuncias: 35, faltasAdmin: 25, hechosCorrupcion: 10, poblacion: 334870 },
      { nombre: "Escobedo", denuncias: 28, faltasAdmin: 20, hechosCorrupcion: 8, poblacion: 357937 },
      { nombre: "San Pedro", denuncias: 19, faltasAdmin: 13, hechosCorrupcion: 6, poblacion: 122659 }
    ]
  }
};

// Métricas principales calculadas
export const metricasPrincipales: MetricasPrincipales = {
  totalDenuncias: 2355,
  hechosCorrupcion: 710,
  faltasAdministrativas: 1645,
  tiempoPromedioResolucion: 42,
  porcentajeDenunciasAnonimas: 58,
  tasaResolucion: 72,
};

// Funciones utilitarias para cálculos
export const calcularPorcentaje = (valor: number, total: number): number => {
  return Math.round((valor / total) * 100);
};

export const calcularTasaPorHabitantes = (denuncias: number, poblacion: number): number => {
  return Number(((denuncias / poblacion) * 100000).toFixed(1));
};

export const obtenerTotalDenunciasPorEstatus = (): number => {
  return dataEstatus.reduce((total, item) => total + item.value, 0);
};

export const obtenerEntidadesOrdenadas = (): EntidadFederativa[] => {
  return [...dataEntidades]
    .filter(item => item.entidad !== "00")
    .sort((a, b) => {
      const countA = typeof a.count === 'number' ? a.count : 0;
      const countB = typeof b.count === 'number' ? b.count : 0;
      return countB - countA;
    });
};

// Configuración de colores para gráficas
export const coloresGraficas = {
  primary: '#3b82f6',
  secondary: '#10b981',
  tertiary: '#f59e0b',
  quaternary: '#ef4444',
  purple: '#8b5cf6',
  gray: '#6b7280',
};

// Configuración para tema oscuro/claro
export const obtenerColoresAdaptativos = (isDark: boolean) => ({
  primary: isDark ? '#60a5fa' : '#3b82f6',
  secondary: isDark ? '#34d399' : '#10b981',
  tertiary: isDark ? '#fbbf24' : '#f59e0b',
  quaternary: isDark ? '#f87171' : '#ef4444',
  text: isDark ? '#e5e7eb' : '#374151',
  grid: isDark ? '#374151' : '#e5e7eb',
}); 

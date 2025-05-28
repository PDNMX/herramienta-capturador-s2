// Servicios para obtener datos desde Directus API
import { MetricasPrincipales } from './data-estadisticas';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL no está definida en las variables de entorno');
}

// Interfaz para la respuesta de Directus
interface DirectusResponse<T> {
  data: T[];
  meta?: {
    total_count: number;
    filter_count: number;
  };
}

// Interfaz para el modelo de denuncia en Directus (basado en tu estructura real)
interface DenunciaDirectus {
  id: string;
  status: 'REGISTRADA' | 'TURNADA' | 'PROCESO' | 'ATENDIDA' | 'PENDIENTE';
  date_created: string;
  date_updated?: string;
  narracionHechos: string;
  testigo: boolean;
  denunciante: {
    id: number;
    anonimo: boolean;
    datosDenunciante?: any;
  };
  ubicacionHecho: {
    id: number;
    ciudad?: string;
    estado?: string;
    fechaHecho?: string;
  };
  faltaCometida: {
    id: number;
    faltaGrave: any[];
    faltaNoGrave: any[];
    hechosCorrupcion: any[];
  };
  personaDenunciada: {
    id: number;
    tipoPersona: string;
    entidad?: {
      id: number;
      claveAGEE: string;
      nombre: string;
    };
  };
}

// Función para hacer peticiones a Directus
async function fetchFromDirectus<T>(endpoint: string, params?: Record<string, any>): Promise<DirectusResponse<T>> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  // Agregar parámetros de consulta si existen
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener datos de Directus:', error);
    throw error;
  }
}

// Función para obtener conteos usando aggregate de Directus
async function obtenerConteoConFiltro(filtro?: string): Promise<number> {
  try {
    const params: Record<string, any> = {
      aggregate: JSON.stringify({
        count: '*'
      })
    };

    if (filtro) {
      params.filter = filtro;
    }

    const response = await fetchFromDirectus<any>('/items/denuncias', params);
    return response.data[0]?.count || 0;
  } catch (error) {
    console.error('Error al obtener conteo:', error);
    return 0;
  }
}

// Función para determinar la categoría de una denuncia
function determinarCategoriaDenuncia(faltaCometida: any): 'Hecho de Corrupción' | 'Falta Administrativa' | 'Sin Clasificar' {
  const tieneHechosCorrupcion = faltaCometida.hechosCorrupcion && faltaCometida.hechosCorrupcion.length > 0;
  const tieneFaltasGraves = faltaCometida.faltaGrave && faltaCometida.faltaGrave.length > 0;
  const tieneFaltasNoGraves = faltaCometida.faltaNoGrave && faltaCometida.faltaNoGrave.length > 0;

  if (tieneHechosCorrupcion) {
    return 'Hecho de Corrupción';
  } else if (tieneFaltasGraves || tieneFaltasNoGraves) {
    return 'Falta Administrativa';
  } else {
    return 'Sin Clasificar';
  }
}

// Función para obtener las métricas principales
export async function obtenerMetricasPrincipales(): Promise<MetricasPrincipales> {
  try {
    // Obtener todas las denuncias con los campos necesarios
    const todasLasDenuncias = await fetchFromDirectus<DenunciaDirectus>('/items/denuncias', {
      limit: -1, // Obtener todos los registros
      fields: [
        'id',
        'status',
        'date_created',
        'date_updated',
        'denunciante.anonimo',
        'faltaCometida.faltaGrave',
        'faltaCometida.faltaNoGrave', 
        'faltaCometida.hechosCorrupcion'
      ].join(',')
    });

    const denuncias = todasLasDenuncias.data;
    const totalDenuncias = denuncias.length;

    if (totalDenuncias === 0) {
      throw new Error('No se encontraron denuncias en la base de datos');
    }

    // Clasificar denuncias por categoría
    let hechosCorrupcion = 0;
    let faltasAdministrativas = 0;
    let denunciasAnonimas = 0;
    let denunciasAtendidas = 0; // Solo las ATENDIDAS se consideran resueltas
    let tiemposTotales: number[] = [];

    denuncias.forEach(denuncia => {
      // Clasificar por tipo de falta
      const categoria = determinarCategoriaDenuncia(denuncia.faltaCometida);
      if (categoria === 'Hecho de Corrupción') {
        hechosCorrupcion++;
      } else if (categoria === 'Falta Administrativa') {
        faltasAdministrativas++;
      }

      // Contar denuncias anónimas
      if (denuncia.denunciante?.anonimo === true) {
        denunciasAnonimas++;
      }

      // Contar denuncias ATENDIDAS y calcular tiempos de resolución
      if (denuncia.status === 'ATENDIDA') {
        denunciasAtendidas++;
        
        // Calcular tiempo de resolución solo para las ATENDIDAS
        if (denuncia.date_updated) {
          const fechaCreacion = new Date(denuncia.date_created);
          const fechaAtencion = new Date(denuncia.date_updated);
          const diferenciaDias = Math.floor((fechaAtencion.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diferenciaDias >= 0) {
            tiemposTotales.push(diferenciaDias);
          }
        }
      }
    });

    // Calcular métricas
    const porcentajeDenunciasAnonimas = Math.round((denunciasAnonimas / totalDenuncias) * 100);
    const tasaAtencion = Math.round((denunciasAtendidas / totalDenuncias) * 100); // Cambiado de "resolución" a "atención"
    
    const tiempoPromedioAtencion = tiemposTotales.length > 0 
      ? Math.round(tiemposTotales.reduce((sum, tiempo) => sum + tiempo, 0) / tiemposTotales.length)
      : 0;

    return {
      totalDenuncias,
      hechosCorrupcion,
      faltasAdministrativas,
      tiempoPromedioResolucion: tiempoPromedioAtencion, // Mantener el nombre de la interfaz pero usar lógica de atención
      porcentajeDenunciasAnonimas,
      tasaResolucion: tasaAtencion, // Mantener el nombre de la interfaz pero usar lógica de atención
    };

  } catch (error) {
    console.error('Error al obtener métricas principales:', error);
    throw new Error('No se pudieron obtener las métricas principales desde la API');
  }
}

// Función optimizada usando agregaciones de Directus (alternativa)
export async function obtenerMetricasPrincipalesOptimizada(): Promise<MetricasPrincipales> {
  try {
    // Obtener total de denuncias
    const totalDenuncias = await obtenerConteoConFiltro();

    // Obtener denuncias anónimas
    const denunciasAnonimas = await obtenerConteoConFiltro(
      JSON.stringify({ 'denunciante.anonimo': { '_eq': true } })
    );

    // Obtener denuncias ATENDIDAS (resueltas)
    const denunciasAtendidas = await obtenerConteoConFiltro(
      JSON.stringify({ 'status': { '_eq': 'ATENDIDA' } })
    );

    // Para clasificar por tipo de falta y calcular tiempos, necesitamos obtener los datos completos
    const denunciasCompletas = await fetchFromDirectus<DenunciaDirectus>('/items/denuncias', {
      limit: -1,
      fields: [
        'faltaCometida.faltaGrave',
        'faltaCometida.faltaNoGrave',
        'faltaCometida.hechosCorrupcion',
        'date_created',
        'date_updated',
        'status'
      ].join(',')
    });

    let hechosCorrupcion = 0;
    let faltasAdministrativas = 0;
    let tiemposTotales: number[] = [];

    denunciasCompletas.data.forEach(denuncia => {
      const categoria = determinarCategoriaDenuncia(denuncia.faltaCometida);
      if (categoria === 'Hecho de Corrupción') {
        hechosCorrupcion++;
      } else if (categoria === 'Falta Administrativa') {
        faltasAdministrativas++;
      }

      // Calcular tiempos de atención solo para denuncias ATENDIDAS
      if (denuncia.status === 'ATENDIDA' && denuncia.date_updated) {
        const fechaCreacion = new Date(denuncia.date_created);
        const fechaAtencion = new Date(denuncia.date_updated);
        const diferenciaDias = Math.floor((fechaAtencion.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diferenciaDias >= 0) {
          tiemposTotales.push(diferenciaDias);
        }
      }
    });

    const porcentajeDenunciasAnonimas = totalDenuncias > 0 ? Math.round((denunciasAnonimas / totalDenuncias) * 100) : 0;
    const tasaAtencion = totalDenuncias > 0 ? Math.round((denunciasAtendidas / totalDenuncias) * 100) : 0;
    const tiempoPromedioAtencion = tiemposTotales.length > 0 
      ? Math.round(tiemposTotales.reduce((sum, tiempo) => sum + tiempo, 0) / tiemposTotales.length)
      : 0;

    return {
      totalDenuncias,
      hechosCorrupcion,
      faltasAdministrativas,
      tiempoPromedioResolucion: tiempoPromedioAtencion,
      porcentajeDenunciasAnonimas,
      tasaResolucion: tasaAtencion,
    };

  } catch (error) {
    console.error('Error al obtener métricas optimizadas:', error);
    throw new Error('No se pudieron obtener las métricas principales desde la API');
  }
}

// Función para obtener datos mensuales (próxima implementación)
export async function obtenerDatosMensuales() {
  try {
    // Obtener todas las denuncias con los campos necesarios para clasificación y fecha
    const todasLasDenuncias = await fetchFromDirectus<DenunciaDirectus>('/items/denuncias', {
      limit: -1,
      fields: [
        'id',
        'date_created',
        'faltaCometida.faltaGrave',
        'faltaCometida.faltaNoGrave', 
        'faltaCometida.hechosCorrupcion'
      ].join(',')
    });

    const denuncias = todasLasDenuncias.data;

    // Agrupar por mes
    const datosPorMes: Record<string, {
      mes: string;
      totalDenuncias: number;
      soloFaltasGraves: number;
      soloFaltasNoGraves: number;
      soloHechosCorrupcion: number;
      faltasGravesYNoGraves: number;
      faltasYHechosCorrupcion: number;
      todasLasClasificaciones: number;
      sinClasificacion: number;
    }> = {};

    denuncias.forEach(denuncia => {
      const fecha = new Date(denuncia.date_created);
      const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      const mesNombre = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });

      if (!datosPorMes[mesKey]) {
        datosPorMes[mesKey] = {
          mes: mesNombre,
          totalDenuncias: 0,
          soloFaltasGraves: 0,
          soloFaltasNoGraves: 0,
          soloHechosCorrupcion: 0,
          faltasGravesYNoGraves: 0,
          faltasYHechosCorrupcion: 0,
          todasLasClasificaciones: 0,
          sinClasificacion: 0,
        };
      }

      datosPorMes[mesKey].totalDenuncias++;

      // Determinar qué clasificaciones tiene esta denuncia
      const tieneFaltasGraves = denuncia.faltaCometida.faltaGrave && denuncia.faltaCometida.faltaGrave.length > 0;
      const tieneFaltasNoGraves = denuncia.faltaCometida.faltaNoGrave && denuncia.faltaCometida.faltaNoGrave.length > 0;
      const tieneHechosCorrupcion = denuncia.faltaCometida.hechosCorrupcion && denuncia.faltaCometida.hechosCorrupcion.length > 0;

      // Clasificar según las combinaciones
      if (tieneFaltasGraves && tieneFaltasNoGraves && tieneHechosCorrupcion) {
        datosPorMes[mesKey].todasLasClasificaciones++;
      } else if ((tieneFaltasGraves || tieneFaltasNoGraves) && tieneHechosCorrupcion) {
        datosPorMes[mesKey].faltasYHechosCorrupcion++;
      } else if (tieneFaltasGraves && tieneFaltasNoGraves) {
        datosPorMes[mesKey].faltasGravesYNoGraves++;
      } else if (tieneFaltasGraves) {
        datosPorMes[mesKey].soloFaltasGraves++;
      } else if (tieneFaltasNoGraves) {
        datosPorMes[mesKey].soloFaltasNoGraves++;
      } else if (tieneHechosCorrupcion) {
        datosPorMes[mesKey].soloHechosCorrupcion++;
      } else {
        datosPorMes[mesKey].sinClasificacion++;
      }
    });

    // Convertir a array y ordenar por fecha
    const datosOrdenados = Object.keys(datosPorMes)
      .sort()
      .map(key => datosPorMes[key]);

    return datosOrdenados;

  } catch (error) {
    console.error('Error al obtener datos mensuales:', error);
    throw new Error('No se pudieron obtener los datos mensuales desde la API');
  }
}

// Función alternativa: Datos mensuales simplificados (3 categorías principales)
export async function obtenerDatosMensualesSimplificados() {
  try {
    const todasLasDenuncias = await fetchFromDirectus<DenunciaDirectus>('/items/denuncias', {
      limit: -1,
      fields: [
        'id',
        'date_created',
        'faltaCometida.faltaGrave',
        'faltaCometida.faltaNoGrave', 
        'faltaCometida.hechosCorrupcion'
      ].join(',')
    });

    const denuncias = todasLasDenuncias.data;

    const datosPorMes: Record<string, {
      mes: string;
      totalDenuncias: number;
      conFaltasAdministrativas: number;
      conHechosCorrupcion: number;
      mixtas: number; // Tienen ambas clasificaciones
      sinClasificacion: number;
    }> = {};

    denuncias.forEach(denuncia => {
      const fecha = new Date(denuncia.date_created);
      const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      const mesNombre = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });

      if (!datosPorMes[mesKey]) {
        datosPorMes[mesKey] = {
          mes: mesNombre,
          totalDenuncias: 0,
          conFaltasAdministrativas: 0,
          conHechosCorrupcion: 0,
          mixtas: 0,
          sinClasificacion: 0,
        };
      }

      datosPorMes[mesKey].totalDenuncias++;

      const tieneFaltas = (denuncia.faltaCometida.faltaGrave && denuncia.faltaCometida.faltaGrave.length > 0) ||
                         (denuncia.faltaCometida.faltaNoGrave && denuncia.faltaCometida.faltaNoGrave.length > 0);
      const tieneHechos = denuncia.faltaCometida.hechosCorrupcion && denuncia.faltaCometida.hechosCorrupcion.length > 0;

      if (tieneFaltas && tieneHechos) {
        datosPorMes[mesKey].mixtas++;
      } else if (tieneFaltas) {
        datosPorMes[mesKey].conFaltasAdministrativas++;
      } else if (tieneHechos) {
        datosPorMes[mesKey].conHechosCorrupcion++;
      } else {
        datosPorMes[mesKey].sinClasificacion++;
      }
    });

    return Object.keys(datosPorMes)
      .sort()
      .map(key => datosPorMes[key]);

  } catch (error) {
    console.error('Error al obtener datos mensuales simplificados:', error);
    throw new Error('No se pudieron obtener los datos mensuales simplificados desde la API');
  }
}

// Función para obtener tipos de denuncia (próxima implementación)
export async function obtenerTiposDenuncia() {
  // TODO: Implementar obtención de tipos de denuncia desde faltaGrave, faltaNoGrave, hechosCorrupcion
  throw new Error('Función no implementada aún');
}

// Función para obtener estatus de denuncias (próxima implementación)
export async function obtenerEstatusDenuncias() {
  // TODO: Implementar obtención de estatus agrupados
  throw new Error('Función no implementada aún');
}

// Función para obtener datos de entidades (próxima implementación)
export async function obtenerDatosEntidades() {
  // TODO: Implementar obtención de datos por entidad desde personaDenunciada.entidad
  throw new Error('Función no implementada aún');
}

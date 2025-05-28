// Archivo de prueba para verificar la integración con Directus
// Este archivo puede ser eliminado una vez que confirmes que todo funciona

import { obtenerMetricasPrincipales, obtenerMetricasPrincipalesOptimizada, obtenerDatosMensuales, obtenerDatosMensualesSimplificados } from './api-estadisticas';

// Función para probar la conexión básica
export async function probarConexionAPI() {
  try {
    console.log('🔄 Probando conexión con Directus...');
    
    const metricas = await obtenerMetricasPrincipales();
    
    console.log('✅ Conexión exitosa! Métricas obtenidas:');
    console.log('📊 Total denuncias:', metricas.totalDenuncias);
    console.log('🚨 Hechos de corrupción:', metricas.hechosCorrupcion);
    console.log('📋 Faltas administrativas:', metricas.faltasAdministrativas);
    console.log('⏱️ Tiempo promedio atención:', metricas.tiempoPromedioResolucion, 'días (solo ATENDIDAS)');
    console.log('👤 Denuncias anónimas:', metricas.porcentajeDenunciasAnonimas + '%');
    console.log('✅ Tasa de atención:', metricas.tasaResolucion + '% (solo ATENDIDAS)');
    
    return metricas;
    
  } catch (error) {
    console.error('❌ Error al conectar con la API:', error);
    throw error;
  }
}

// Función para probar datos mensuales detallados
export async function probarDatosMensualesDetallados() {
  try {
    console.log('🔄 Probando datos mensuales detallados...');
    
    const datosMensuales = await obtenerDatosMensuales();
    
    console.log('✅ Datos mensuales detallados obtenidos!');
    console.log('📅 Meses disponibles:', datosMensuales.length);
    
    if (datosMensuales.length > 0) {
      const ultimoMes = datosMensuales[datosMensuales.length - 1];
      console.log('📊 Último mes (' + ultimoMes.mes + '):');
      console.log('  - Total denuncias:', ultimoMes.totalDenuncias);
      console.log('  - Solo faltas graves:', ultimoMes.soloFaltasGraves);
      console.log('  - Solo faltas no graves:', ultimoMes.soloFaltasNoGraves);
      console.log('  - Solo hechos corrupción:', ultimoMes.soloHechosCorrupcion);
      console.log('  - Faltas graves + no graves:', ultimoMes.faltasGravesYNoGraves);
      console.log('  - Faltas + hechos corrupción:', ultimoMes.faltasYHechosCorrupcion);
      console.log('  - Todas las clasificaciones:', ultimoMes.todasLasClasificaciones);
      console.log('  - Sin clasificación:', ultimoMes.sinClasificacion);
    }
    
    return datosMensuales;
    
  } catch (error) {
    console.error('❌ Error al obtener datos mensuales detallados:', error);
    throw error;
  }
}

// Función para probar datos mensuales simplificados
export async function probarDatosMensualesSimplificados() {
  try {
    console.log('🔄 Probando datos mensuales simplificados...');
    
    const datosMensuales = await obtenerDatosMensualesSimplificados();
    
    console.log('✅ Datos mensuales simplificados obtenidos!');
    console.log('📅 Meses disponibles:', datosMensuales.length);
    
    if (datosMensuales.length > 0) {
      const ultimoMes = datosMensuales[datosMensuales.length - 1];
      console.log('📊 Último mes (' + ultimoMes.mes + '):');
      console.log('  - Total denuncias:', ultimoMes.totalDenuncias);
      console.log('  - Con faltas administrativas:', ultimoMes.conFaltasAdministrativas);
      console.log('  - Con hechos de corrupción:', ultimoMes.conHechosCorrupcion);
      console.log('  - Mixtas (ambas):', ultimoMes.mixtas);
      console.log('  - Sin clasificación:', ultimoMes.sinClasificacion);
      
      // Verificar que los números cuadren
      const suma = ultimoMes.conFaltasAdministrativas + ultimoMes.conHechosCorrupcion + ultimoMes.mixtas + ultimoMes.sinClasificacion;
      console.log('  - Verificación suma:', suma, '=', ultimoMes.totalDenuncias, suma === ultimoMes.totalDenuncias ? '✅' : '❌');
    }
    
    return datosMensuales;
    
  } catch (error) {
    console.error('❌ Error al obtener datos mensuales simplificados:', error);
    throw error;
  }
}

// Función para comparar ambos enfoques de datos mensuales
export async function compararDatosMensuales() {
  try {
    console.log('🔄 Comparando enfoques de datos mensuales...');
    
    const [detallados, simplificados] = await Promise.all([
      obtenerDatosMensuales(),
      obtenerDatosMensualesSimplificados()
    ]);
    
    console.log('📊 Comparación:');
    console.log('Detallados - Meses:', detallados.length);
    console.log('Simplificados - Meses:', simplificados.length);
    
    if (detallados.length > 0 && simplificados.length > 0) {
      const ultimoDetallado = detallados[detallados.length - 1];
      const ultimoSimplificado = simplificados[simplificados.length - 1];
      
      console.log('Último mes - Total denuncias:');
      console.log('  Detallado:', ultimoDetallado.totalDenuncias);
      console.log('  Simplificado:', ultimoSimplificado.totalDenuncias);
      console.log('  ¿Coinciden?', ultimoDetallado.totalDenuncias === ultimoSimplificado.totalDenuncias ? '✅' : '❌');
    }
    
    return { detallados, simplificados };
    
  } catch (error) {
    console.error('❌ Error al comparar datos mensuales:', error);
    throw error;
  }
}

// Función para probar la versión optimizada
export async function probarVersionOptimizada() {
  try {
    console.log('🔄 Probando versión optimizada...');
    
    const metricas = await obtenerMetricasPrincipalesOptimizada();
    
    console.log('✅ Versión optimizada funcionando!');
    console.log('Métricas:', metricas);
    
    return metricas;
    
  } catch (error) {
    console.error('❌ Error en versión optimizada:', error);
    throw error;
  }
}

// Función para comparar ambas versiones
export async function compararVersiones() {
  try {
    console.log('🔄 Comparando versiones...');
    
    const [version1, version2] = await Promise.all([
      obtenerMetricasPrincipales(),
      obtenerMetricasPrincipalesOptimizada()
    ]);
    
    console.log('📊 Comparación de resultados:');
    console.log('Versión 1 - Total:', version1.totalDenuncias);
    console.log('Versión 2 - Total:', version2.totalDenuncias);
    console.log('¿Coinciden?', version1.totalDenuncias === version2.totalDenuncias ? '✅' : '❌');
    
    return { version1, version2 };
    
  } catch (error) {
    console.error('❌ Error al comparar versiones:', error);
    throw error;
  }
}

// Función para verificar la estructura de datos
export async function verificarEstructuraDatos() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  if (!API_BASE_URL) {
    console.error('❌ NEXT_PUBLIC_BACKEND_URL no está configurada');
    return;
  }
  
  try {
    console.log('🔄 Verificando estructura de datos...');
    console.log('🌐 URL de la API:', API_BASE_URL);
    
    // Hacer una petición simple para obtener una muestra
    const response = await fetch(`${API_BASE_URL}/items/denuncias?limit=1&fields=*.*.*`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('📋 Estructura de datos (primera denuncia):');
    console.log(JSON.stringify(data.data[0], null, 2));
    
    return data;
    
  } catch (error) {
    console.error('❌ Error al verificar estructura:', error);
    throw error;
  }
}

// Función para verificar distribución de estatus
export async function verificarDistribucionEstatus() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  if (!API_BASE_URL) {
    console.error('❌ NEXT_PUBLIC_BACKEND_URL no está configurada');
    return;
  }
  
  try {
    console.log('🔄 Verificando distribución de estatus...');
    
    // Obtener conteos por cada estatus
    const estatus = ['REGISTRADA', 'TURNADA', 'PROCESO', 'ATENDIDA', 'PENDIENTE'];
    const conteos: Record<string, number> = {};
    
    for (const status of estatus) {
      const response = await fetch(`${API_BASE_URL}/items/denuncias?aggregate[count]=*&filter[status][_eq]=${status}`);
      const data = await response.json();
      conteos[status] = data.data[0]?.count || 0;
    }
    
    console.log('📊 Distribución por estatus:');
    Object.entries(conteos).forEach(([status, count]) => {
      console.log(`${status}: ${count} denuncias`);
    });
    
    const total = Object.values(conteos).reduce((sum, count) => sum + count, 0);
    console.log(`📈 Total: ${total} denuncias`);
    
    if (conteos.ATENDIDA > 0) {
      console.log(`✅ ${conteos.ATENDIDA} denuncias ATENDIDAS encontradas para cálculo de métricas`);
    } else {
      console.log('⚠️ No se encontraron denuncias ATENDIDAS - las métricas de tiempo y tasa serán 0');
    }
    
    return conteos;
    
  } catch (error) {
    console.error('❌ Error al verificar distribución de estatus:', error);
    throw error;
  }
}

// Función para análisis completo
export async function analisisCompleto() {
  try {
    console.log('🚀 Iniciando análisis completo...');
    
    const [metricas, datosMensuales, distribucionEstatus] = await Promise.all([
      probarConexionAPI(),
      probarDatosMensualesSimplificados(),
      verificarDistribucionEstatus()
    ]);
    
    console.log('📈 RESUMEN DEL ANÁLISIS:');
    console.log('='.repeat(50));
    console.log('📊 Métricas principales obtenidas ✅');
    console.log('📅 Datos mensuales obtenidos ✅');
    console.log('📋 Distribución de estatus obtenida ✅');
    console.log('='.repeat(50));
    
    return {
      metricas,
      datosMensuales,
      distribucionEstatus
    };
    
  } catch (error) {
    console.error('❌ Error en análisis completo:', error);
    throw error;
  }
}

// Instrucciones de uso
export const INSTRUCCIONES_PRUEBA = `
🧪 INSTRUCCIONES PARA PROBAR LA INTEGRACIÓN ACTUALIZADA:

1. Asegúrate de que NEXT_PUBLIC_BACKEND_URL esté configurada en tu .env.local:
   NEXT_PUBLIC_BACKEND_URL=https://tu-directus-url.com

2. En tu componente o página, importa y ejecuta:
   import { analisisCompleto, probarDatosMensualesSimplificados } from './test-api';
   
   // Análisis completo (recomendado)
   analisisCompleto().then(resultado => {
     console.log('Análisis completo:', resultado);
   });
   
   // O probar solo datos mensuales
   probarDatosMensualesSimplificados().then(datos => {
     console.log('Datos mensuales:', datos);
   });

3. Verifica en la consola del navegador los resultados.

4. NUEVAS FUNCIONALIDADES EN ESTA VERSIÓN:
   - Datos mensuales que manejan múltiples clasificaciones por denuncia
   - Versión detallada: 7 categorías diferentes de clasificación
   - Versión simplificada: 4 categorías (recomendada para la gráfica)
   - Gráfica de área apilada que muestra la composición de denuncias
   - Línea de total superpuesta para ver la tendencia general

5. CLASIFICACIONES MANEJADAS:
   - Solo faltas administrativas (graves o no graves)
   - Solo hechos de corrupción
   - Mixtas (faltas + hechos de corrupción)
   - Sin clasificación

6. Si hay errores, revisa:
   - La URL de Directus esté correcta
   - Los permisos de la colección 'denuncias'
   - Que existan denuncias con status "ATENDIDA" para las métricas
   - La estructura de campos coincida con la interfaz
   - Los arrays faltaGrave, faltaNoGrave, hechosCorrupcion estén disponibles

7. Una vez que funcione, puedes eliminar este archivo de prueba.
`;

console.log(INSTRUCCIONES_PRUEBA);

# API de Servidores de Contrataciones - Guía de Uso

## Descripción

Este documento explica cómo usar la API de Next.js para crear registros de servidores que intervienen en procedimientos de contrataciones públicas.

## Endpoint

```
POST http://localhost:3000/api/servidores-contrataciones
```

## Autenticación

La API requiere un token de autorización válido de Directus en el header:

```
Authorization: Bearer <tu_token_directus>
```

## Estructura de la Base de Datos

El sistema utiliza múltiples tablas relacionadas:

### Tabla Principal
- `servidores_intervengan_procedimientos_contrataciones`
  - Campos: id, entePublico, fecha, ejercicio, tipoProcedimiento, Observaciones
  - Foreign Keys: datosGenerales, empleoCargoComision, avaluosJustipreciacion, enajenacionBien, otorgamientoConcesion

### Tablas Relacionadas

1. **datos_generales** (Datos de la persona)
   - nombre, primerApellido, segundoApellido, curp, rfc, sexo

2. **empleos_cargos_comisiones** (Información del empleo)
   - entidadFederativa, nivelOrdenGobierno, ambitoPublico, nombreEntePublico, etc.

3. **dictaminaciones_avaluos** → **datos_dictaminaciones_avaluos** + **niveles_responsabilidades_avaluos**

4. **enajenaciones_bienes** → **datos_enajenaciones_bienes** + **niveles_responsabilidades_enajenaciones**

5. **otorgamientos_concesiones** → **datos_generales_concesiones** + **niveles_responsabilidades_concesiones** + **datos_personas_beneficiarias**

## Flujo de Guardado

El handler automáticamente:

1. ✅ Crea el registro en `datos_generales` con los datos de la persona
2. ✅ Crea el registro en `empleos_cargos_comisiones` con los datos del empleo
3. ✅ Procesa `contratacionAdquisiciones` (si existe, múltiples registros):
   - Crea `datos_personas_beneficiarias` (si hay beneficiarios)
   - Crea `niveles_responsabilidades_contrataciones_adquisiciones`
   - Crea `contrataciones_adquisiciones` con las referencias
   - Crea `datos_contrataciones_publicas`
4. ✅ Procesa `obrasPublicas` (si existe, múltiples registros):
   - Crea `datos_personas_beneficiarias` (si hay beneficiarios)
   - Crea `niveles_responsabilidades_contrataciones_adquisiciones` (reutilizado)
   - Crea `contrataciones_obras` con las referencias
   - Crea `datos_generales_obras`
5. ✅ Procesa `dictaminacionAvaluos` (si existe):
   - Crea `datos_dictaminaciones_avaluos`
   - Crea `niveles_responsabilidades_avaluos`
   - Crea `dictaminaciones_avaluos` con las referencias
6. ✅ Procesa `enajenacionBienes` (si existe):
   - Crea `datos_enajenaciones_bienes`
   - Crea `niveles_responsabilidades_enajenaciones`
   - Crea `enajenaciones_bienes` con las referencias
7. ✅ Procesa `otorgamientoConcesiones` (si existe):
   - Crea `datos_generales_concesiones`
   - Crea `datos_personas_beneficiarias` (si hay beneficiarios)
   - Crea `niveles_responsabilidades_concesiones`
   - Crea `otorgamientos_concesiones` con las referencias
8. ✅ Crea el registro principal en `servidores_intervengan_procedimientos_contrataciones`
9. ✅ Crea vínculos en `tipos_adquisiciones_obras` para relacionar contrataciones y obras con el registro principal

## Ejemplo de Uso con cURL

### Opción 1: Usar el script de prueba

```bash
cd herramienta-capturador-s2
./test-curl.sh
```

**Nota:** Antes de ejecutar, edita `test-curl.sh` y reemplaza el token con uno válido.

### Opción 2: cURL directo

```bash
curl -X POST http://localhost:3000/api/servidores-contrataciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "entePublico": 1,
    "fecha": "2025-10-22",
    "ejercicio": "2023",
    "tipoProcedimiento": "DICTAMEN_VALUATORIO",
    "observaciones": "Registro de prueba",
    "datosGenerales": {
      "nombre": "Juan Carlos",
      "primerApellido": "Pérez",
      "segundoApellido": "López",
      "curp": "PELJ850101HDFRPN09",
      "rfc": "PELJ850101ABC",
      "sexo": "HOMBRE"
    },
    "empleoCargoComision": {
      "entidadFederativa": "Ciudad de México",
      "nivelOrdenGobierno": "FEDERAL",
      "ambitoPublico": "EJECUTIVO",
      "nombreEntePublico": "Secretaría de Hacienda",
      "siglasEntePublico": "SHCP",
      "nivelJerarquico": "DIRECCION_AREA",
      "denominacion": "Director de Adquisiciones",
      "areaAdscripcion": "Dirección General de Recursos"
    },
    "dictaminacionAvaluos": [{
      "numeroExpediente": "AV-2023-001",
      "descripcion": "Dictaminación de avalúo",
      "fechaInicio": "2023-01-15",
      "fechaConclusion": "2023-03-20",
      "responsabilidades": [{
        "identificador": 1,
        "objetoResponsabilidad": "autorizaciones",
        "elaborar": false,
        "revisar": true,
        "firmarAutorizar": true,
        "supervisar": false,
        "emitirSuscribir": false
      }],
      "continuaParticipando": true
    }]
  }'
```

## Campos del Objeto JSON

### Campos Obligatorios (raíz)

```typescript
{
  entePublico: number,        // ID del ente público (debe existir en la tabla ente_publico)
  fecha: string,              // Fecha en formato YYYY-MM-DD
  ejercicio: string,          // Año de 4 dígitos (ej: "2023")
  tipoProcedimiento?: "CONTRATACION_PUBLICA" | "OTORGAMIENTO_CONCECIONES" |
                      "ENAJENACION_BIENES" | "DICTAMEN_VALUATORIO"
}
```

### Campos Opcionales según el tipo de procedimiento

#### datosGenerales (objeto)
```typescript
{
  nombre: string,
  primerApellido: string,
  segundoApellido?: string,
  curp: string,              // Formato: AAAA######HAAAAA##
  rfc: string,               // Formato: AAAA######AAA
  sexo: "HOMBRE" | "MUJER"
}
```

#### empleoCargoComision (objeto)
```typescript
{
  entidadFederativa: string,
  nivelOrdenGobierno: "FEDERAL" | "ESTATAL" | "MUNICIPAL_ALCALDIA",
  ambitoPublico: "EJECUTIVO" | "LEGISLATIVO" | "JUDICIAL" | "ORGANO_AUTONOMO",
  nombreEntePublico: string,
  siglasEntePublico?: string,
  nivelJerarquico: "OPERATIVO" | "ENLACE" | "JEFATURA_DEPARTAMENTO" | ...,
  denominacion: string,
  areaAdscripcion: string
}
```

#### dictaminacionAvaluos (array de objetos)
```typescript
[{
  numeroExpediente?: string,
  descripcion: string,
  fechaInicio?: string,
  fechaConclusion?: string,
  responsabilidades?: [{
    identificador: number,
    objetoResponsabilidad?: string,
    elaborar?: boolean,
    revisar?: boolean,
    firmarAutorizar?: boolean,
    supervisar?: boolean,
    emitirSuscribir?: boolean
  }],
  continuaParticipando?: boolean
}]
```

#### enajenacionBienes (array de objetos)
```typescript
[{
  numeroExpediente?: string,
  descripcion: string,
  fechaInicio?: string,
  fechaConclusion?: string,
  responsabilidades?: [...],  // Igual que dictaminacionAvaluos
  continuaParticipando?: boolean
}]
```

#### otorgamientoConcesiones (array de objetos)
```typescript
[{
  tipoActoJuridico?: ["CONCESIONES" | "LICENCIAS" | "PERMISOS" | "AUTORIZACIONES"],
  numeroExpediente?: string,
  denominacion?: string,
  objeto?: string,
  motivosFundamentos?: string,
  nombrePersonaFisica?: string,
  razonSocialPersonaMoral?: string,
  sector?: "PUBLICO" | "PRIVADO",
  fechaInicioVigencia?: string,
  fechaConclusionVigencia?: string,
  monto?: string,
  hipervinculo?: string,      // URL válida
  razonSocial?: string,
  nombreBeneficiario?: string,
  primerApellidoBeneficiario?: string,
  segundoApellidoBeneficiario?: string,
  continuaParticipando?: boolean
}]
```

## Respuestas de la API

### Éxito (201 Created)
```json
{
  "success": true,
  "message": "Servidor de contrataciones guardado exitosamente"
}
```

### Error de Validación (400 Bad Request)
```json
{
  "error": "Error de validación",
  "details": [
    {
      "path": "datosGenerales.curp",
      "message": "Formato de CURP inválido."
    }
  ]
}
```

### Error de Autenticación (401 Unauthorized)
```json
{
  "error": "No autorizado. Proporcione un token válido."
}
```

### Error del Servidor (500 Internal Server Error)
```json
{
  "error": "Error al guardar el registro",
  "message": "Descripción del error",
  "details": {...}
}
```

## Notas Importantes

1. **El `entePublico` debe existir** en la tabla `ente_publico` antes de crear un registro
2. **Los arrays solo procesan el primer elemento** (`dictaminacionAvaluos[0]`, etc.)
3. **Las responsabilidades se almacenan como JSON** en campos específicos de la BD
4. **El token de Directus expira** - necesitas renovarlo periódicamente
5. **Validación estricta**: Los datos se validan con Zod antes de guardarse

## Solución de Problemas

### Error: "Invalid foreign key for field datosGenerales"
- **Causa**: El ID referenciado no existe en la tabla relacionada
- **Solución**: Asegúrate de enviar objetos completos, no IDs directos

### Error: "No autorizado"
- **Causa**: Token inválido o expirado
- **Solución**: Obtén un nuevo token de Directus:
  ```bash
  curl -X POST http://localhost:8055/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "tu@email.com", "password": "tu_password"}'
  ```

### Error: "Error de validación"
- **Causa**: Los datos no cumplen con el schema de validación
- **Solución**: Revisa los `details` en la respuesta para ver qué campo falló

#### contratacionAdquisiciones (array de objetos)
```typescript
[{
  tipoArea?: ["AREA_REQUIRENTE" | "AREA_SUPERVISORA" | "AREA_CONTRATANTE" | ...],
  tipoAreaOtro?: string,
  responsabilidades?: [{
    identificador: number,
    objetoResponsabilidad: string,  // "autorizacion", "justificacion", "convocatoria", etc.
    elaborar?: boolean,
    revisar?: boolean,
    firmarAutorizar?: boolean,
    supervisar?: boolean,
    emitirSuscribir?: boolean
  }],
  numeroExpediente?: string,
  tipoProcedimiento?: "LICITACION_PUBLICA_NACIONAL" | "INVITACION_TRES_PERSONAS" | ...,
  tipoProcedimientoOtro?: string,
  materia?: "ARRENDAMIENTO" | "ADQUISICION" | "SERVICIOS" | "OTRO",
  materiaOtro?: string,
  fechaInicio?: string,
  fechaConclusion?: string,
  razonSocial?: string,
  nombreBeneficiario?: string,
  primerApellidoBeneficiario?: string,
  segundoApellidoBeneficiario?: string,
  continuaParticipando?: boolean
}]
```

#### obrasPublicas (array de objetos)
```typescript
[{
  tipoArea?: ["AREA_RESPONSABLE_EJECUCION" | "AREA_RESPONSABLE_CONTRATACION" | ...],
  tipoAreaOtro?: string,
  responsabilidades?: [...],  // Igual que contratacionAdquisiciones
  numeroExpediente?: string,
  tipoProcedimiento?: "LICITACION_PUBLICA_NACIONAL" | "INVITACION_TRES_PERSONAS" | ...,
  tipoProcedimientoOtro?: string,
  materia?: "OBRA_PUBLICA" | "SERVICIOS_RELACIONADOS" | "OTRO",
  materiaOtro?: string,
  fechaInicio?: string,
  fechaConclusion?: string,
  razonSocial?: string,
  nombreBeneficiario?: string,
  primerApellidoBeneficiario?: string,
  segundoApellidoBeneficiario?: string,
  continuaParticipando?: boolean
}]
```

## Desarrollo Futuro

### Pendiente de Implementar

- [x] Contrataciones de adquisiciones (`contratacionAdquisiciones`) - ✅ **IMPLEMENTADO**
- [x] Obras públicas (`obrasPublicas`) - ✅ **IMPLEMENTADO**
- [x] Soporte para múltiples elementos en arrays - ✅ **IMPLEMENTADO**
- [ ] Actualización de registros existentes (PUT/PATCH)
- [ ] Eliminación de registros (DELETE)
- [ ] Consulta de registros (GET con filtros)

## Archivos Relacionados

- **Handler**: `components/forms/servidoresContrataciones/handler.ts`
- **Schema**: `components/forms/servidoresContrataciones/schema.ts`
- **API Route**: `app/api/servidores-contrataciones/route.ts`
- **Test Script**: `test-curl.sh`
- **DDL**: `estructura_exportada_dbveaver_s2_.sql`

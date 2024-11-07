# S5 - Sistema de denuncias públicas

## Descripción

S5 es una aplicación web diseñada para gestionar denuncias públicas de faltas administrativas y hechos de corrupción. El sistema está construido con una arquitectura moderna utilizando Next.js y Directus como backend headless CMS.

## Tecnologías Utilizadas

- Frontend: 
  - Next.js
  - Tailwind CSS para estilos
  - shadcn/ui para componentes de UI
  - TypeScript
- Backend: 
  - Directus (Headless CMS)
  - PostgreSQL 14
- Despliegue:
  - Docker
  - Docker Compose

## Requisitos Previos

- Docker y Docker Compose
- Node.js (para desarrollo local)
- OpenSSL (para generar secretos)

## Stack Frontend

El frontend está construido con:
- **Next.js**: Framework de React para producción
- **TypeScript**: Para tipado estático
- **Tailwind CSS**: Para estilos utilitarios
- **shadcn/ui**: Colección de componentes reutilizables
  - Componentes accesibles y personalizables
  - Basados en Radix UI
  - Estilizados con Tailwind CSS
  - Totalmente tipados

## Configuración Inicial

1. Clona el repositorio:
```bash
git clone https://github.com/PDNMX/s5-reload.git
cd s5-reload
```

2. Copia el archivo `.env-EXAMPLE` a `.env`:
```bash
cp .env-EXAMPLE .env
```

3. Configura las variables en tu archivo `.env`:

```env
# Información de la aplicación
NEXT_PUBLIC_APP_NAME="S5"
NEXT_PUBLIC_APP_VER="2.0"
NEXT_PUBLIC_APP_INFO="Sistema de denuncias públicas de faltas administrativas y hechos de corrupción"

# URLs de la aplicación
NEXT_PUBLIC_BACKEND_URL=http://localhost:8055
NEXT_PUBLIC_URL=http://localhost:3000

# Configuración de NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<GENERA_UN_NUEVO_VALOR_CON_OPENSSL>
NEXT_TELEMETRY_DISABLED=1

# Configuración de la base de datos
DATABASE_NAME=directus
DATABASE_USERNAME=userpg
DATABASE_PASSWORD=<GENERA_UN_NUEVO_VALOR_SEGURO>

# Configuración de Directus
DIRECTUS_ADMIN_EMAIL=ejemplo@dominio.com
DIRECTUS_ADMIN_PASSWORD=directusPassword
DIRECTUS_KEY=<GENERA_UN_NUEVO_VALOR_SEGURO>
DIRECTUS_SECRET=<GENERA_UN_NUEVO_VALOR_SEGURO>
```

**Importante**: 
- Reemplaza todos los valores de ejemplo por valores seguros en producción
- Nunca compartas o expongas los valores de tu archivo `.env`


## Instalación y Ejecución

1. Construye e inicia todos los servicios con un solo comando:
```bash
docker-compose -p s5 up -d --build
```

Este comando:
- `-p s5`: Asigna un nombre al proyecto (puedes cambiarlo según prefieras)
- `up`: Inicia los servicios
- `-d`: Ejecuta en modo detached (background)
- `--build`: Reconstruye las imágenes si hay cambios

2. Los servicios estarán disponibles en:
   - Aplicación: http://localhost:3060
   - API (Directus): http://localhost:8055

## Desarrollo Local

Para desarrollo local, tienes dos opciones:

1. **Opción A: Todo en Docker** (recomendado para consistencia):
```bash
docker-compose -p s5 up -d --build
```

2. **Opción B: Desarrollo híbrido**:
   - Si prefieres ejecutar solo el frontend en modo desarrollo mientras mantienes el resto de servicios en Docker:
```bash
# Primero inicia los servicios de base de datos y API
docker-compose -p s5 up -d --build
# Luego inicia el servidor de desarrollo de Next.js
npm install
npm run dev
```

## Desarrollo de Componentes

Este proyecto utiliza shadcn/ui para los componentes de la interfaz. Para agregar nuevos componentes:

1. Usa el CLI de shadcn/ui:
```bash
npx shadcn-ui@latest add [component-name]
```

2. Los componentes se agregarán en `components/ui/`

3. Puedes personalizar los componentes modificando:
   - Los estilos en `components/ui/[component-name].tsx`
   - Las variables de Tailwind en `tailwind.config.js`
   - Los temas en `app/globals.css`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

## Servicios Docker

1. **Aplicación Next.js** (Puerto: 3060)
   - Aplicación principal
   - Construida desde el Dockerfile en la raíz

2. **API Directus** (Puerto: 8055)
   - Panel de administración
   - API REST y GraphQL
   - Requiere autenticación

3. **PostgreSQL** (No expuesto)
   - Base de datos principal
   - Datos persistentes mediante volumen Docker

## Seguridad

- Genera nuevos valores seguros para todos los secretos y contraseñas
- No expongas el archivo `.env` ni sus valores
- Cambia las credenciales por defecto de Directus
- Los puertos de la base de datos no están expuestos por seguridad

## Soporte

Para reportar problemas o solicitar ayuda, por favor crea un issue en el repositorio.

## Licencia

[Especificar la licencia del proyecto]
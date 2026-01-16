# Sistema 2 - PDN (Plataforma Digital Nacional)

Sistema de captura y gestión de datos de **Servidores Públicos que Intervengan en Procedimientos de Contrataciones Públicas**.

## Estructura del Proyecto

```
herramienta-capturador-s2/
├── docker-compose.yml    # Orquestación de todos los servicios
├── .env.example          # Variables de entorno (template)
├── backend/              # Backend (Directus CMS + PostgreSQL)
│   ├── Dockerfile
│   ├── migrations/
│   └── templates/
└── frontend/             # Frontend (Next.js 14 + React)
    ├── Dockerfile
    ├── app/
    └── components/
```

## Requisitos Previos

- **Docker**: 20.x o superior
- **Docker Compose**: 2.x o superior

## Inicio Rápido con Docker

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# =============================================================================
# BASE DE DATOS
# =============================================================================
DATABASE_NAME=directus
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu_password_seguro

# =============================================================================
# DIRECTUS (BACKEND)
# =============================================================================
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=tu_admin_password
DIRECTUS_SECRET=tu_secret_key_aqui

# URL pública del backend (como se ve desde el navegador)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8055

# =============================================================================
# FRONTEND
# =============================================================================
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Sistema 2 - PDN
NEXT_PUBLIC_APP_VER=2.0
NEXT_PUBLIC_APP_INFO=Servidores Públicos en Contrataciones

# NextAuth - Genera el secret con: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_nextauth_secret_aqui

# =============================================================================
# EMAIL (SMTP) - Opcional
# =============================================================================
EMAIL_FROM=noreply@example.com
EMAIL_TRANSPORT=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=tu_usuario_smtp
SMTP_PASSWORD=tu_password_smtp
```

### 2. Construir e iniciar los contenedores

```bash
# Construir las imágenes
docker compose build

# Iniciar todos los servicios
docker compose up -d
```

### 3. Acceder a la aplicación

| Servicio   | URL                   | Descripción    |
| ---------- | --------------------- | -------------- |
| Frontend   | http://localhost:3000 | Aplicación web |
| Backend    | http://localhost:8055 | Directus Admin |
| PostgreSQL | localhost:5433        | Base de datos  |

## Comandos Útiles

```bash
# Iniciar servicios
docker compose up -d

# Ver estado de los contenedores
docker compose ps

# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f frontend
docker compose logs -f api
docker compose logs -f db

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (CUIDADO: borra la base de datos)
docker compose down -v

# Reiniciar servicios
docker compose restart

# Reconstruir imágenes
docker compose build --no-cache

# Reconstruir e iniciar
docker compose up -d --build
```

## Desarrollo Local (sin Docker)

Si prefieres desarrollar sin Docker, puedes ejecutar el frontend localmente:

### Backend con Docker

```bash
# Iniciar solo el backend y base de datos
docker compose up -d api db
```

### Frontend local

```bash
cd frontend

# Configurar variables de entorno
cp .env-EXAMPLE .env
# Editar .env con las configuraciones necesarias

# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar servidor de desarrollo
npm run dev
```

## Tecnologías

### Backend

- **Directus**: 10.13.4 (Headless CMS)
- **PostgreSQL**: 14-alpine (Base de datos)
- **Docker**: Contenedorización

### Frontend

- **Next.js**: 14.2.25 (Framework React)
- **React**: 18.3.1
- **TypeScript**: 5.5.2
- **NextAuth.js**: 4.24.7 (Autenticación)
- **Tailwind CSS**: 3.4.4 (Estilos)
- **shadcn/ui**: Componentes UI
- **React Hook Form**: 7.52.0 (Formularios)
- **Zod**: 3.23.8 (Validación)
- **TanStack React Table**: 8.17.3 (Tablas)

## Estructura de Carpetas

### Backend (`backend/`)

```
backend/
├── Dockerfile            # Imagen de Directus
├── docker-compose.yml    # (legacy) Solo backend
├── migrations/           # Schema de Directus
│   ├── colecciones.yaml  # Definición de colecciones
│   └── roles.json        # Roles y permisos
├── templates/            # Plantillas de email
└── init.sql              # Datos iniciales
```

### Frontend (`frontend/`)

```
frontend/
├── Dockerfile            # Imagen de Next.js
├── app/                  # Next.js App Router
│   ├── (auth)/          # Rutas públicas (login)
│   └── (dashboard)/     # Rutas protegidas
├── components/          # Componentes React
│   ├── forms/          # Formularios con Zod
│   ├── tables/         # Tablas con TanStack
│   ├── layout/         # Layout components
│   └── ui/             # shadcn/ui components
├── lib/                # Utilidades y configuración
├── hooks/              # React hooks personalizados
├── services/           # Servicios (Directus SDK)
└── types/              # Tipos TypeScript
```

## Troubleshooting

### Los contenedores no inician

1. Verifica que Docker esté corriendo:

   ```bash
   docker info
   ```

2. Revisa los logs:

   ```bash
   docker compose logs -f
   ```

3. Verifica que los puertos estén disponibles (3000, 8055, 5433):
   ```bash
   lsof -i :3000
   lsof -i :8055
   lsof -i :5433
   ```

### Error de autenticación en el frontend

1. Verifica que `NEXT_PUBLIC_BACKEND_URL` apunte al backend correcto
2. Verifica que `NEXTAUTH_SECRET` esté configurado
3. Revisa las credenciales de admin en el backend:
   ```bash
   docker compose logs api | grep -i error
   ```

### Error de conexión a la base de datos

1. Verifica que PostgreSQL esté corriendo:

   ```bash
   docker compose ps db
   ```

2. Verifica el healthcheck:
   ```bash
   docker compose logs db
   ```

### El backend muestra error de email

El error `getaddrinfo ENOTFOUND smtp.example.com` es normal si no has configurado un servidor SMTP real. El sistema funcionará correctamente, solo las funciones de email estarán deshabilitadas.

### Reconstruir desde cero

Si necesitas empezar de cero:

```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

## Licencia

MIT License - Ver el archivo `LICENSE` para más detalles.

## Documentación Adicional

- **especificación-técnica-s2.yaml**: Especificación OpenAPI

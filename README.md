# Sistema 2 - PDN (Plataforma Digital Nacional)

Sistema de captura y gestión de datos de **Servidores Públicos que Intervengan en Procedimientos de Contrataciones Públicas**.

## Estructura del Proyecto

Este proyecto está organizado en dos partes independientes:

```
s2-basado-s3-frontend/
├── backend/          # Backend (Directus CMS + PostgreSQL)
└── frontend/         # Frontend (Next.js 14 + React)
```

## Requisitos Previos

- **Node.js**: 20.14.9 o superior
- **npm**: 9.x o superior
- **Docker**: 20.x o superior (para el backend)
- **Docker Compose**: 2.x o superior (para el backend)

## Configuración Inicial

### 1. Backend (Directus)

El backend utiliza Directus como CMS headless con PostgreSQL como base de datos.

#### Configurar variables de entorno

```bash
cd backend
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Database
DATABASE_NAME=directus
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu_password_seguro

# Directus Admin
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=tu_admin_password
DIRECTUS_SECRET=tu_secret_key_aqui

# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8055

# Email (SMTP)
EMAIL_FROM=noreply@example.com
EMAIL_TRANSPORT=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=tu_usuario_smtp
SMTP_PASSWORD=tu_password_smtp
```

#### Iniciar el backend

```bash
cd backend
docker-compose up -d
```

El backend estará disponible en: `http://localhost:8055`

#### Verificar que el backend esté funcionando

```bash
docker-compose logs -f api
```

### 2. Frontend (Next.js)

El frontend es una aplicación Next.js 14 con App Router.

#### Configurar variables de entorno

```bash
cd frontend
cp .env-EXAMPLE .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8055

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret_key_para_nextauth
```

#### Instalar dependencias

```bash
cd frontend
npm install
```

#### Iniciar el servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

## Comandos Útiles

### Backend

```bash
cd backend

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver estado de los contenedores
docker-compose ps
```

### Frontend

```bash
cd frontend

# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run start        # Inicia el servidor de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
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
├── docker-compose.yml    # Configuración de servicios
├── Dockerfile            # Imagen de Directus
├── migrations/           # Schema de Directus
├── templates/            # Plantillas de email
└── init.sql              # Datos iniciales
```

### Frontend (`frontend/`)

```
frontend/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Rutas públicas (login)
│   └── (dashboard)/     # Rutas protegidas
├── components/          # Componentes React
│   ├── forms/          # Formularios
│   ├── tables/         # Tablas
│   ├── layout/         # Layout components
│   └── ui/             # shadcn/ui components
├── lib/                # Utilidades y configuración
├── hooks/              # React hooks personalizados
├── services/           # Servicios (Directus SDK)
└── types/              # Tipos TypeScript
```

## Flujo de Trabajo de Desarrollo

1. **Iniciar el backend**:
   ```bash
   cd backend && docker-compose up -d
   ```

2. **Iniciar el frontend**:
   ```bash
   cd frontend && npm run dev
   ```

3. **Acceder a la aplicación**:
   - Frontend: http://localhost:3000
   - Backend (Directus Admin): http://localhost:8055

## Despliegue

### Backend

El backend se despliega usando Docker. Asegúrate de configurar las variables de entorno apropiadas para producción.

### Frontend

```bash
cd frontend
npm run build
npm run start
```

O usando Docker:

```bash
cd frontend
docker build -t s2-frontend .
docker run -p 3000:3000 s2-frontend
```

## Troubleshooting

### El backend no inicia

1. Verifica que Docker esté corriendo
2. Revisa los logs: `docker-compose logs -f`
3. Verifica que los puertos 8055 y 5433 estén disponibles

### Error de autenticación en el frontend

1. Verifica que `NEXT_PUBLIC_BACKEND_URL` apunte al backend correcto
2. Verifica que `NEXTAUTH_SECRET` esté configurado
3. Revisa las credenciales de admin en el backend

### Error de conexión a la base de datos

1. Verifica que PostgreSQL esté corriendo: `docker-compose ps`
2. Revisa las credenciales en el archivo `.env` del backend

## Licencia

Ver el archivo `LICENSE` para más detalles.

## Documentación Adicional

- **CLAUDE.md**: Guía completa para asistentes de IA
- **API-USAGE.md**: Documentación de uso de la API
- **especifación-técnica-s2.yaml**: Especificación OpenAPI

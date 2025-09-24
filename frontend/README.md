# S2 Frontend - Sistema de Servidores Públicos

Frontend completo para el Sistema de gestión de servidores públicos que intervengan en procedimientos de contrataciones públicas de la Plataforma Digital Nacional (PDN).

## 🚀 Tecnologías

- **Framework**: Next.js 14 con App Router
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **TypeScript**: Completamente tipado
- **Autenticación**: NextAuth.js
- **Backend**: Directus (Headless CMS)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## 📁 Estructura del Proyecto

```
app/
├── (dashboard)/
│   ├── inicio/               # Dashboard principal
│   ├── servidores/           # Gestión de servidores públicos
│   ├── contrataciones/       # Módulo de contrataciones
│   ├── expedientes/          # Sistema de expedientes
│   └── reportes/             # Reportes y analytics
├── (auth)/
│   └── login/                # Página de autenticación
├── api/
│   └── auth/[...nextauth]/   # API de NextAuth
├── layout.tsx                # Layout principal
└── globals.css               # Estilos globales

components/
├── ui/                       # shadcn/ui components
├── layout/                   # Componentes de layout
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── navigation.tsx
│   └── user-nav.tsx
├── forms/                    # Formularios
├── tables/                   # Tablas de datos
└── charts/                   # Gráficos y visualizaciones

lib/
├── auth-options.ts           # Configuración NextAuth
├── directus.ts               # Cliente Directus
├── utils.ts                  # Utilidades
└── validations.ts            # Esquemas Zod

types/
├── index.ts                  # Tipos principales
└── next-auth.ts              # Tipos NextAuth
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
NEXT_PUBLIC_APP_NAME="S2 - Sistema de Servidores Públicos"
NEXT_PUBLIC_BACKEND_URL=http://localhost:8055
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
DIRECTUS_EMAIL=admin@example.com
DIRECTUS_PASSWORD=password123
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🎨 Diseño y Características

### Sistema de Colores Gubernamental

- **Primario**: `#8B1538` (Rojo gubernamental)
- **Secundario**: `#1C4E80` (Azul institucional)
- **Acento**: `#B8860B` (Dorado)
- **México**: Verde `#006847`, Blanco `#FFFFFF`, Rojo `#CE1126`

### Características Principales

1. **Autenticación Segura**
   - Login con NextAuth.js
   - Integración con Directus
   - Protección de rutas
   - Manejo de sesiones

2. **Dashboard Ejecutivo**
   - Estadísticas en tiempo real
   - Gráficos interactivos
   - Notificaciones y alertas
   - Métricas principales

3. **Gestión de Servidores Públicos**
   - CRUD completo
   - Validación de CURP y RFC
   - Filtros avanzados
   - Export de datos

4. **Módulo de Contrataciones**
   - Gestión de procedimientos
   - Estados y workflows
   - Seguimiento de montos
   - Asignación de servidores

5. **Sistema de Expedientes**
   - Gestión documental
   - Control de vencimientos
   - Upload de archivos
   - Histórico de cambios

6. **Reportes y Analytics**
   - Gráficos interactivos
   - Filtros dinámicos
   - Export múltiples formatos
   - Dashboards personalizables

## 🏛️ Características Gubernamentales

### Accesibilidad (WCAG 2.1)
- Navegación por teclado
- Screen reader support
- Alto contraste
- Zoom de texto

### Seguridad
- Autenticación robusta
- Validación de datos
- Sanitización de inputs
- Protección CSRF

### Localización Mexicana
- Formato de fechas mexicano
- Validación de CURP/RFC
- Moneda en pesos mexicanos
- Textos gubernamentales estándar

## 📊 Componentes Principales

### Layout Components
- `<Header />` - Barra superior con navegación
- `<Sidebar />` - Menú lateral colapsible
- `<Navigation />` - Breadcrumbs
- `<UserNav />` - Menú de usuario

### Data Display
- `<DataTable />` - Tabla con paginación y filtros
- `<StatsCard />` - Cards de estadísticas
- `<Badge />` - Estados y categorías
- `<OverviewChart />` - Gráficos de resumen

### Forms
- `<LoginForm />` - Autenticación
- `<PublicServantForm />` - Registro de servidores
- `<SearchFilters />` - Filtros avanzados

### Charts & Analytics
- `<OverviewChart />` - Gráfico de barras
- `<PieChartComponent />` - Gráficos circulares
- `<StatsCard />` - Métricas con iconos

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Inicio producción
npm run start

# Linting
npm run lint

# Verificación de tipos
npm run type-check
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel
```

### Docker
```bash
# Construir imagen
docker build -t s2-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 s2-frontend
```

## 📝 Validaciones

El sistema incluye validaciones robustas:

- **CURP**: Formato mexicano de 18 caracteres
- **RFC**: Con homoclave válida
- **Nombres**: Solo caracteres españoles
- **Fechas**: Formato ISO y rangos válidos
- **Montos**: Números positivos con formato moneda

## 🔗 Integración con Backend

La aplicación se conecta al backend Directus mediante:

- Cliente SDK oficial de Directus
- Autenticación JWT
- APIs RESTful
- Upload de archivos
- Manejo de errores

## 📋 Próximas Mejoras

- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Export a más formatos
- [ ] Firma electrónica
- [ ] Integración con e.firma

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo de la Plataforma Digital Nacional.

---

**Desarrollado para la Plataforma Digital Nacional (PDN)**
**Sistema de Servidores Públicos que Intervengan en Procedimientos de Contrataciones Públicas**
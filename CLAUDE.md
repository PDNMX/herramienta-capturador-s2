# CLAUDE.md

This file provides comprehensive guidance for AI assistants (Claude, GPT, etc.) when working with code in this repository.

## Project Overview

This is a **Next.js 14 (App Router)** frontend application for **Sistema 2 (S2)** - "Servidores Públicos que Intervengan en Procedimientos de Contrataciones Públicas" (Public Servants Involved in Public Procurement Procedures).

The application is a **data capture and management tool** for tracking public servants involved in public procurement processes within the **PDN (Plataforma Digital Nacional)** - Mexico's National Digital Platform.

**Project Name**: `s2-basado-s3-frontend`
**Frontend Directory**: `frontend/` (Next.js application)
**Backend Directory**: `backend/` (Directus CMS)
**Version**: 2.0
**Purpose**: Administrative data management for public procurement oversight

## Technology Stack

### Core Framework & Runtime
- **Next.js**: 14.2.25 (App Router with Server Components)
- **React**: 18.3.1 (with React Server Components)
- **TypeScript**: 5.5.2 (strict mode enabled)
- **Node.js**: 20.14.9

### Authentication & Security
- **NextAuth.js**: 4.24.7
  - Strategy: JWT with automatic token refresh
  - Provider: Credentials (Directus backend)
  - Middleware-based route protection (`/inicio/*`)

### Backend & API
- **@directus/sdk**: 15.1.0 (Headless CMS integration)
- **Directus**: 10.13.4 (Backend CMS)
- **PostgreSQL**: 14-alpine (Database)
- Authentication: Cookie auth (browser) + Static token (server)

### UI Components & Design System
- **Radix UI**: Collection of 15+ headless primitives (@radix-ui/react-*)
- **shadcn/ui**: Pre-built accessible components
- **Tailwind CSS**: 3.4.4 (utility-first styling)
- **tailwindcss-animate**: 1.0.7
- **class-variance-authority**: 0.7.0 (component variants)
- **clsx + tailwind-merge**: Conditional class handling
- **next-themes**: 0.3.0 (dark mode support)
- **lucide-react**: 0.399.0 (icon library)

### Forms & Validation
- **React Hook Form**: 7.52.0 (form state management)
- **Zod**: 3.23.8 (TypeScript-first schema validation)
- **@hookform/resolvers**: 3.6.0 (Zod + Hook Form integration)

### Data Display & Visualization
- **@tanstack/react-table**: 8.17.3 (headless tables with sorting/filtering)
- **recharts**: 2.12.7 (charts and graphs)
- **react-simple-maps**: 3.0.0 (geographic maps)
- **react-tooltip**: 5.27.1

### File Handling
- **@uploadthing/react**: 6.7.2 (file upload components)
- **xlsx**: 0.18.5 (Excel file processing)

### Development Tools
- **ESLint**: 8.0.0 (with TypeScript plugin)
- **PostCSS**: 8.4.38
- **Autoprefixer**: 10.4.19

## Common Commands

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend (Docker Environment)
```bash
cd backend
docker-compose up -d # Start backend (Directus + PostgreSQL)

# The backend runs on port 8055 by default
# Database migrations are applied automatically on startup
```

## Architecture

### Directory Structure

```
s2-basado-s3-frontend/
├── .gitignore                          # Root git ignore rules
├── CLAUDE.md                           # AI assistant guidance (this file)
├── API-USAGE.md                        # API usage documentation
├── LICENSE                             # License file
├── especifación-técnica-s2.yaml        # OpenAPI specification (35 KB)
│
├── backend/                            # 🔧 BACKEND (Directus CMS)
│   ├── .gitignore                      # Backend git ignore
│   ├── .env.example                    # Environment template
│   ├── docker-compose.yml              # Directus + PostgreSQL services
│   ├── Dockerfile                      # Directus backend image
│   ├── ddl.sql                         # Database DDL schema
│   ├── init.sql                        # Seed data (31 MB)
│   ├── init-modificaciones-db.sh       # Custom DB initialization script
│   ├── logo-pdn-white.svg              # Logo for Directus assets
│   ├── migrations/                     # Directus schema migrations
│   │   ├── colecciones.yaml            # Database schema (YAML)
│   │   └── roles.json                  # User roles config
│   └── templates/                      # Email templates (Liquid syntax)
│       ├── base.liquid                 # Base template
│       ├── password-reset.liquid
│       ├── user-invitation.liquid
│       └── user-registration.liquid
│
└── frontend/                           # ⚛️ FRONTEND (Next.js Application)
    ├── .env                            # Local environment variables (not committed)
    ├── .env-EXAMPLE                    # Environment template
    ├── .eslintrc.json                  # ESLint configuration
    ├── .gitignore                      # Frontend git ignore rules
    ├── components.json                 # shadcn/ui configuration
    ├── next.config.js                  # Next.js config (standalone output)
    ├── tsconfig.json                   # TypeScript config (strict mode, @/* aliases)
    ├── tailwind.config.js              # Tailwind config (HSL colors, dark mode)
    ├── postcss.config.js               # PostCSS config
    ├── package.json                    # npm dependencies
    ├── package-lock.json               # Dependency lock
    ├── yarn.lock                       # Yarn lock file
    ├── middleware.ts                   # Route protection (/inicio/* routes)
    ├── next-env.d.ts                   # Next.js TypeScript declarations
    ├── Dockerfile                      # Docker image for Next.js
    ├── docker-compose.yml              # Optional frontend compose file
    │
    ├── public/                         # Static assets
    │   ├── logo-pdn-white.svg          # PDN logo
    │   └── anexo-formato.pdf           # Annex document
    │
    ├── app/                            # Next.js 14 App Router
    │   ├── layout.tsx                  # Root layout with SessionProvider
    │   ├── globals.css                 # Global Tailwind styles (140 lines)
    │   ├── not-found.tsx               # 404 page
    │   ├── favicon.ico
    │   │
    │   ├── api/
    │   │   └── auth/
    │   │       └── [...nextauth]/
    │   │           └── route.ts        # NextAuth API handler
    │   │
    │   ├── (auth)/                     # Public auth route group
    │   │   └── (signin)/
    │   │       ├── layout.tsx          # Minimal auth layout
    │   │       └── page.tsx            # Login page (Landing component)
    │   │
    │   └── (dashboard)/                # Protected dashboard route group
    │       └── inicio/                 # Main dashboard namespace
    │           ├── page.tsx            # Dashboard home (statistics cards)
    │           ├── layout.tsx          # Dashboard layout (Header + Sidebar)
    │           │
    │           ├── directorio/         # Directory CRUD
    │           │   ├── page.tsx        # List view with table
    │           │   ├── create/
    │           │   │   └── page.tsx    # Create form
    │           │   └── [directorioId]/
    │           │       └── page.tsx    # Edit/view form
    │           │
    │           └── entes/              # Public entities CRUD
    │               ├── page.tsx        # List view with table
    │               ├── create/
    │               │   └── page.tsx    # Create form
    │               └── [enteId]/
    │                   └── page.tsx    # Edit/view form
    │
    ├── components/                     # React components (72 files)
    │   ├── breadcrumb.tsx              # Breadcrumb navigation
    │   ├── dashboard-nav.tsx           # Sidebar navigation
    │   ├── icons.tsx                   # Radix icons collection
    │   ├── overview.tsx                # Dashboard overview component
    │   │
    │   ├── forms/                      # Form components
    │   │   ├── user-auth-form.tsx      # Login form
    │   │   ├── directorio-form.tsx     # Directory form
    │   │   ├── ente-form.tsx           # Entity form (Zod + React Hook Form)
    │   │   ├── faltas-graves-pm-form.tsx
    │   │   │                           # Serious faults form (legal persons)
    │   │   ├── servidores-contrataciones-form.tsx
    │   │   │                           # Main procurement form
    │   │   │
    │   │   └── servidoresContrataciones/
    │   │       ├── schema.ts           # Zod validation schema
    │   │       ├── defaults.ts         # Default values
    │   │       ├── handler.ts          # Submission handler
    │   │       ├── servidores-contrataciones-form.tsx
    │   │       │                       # Main form wrapper
    │   │       └── sections/           # Multi-step form sections
    │   │           ├── DatosGeneralesSection.tsx
    │   │           ├── ContratacionAdquisicionesSection.tsx
    │   │           ├── ContratacionObrasPublicasSection.tsx
    │   │           ├── DictaminacionAvaluosSection.tsx
    │   │           ├── EmpleoCargoComisionSection.tsx
    │   │           ├── EnajenacionBienesSection.tsx
    │   │           └── OtorgamientoConcesionesSection.tsx
    │   │
    │   ├── tables/                     # Table components (TanStack React Table)
    │   │   ├── directorio-table/
    │   │   │   ├── columns.tsx         # Column definitions
    │   │   │   ├── cell-action.tsx     # Row actions (edit/delete)
    │   │   │   └── table.tsx           # Main table component
    │   │   │
    │   │   ├── entes-table/
    │   │   │   ├── columns.tsx         # Dynamic columns
    │   │   │   ├── cell-action.tsx     # Action buttons
    │   │   │   └── table.tsx           # Main component
    │   │   │
    │   │   ├── cell-entes-table/
    │   │   └── cobertura-table/
    │   │
    │   ├── layout/                     # Layout components
    │   │   ├── header.tsx              # Top header with logo + user menu
    │   │   ├── sidebar.tsx             # Left sidebar navigation
    │   │   ├── mobile-sidebar.tsx      # Mobile responsive sidebar
    │   │   ├── landing.tsx             # Landing/login layout
    │   │   ├── user-nav.tsx            # User dropdown menu
    │   │   ├── providers.tsx           # Client providers wrapper
    │   │   ├── logo.svg                # App logo
    │   │   ├── ico_s2.svg              # S2 icon
    │   │   ├── ico_s3.svg              # S3 icon
    │   │   └── ThemeToggle/
    │   │       ├── theme-provider.tsx  # next-themes provider
    │   │       └── theme-toggle.tsx    # Dark mode toggle
    │   │
    │   ├── modal/
    │   │   └── alert-modal.tsx         # Confirmation modal
    │   │
    │   └── ui/                         # shadcn/ui components (35+ components)
    │       ├── accordion.tsx
    │       ├── alert.tsx
    │       ├── alert-dialog.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── button.tsx              # Primary button with variants
    │       ├── calendar.tsx            # Date picker
    │       ├── card.tsx
    │       ├── checkbox.tsx
    │       ├── combobox.tsx            # Autocomplete
    │       ├── data-table.tsx          # Enhanced table
    │       ├── adjustable-data-table.tsx
    │       ├── dialog.tsx              # Modal dialog
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx                # React Hook Form wrapper
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── multi-select.tsx
    │       ├── popover.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx               # Slide-out drawer
    │       ├── switch.tsx              # Toggle
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx               # Notifications
    │       ├── toaster.tsx
    │       └── use-toast.ts            # Toast hook
    │
    ├── hooks/
    │   └── useCurrentSession.tsx       # Session hook with auto-logout
    │
    ├── lib/                            # Utilities & config
    │   ├── auth-options.ts             # NextAuth config + callbacks
    │   ├── directus.ts                 # Directus client (browser, cookie auth)
    │   └── utils.ts                    # Utility functions (cn, handleError)
    │
    ├── services/
    │   └── directus.ts                 # Directus SDK factory (static token auth)
    │
    ├── types/
    │   ├── index.ts                    # General types (NavItem)
    │   └── next-auth.ts                # NextAuth type extensions
    │
    └── constants/
        └── data.ts                     # Navigation items, static data
```

### Authentication Flow

The application uses NextAuth.js with a custom Directus credentials provider:

1. **Login**: User submits credentials → `services/directus.ts::login()` calls Directus `/auth/login`
2. **Session**: JWT tokens stored in session with automatic refresh logic
3. **Token Refresh**: When access token expires, `lib/auth-options.ts` uses Directus refresh endpoint
4. **Protected Routes**: `middleware.ts` protects all `/inicio/*` routes
5. **Session Hook**: `useCurrentSession` handles session state and force logout on token errors

**Important**: The authentication uses two Directus client patterns:
- `lib/directus.ts`: Default client with cookie auth (browser-side)
- `services/directus.ts`: Factory function accepting static tokens (server/auth)

### Directus Integration

The backend is a Directus instance that manages:
- User authentication and authorization
- Collections for "entes", "directorio", "faltas graves", etc.
- File uploads (via Directus assets)
- Custom database schema defined in `migrations/colecciones.yaml`

**Key Environment Variables**:
- `NEXT_PUBLIC_BACKEND_URL`: Directus API URL (default: http://localhost:8055)
- `NEXTAUTH_URL`: Frontend URL (default: http://localhost:3000)
- `NEXTAUTH_SECRET`: Secret for JWT signing

### Form Architecture

Forms use a consistent pattern:
1. **Validation**: Zod schemas for type-safe validation
2. **Form State**: React Hook Form with `useForm` and `zodResolver`
3. **Submission**: Forms call Directus SDK methods with `withToken(session.access_token)`
4. **Sections**: Complex forms are broken into section components (see `components/forms/sections/`)

Example form flow:
```tsx
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {...}
})

const onSubmit = async (data: FormData) => {
  const api = directus(session.access_token)
  await api.request(createItem('collection', data))
}
```

### Table Components

Tables use @tanstack/react-table with custom column definitions. Each table has:
- `columns.tsx`: Column definitions with sorting, filtering
- `client.tsx` or `page.tsx`: Main table component with data fetching
- Client-side pagination, sorting, and filtering

### Route Groups

The app uses Next.js route groups for layout organization:
- `(auth)`: Public authentication pages with minimal layout
- `(dashboard)`: Protected pages with full dashboard layout (sidebar, header, breadcrumbs)

Protected routes are enforced by `middleware.ts` which checks for NextAuth session on `/inicio/*` paths.

## Development Patterns

### Data Fetching
- Use Directus SDK with `readItems`, `readItem`, `createItem`, `updateItem`, `deleteItem`
- Always wrap requests with `withToken(session.access_token)` for authenticated calls
- Handle errors with try/catch and display toast notifications

### Session Management
- Use `useCurrentSession()` hook to access session and auto-handle logout
- Check `session?.forceLogout` to redirect to login on token errors
- Session refresh is automatic via NextAuth callbacks

### Component Patterns
- Server Components by default, use `"use client"` only when needed
- shadcn/ui components in `components/ui/` (installed via `npx shadcx-ui@latest add`)
- Custom components in feature-specific directories (`forms/`, `tables/`, etc.)

### Environment Files
- `.env-EXAMPLE`: Template with all required variables
- `.env`: Local development environment (not committed)
- Docker Compose uses environment variables for Directus and PostgreSQL configuration

## Database Schema

### Directus Collections Structure

The Directus schema is defined in `migrations/colecciones.yaml` and applied automatically on Docker startup.

**Main Collections**:
1. **entes** (Public Entities/Organizations)
   - Fields: nombre, ambitoGobierno (Estatal/Federal/Municipal), poderGobierno (Ejecutivo/Judicial/Legislativo/Autonomo)
   - Boolean flags: controlOIC, controlTribunal, sistema1-6 participation
   - Location: entidad, municipio references

2. **directorio** (Directory of contacts/personnel)

3. **contrataciones_publicas** (Public Procurement)
   - Subgroups: contrataciones_adquisiciones, contrataciones_obras, datos_contrataciones_publicas

4. **faltas_graves** (Serious Faults/Sanctions)

**Database Initialization**:
- Schema: `migrations/colecciones.yaml` (YAML format, applied via `node cli.js schema apply --yes`)
- Custom SQL: `init-modificaciones-db.sh` (PostgreSQL client modifications)
- Seed Data: `init.sql` (31MB file with initial data)

**Data Models Pattern**:
```typescript
// Example: Directus SDK usage
const api = directus(session.access_token);

// CRUD operations
await api.request(createItem('collection', data));
await api.request(readItems('collection', { filter, limit }));
await api.request(updateItem('collection', id, data));
await api.request(deleteItem('collection', id));
```

## Known Configuration Details

### ESLint Rules
The project has custom ESLint rules that disable some warnings:
- `@typescript-eslint/no-unused-vars`: off
- `import/no-unresolved`: off
- `no-console`: off
- `react/no-unescaped-entities`: off

### Path Aliases
TypeScript paths configured with `@/*` pointing to project root:
```typescript
import { foo } from "@/lib/utils"  // resolves to ./lib/utils
```

### Next.js Configuration
- Output mode: `standalone` (for Docker deployment)
- No image optimization domains configured (uses Directus assets)

## API Specification

The project includes an OpenAPI specification in `especifación-técnica-s2.yaml` defining the expected API structure for the Sistema 3 endpoints.

## Email Templates

Directus email templates (Liquid syntax) are in `templates/`:
- `base.liquid`: Base template
- `password-reset.liquid`
- `user-invitation.liquid`
- `user-registration.liquid`

These templates are copied into the Directus container via Docker volumes.

---

## Quick Reference for AI Assistants

### Key File Locations
- **Auth Config**: `frontend/lib/auth-options.ts`
- **Directus Client (Browser)**: `frontend/lib/directus.ts`
- **Directus Client (Server/Auth)**: `frontend/services/directus.ts`
- **Session Hook**: `frontend/hooks/useCurrentSession.tsx`
- **Route Protection**: `frontend/middleware.ts`
- **Frontend Environment Template**: `frontend/.env-EXAMPLE`
- **Backend Environment Template**: `backend/.env.example`
- **DB Schema**: `backend/migrations/colecciones.yaml`

### Common Patterns to Follow

**1. Creating a New Form Component**
```tsx
// 1. Define Zod schema
const formSchema = z.object({ /* ... */ })

// 2. Use React Hook Form
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { /* ... */ }
})

// 3. Submit with Directus SDK
const onSubmit = async (data) => {
  const api = directus(session.access_token)
  await api.request(createItem('collection', data))
  toast({ title: "Success!" })
}
```

**2. Creating a New Table Component**
```tsx
// 1. Define columns (columns.tsx)
export const columns: ColumnDef<DataType>[] = [
  { accessorKey: "field", header: "Header" }
]

// 2. Fetch data with Directus
const api = directus(session.access_token)
const data = await api.request(readItems('collection'))

// 3. Use TanStack React Table
const table = useReactTable({
  data, columns, getCoreRowModel: getCoreRowModel()
})
```

**3. Adding a New Protected Route**
```bash
# Create in app/(dashboard)/inicio/
frontend/app/(dashboard)/inicio/nueva-ruta/
├── page.tsx        # List/main view
├── create/
│   └── page.tsx    # Create form
└── [id]/
    └── page.tsx    # Edit/view form
```

**4. Working with Environment Variables**
- Always use `NEXT_PUBLIC_` prefix for browser-accessible variables
- Add to `.env-EXAMPLE` for documentation
- Access with `process.env.NEXT_PUBLIC_VARIABLE_NAME`

**5. Styling Conventions**
- Use Tailwind utility classes
- Dark mode classes: `dark:bg-slate-900`
- Responsive: `md:flex lg:grid-cols-3`
- Colors: HSL variables `bg-primary text-primary-foreground`

### Architecture Principles

1. **Server Components First**: Use `"use client"` only when needed (forms, interactivity)
2. **Path Aliases**: Always use `@/` imports (`import { cn } from "@/lib/utils"`)
3. **Type Safety**: Leverage Zod for runtime validation + TypeScript types
4. **Error Handling**: Use try/catch with toast notifications for user feedback
5. **Session Management**: Use `useCurrentSession()` hook, never access session directly
6. **Directus Auth**: Always use `withToken(session.access_token)` for authenticated requests

### Docker Commands Reference
```bash
# Start backend services
docker-compose up -d

# View logs
docker-compose logs -f directus
docker-compose logs -f postgres

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Rebuild Directus image
docker-compose up -d --build directus
```

### Troubleshooting

**Auth Issues**:
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXT_PUBLIC_BACKEND_URL` matches Directus URL
- Check session with `useCurrentSession()` hook

**Directus Connection Issues**:
- Ensure Docker containers are running: `docker-compose ps`
- Verify port 8055 is accessible
- Check Directus logs: `docker-compose logs directus`

**Build Errors**:
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

---

## Project Statistics

- **Total TypeScript Files**: ~50
- **UI Components**: 35+ (shadcn/ui)
- **Form Components**: 7 main forms + 7 section components
- **Table Components**: 4 feature tables
- **Configuration Files**: 8
- **Lines of Global CSS**: 140
- **Database Seed Data**: 31MB (init.sql)

---

## Version Information

- **Project Version**: 2.0
- **Next.js**: 14.2.25
- **React**: 18.3.1
- **TypeScript**: 5.5.2
- **Directus**: 10.13.4
- **PostgreSQL**: 14-alpine

Last Updated: 2025-10-19

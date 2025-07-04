# Herramienta Capturadora S2 - Sistema de los Servidores Públicos que Intervengan en Procedimientos de Contrataciones Públicas

[![PDN](https://img.shields.io/badge/PDN-S2-pink)](https://www.plataformadigitalnacional.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-brightgreen)]()
[![License](https://img.shields.io/badge/license-GNU%20General%20Public%20License%20v3.0-blue)]()

Herramienta de captura para el Sistema de los servidores públicos que intervengan en procedimientos de contrataciones públicas (S2) de la Plataforma Digital Nacional.

## 📋 Descripción

La Herramienta de Captura de Información ha sido desarrollada para facilitar la recopilación, gestión y envío de datos conforme a los estándares establecidos en el Sistema de los servidores públicos que intervengan en procedimientos de contrataciones públicas (Sistema 2) de la Plataforma Digital Nacional (PDN).

Esta herramienta permite:

- Gestionar y validar datos según los estándares de la PDN
- Facilitar la integración con el resto de los sistemas de la PDN
- Mantener un control de acceso basado en roles
- Generar reportes y visualizaciones de la información capturada

## ⭐ Características principales

- Sistema de autenticación y gestión de usuarios
- Roles diferenciados (administrador y capturador)
- Formularios de captura con validación de datos
- Asignación de entes públicos a usuarios
- Interfaz intuitiva para la gestión de información
- Sistema de notificaciones por correo electrónico
- Compatibilidad con múltiples navegadores web

## 📦 Inicio rápido

### Prerrequisitos

#### Software

- Sistema Operativo: Linux (recomendado Ubuntu Server LTS)
- Docker
- Docker Compose
- Git
- Servicio SMTP configurado

#### Hardware Recomendado

- Procesador: 4 CPU
- Memoria: 8 GB RAM
- Almacenamiento: 50 GB libres (aplicaciones/código)
- Almacenamiento BD: 200 GB (inicial e incremental)

### Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/PDNMX/herramienta-capturador-s2.git

cd herramienta-capturador-s2
```

2. Crear archivo de variables de entorno

```bash
cp .env.example .env
```

3. Configurar las variables de entorno en el archivo `.env`:

```env
PUBLIC_URL=http://localhost:8055
DATABASE_USERNAME=usuarioPostgres
DATABASE_PASSWORD=passwordEjemplo
DIRECTUS_SECRET=<GENERA_UN_NUEVO_VALOR_SEGURO>
DIRECTUS_ADMIN_EMAIL=ejemplo@dominio.com
DIRECTUS_ADMIN_PASSWORD=directusPassword
EMAIL_FROM=no-reply@gmail.com
EMAIL_TRANSPORT=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=25
SMTP_USER=correo.ejemplo@gmail.com
SMTP_PASSWORD=passwordEjemplo
SMTP_SECURE=false
SMTP_IGNORE_TLS=false
```

4. Construir y levantar los contenedores

```bash
docker-compose -p herramienta-s2 up -d --build
```

5. Acceder a la aplicación en `http://localhost:8055`

## 💻 Uso

### Roles de Usuario

1. **Administrador**

   - Gestión de usuarios
   - Creación de entes públicos
   - Configuración del sistema
   - Acceso a todas las funcionalidades

2. **Capturador**

   - Captura de información
   - Gestión de registros de su ente público

3. ## **Interconexión**
   - Proporciona información a la PDN

### Funcionalidades Principales

- Captura de faltas administrativas
- Gestión de servidores públicos sancionados
- Administración de particulares sancionados
- Generación de reportes
- Gestión de catálogos

## 🛠️ Tecnologías utilizadas

- Directus (CMS y API)
- PostgreSQL
- Docker
- Node.js
- React

## 📚 Documentación

- [Manual de Usuario](https://docs.google.com/document/d/12LIM8TGrI4UPKKdULLzGnFirZWOF0gS3CHVDKpc0byA/edit?usp=sharing)
- [Manual de Instalación](https://docs.google.com/document/d/1RQFbQunsWU4kxGK1UOlqILrw3rUO1Z0YdWKe_MjASvM/edit?usp=sharing)

## ✉️ Soporte

Para soporte técnico, contactar a través del [formulario oficial de requerimientos de la SESNA](https://docs.google.com/forms/d/e/1FAIpQLSeaX8fdDP-XJpjazsDB9Utwthqsh-tUkykf7o_dJ99U45MIRQ/viewform).

## ⚖️ Licencia

Este proyecto está bajo la Licencia GNU General Public License v3.0 - ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado por la Plataforma Digital Nacional

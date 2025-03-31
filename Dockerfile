FROM directus/directus:10

# Cambiar a usuario root para instalar dependencias globales
USER root

# Habilitar corepack
RUN corepack enable

# Eliminar los archivos existentes si existen
RUN rm -f /usr/local/bin/pnpm /usr/local/bin/pnpx

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Limpiar la caché de pnpm solo si el directorio existe
RUN [ ! -d /root/.local/share/pnpm/store/v3/files ] || pnpm store prune

# Instalar soporte para locales y ICU
RUN apk add --no-cache --update tzdata musl-locales icu-data-full icu-libs

# Configurar las variables de entorno para usar es_MX.utf8
ENV LANG=es_MX.UTF-8 \
    LC_ALL=es_MX.UTF-8 \
    LC_COLLATE=es-MX-x-icu \
    LC_CTYPE=es_MX.UTF-8 \
    TZ=America/Mexico_City

# Cambiar de nuevo al usuario node
USER node

# Instalar el módulo de Directus
RUN pnpm install directus-extension-schema-management-module@1.5.0 --no-verify-store-integrity
## Create Production Image
FROM directus/directus:10

USER root
RUN npm install -g corepack@latest && corepack enable
RUN apk add --no-cache postgresql-client

# Crear directorio para archivos estáticos
#RUN mkdir -p /directus/uploads

# Copiar el logo
COPY logo-pdn-white.svg /directus/uploads/21cc850a-1c0c-4d15-aeeb-2ec0a8e98c26.svg

# Copiar el script de inicialización
COPY init-modificaciones-db.sh /directus/init-modificaciones-db.sh
RUN chmod +x /directus/init-modificaciones-db.sh

# Copiar las extensiones construidas
#COPY --from=builder --chown=node:node /directus/extensions /directus/extensions

# Instalar módulo de gestión de esquemas para importar
USER node
RUN pnpm install directus-extension-schema-management-module@1.5.0
#ejemplo para el taller de la jornada interconexion

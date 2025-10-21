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

# Crear directorio de extensiones
RUN mkdir -p /directus/extensions/directus-extension-schema-management-module

# Instalar módulo de gestión de esquemas
USER node
RUN pnpm install directus-extension-schema-management-module@1.5.0

# Copiar el módulo manteniendo la estructura dist/
USER root
RUN cp -r /directus/node_modules/directus-extension-schema-management-module/dist /directus/extensions/directus-extension-schema-management-module/ && \
    cp /directus/node_modules/directus-extension-schema-management-module/package.json /directus/extensions/directus-extension-schema-management-module/ && \
    chown -R node:node /directus/extensions

USER node

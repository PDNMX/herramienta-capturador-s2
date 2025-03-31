#!/bin/sh
set -e

# Verificar que el collate esté disponible
echo "Verificando collate es-MX-x-icu..."
psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "SELECT * FROM pg_collation WHERE collname = 'es-MX-x-icu';"

# Configurar el collate en la base de datos si no está configurado
echo "Configurando collate es-MX-x-icu..."
psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "ALTER DATABASE ${POSTGRES_DB} SET LC_COLLATE = 'es-MX-x-icu';"
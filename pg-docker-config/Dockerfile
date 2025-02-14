# Dockerfile para PostgreSQL con soporte de ICU
FROM postgres:latest

# Instala las dependencias necesarias para ICU
RUN apt-get update && \
    apt-get install -y locales && \
    locale-gen en_US.UTF-8 es_MX.UTF-8 && \
    update-locale LANG=en_US.UTF-8 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Configura el collation insensible a mayúsculas y minúsculas
RUN echo "CREATE DATABASE mydatabase WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'es_MX.UTF-8' LC_CTYPE = 'es_MX.UTF-8';" > /docker-entrypoint-initdb.d/init.sql
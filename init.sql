-- Crear la base de datos con el collate
CREATE DATABASE directus
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_MX.utf8'
    LC_CTYPE = 'es_MX.utf8'
    TEMPLATE template0;

-- Conectar a la base de datos
\c directus;

-- Configurar el collate para tablas específicas
CREATE TABLE ejemplo (
    nombre VARCHAR(50) COLLATE "es_MX.utf8"
);
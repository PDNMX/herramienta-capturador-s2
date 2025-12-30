-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION userpg;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP SEQUENCE public.contrataciones_adquisiciones_id_seq;

CREATE SEQUENCE public.contrataciones_adquisiciones_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.contrataciones_adquisiciones_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.contrataciones_adquisiciones_id_seq TO userpg;

-- DROP SEQUENCE public.contrataciones_obras_id_seq;

CREATE SEQUENCE public.contrataciones_obras_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.contrataciones_obras_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.contrataciones_obras_id_seq TO userpg;

-- DROP SEQUENCE public.contrataciones_publicas_id_seq;

CREATE SEQUENCE public.contrataciones_publicas_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.contrataciones_publicas_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.contrataciones_publicas_id_seq TO userpg;

-- DROP SEQUENCE public.datos_contrataciones_publicas_id_seq;

CREATE SEQUENCE public.datos_contrataciones_publicas_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.datos_contrataciones_publicas_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.datos_contrataciones_publicas_id_seq TO userpg;

-- DROP SEQUENCE public.datos_dictaminaciones_avaluos_id_seq;

CREATE SEQUENCE public.datos_dictaminaciones_avaluos_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.datos_dictaminaciones_avaluos_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.datos_dictaminaciones_avaluos_id_seq TO userpg;

-- DROP SEQUENCE public.datos_enajenaciones_bienes_id_seq;

CREATE SEQUENCE public.datos_enajenaciones_bienes_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.datos_enajenaciones_bienes_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.datos_enajenaciones_bienes_id_seq TO userpg;

-- DROP SEQUENCE public.datos_generales_concesiones_id_seq;

CREATE SEQUENCE public.datos_generales_concesiones_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.datos_generales_concesiones_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.datos_generales_concesiones_id_seq TO userpg;

-- DROP SEQUENCE public.datos_generales_id_seq;

CREATE SEQUENCE public.datos_generales_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.datos_generales_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.datos_generales_id_seq TO userpg;

-- DROP SEQUENCE public.datos_generales_obras_id_seq;

CREATE SEQUENCE public.datos_generales_obras_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.datos_generales_obras_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.datos_generales_obras_id_seq TO userpg;

-- DROP SEQUENCE public.datos_otorgamientos_concesiones_id_seq;

CREATE SEQUENCE public.datos_otorgamientos_concesiones_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.datos_otorgamientos_concesiones_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.datos_otorgamientos_concesiones_id_seq TO userpg;

-- DROP SEQUENCE public.datos_personas_beneficiarias_id_seq;

CREATE SEQUENCE public.datos_personas_beneficiarias_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.datos_personas_beneficiarias_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.datos_personas_beneficiarias_id_seq TO userpg;

-- DROP SEQUENCE public.dictaminaciones_avaluos_id_seq;

CREATE SEQUENCE public.dictaminaciones_avaluos_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.dictaminaciones_avaluos_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.dictaminaciones_avaluos_id_seq TO userpg;

-- DROP SEQUENCE public.directus_activity_id_seq;

CREATE SEQUENCE public.directus_activity_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.directus_activity_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.directus_activity_id_seq TO userpg;

-- DROP SEQUENCE public.directus_fields_id_seq;

CREATE SEQUENCE public.directus_fields_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.directus_fields_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.directus_fields_id_seq TO userpg;

-- DROP SEQUENCE public.directus_notifications_id_seq;

CREATE SEQUENCE public.directus_notifications_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.directus_notifications_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.directus_notifications_id_seq TO userpg;

-- DROP SEQUENCE public.directus_permissions_id_seq;

CREATE SEQUENCE public.directus_permissions_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.directus_permissions_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.directus_permissions_id_seq TO userpg;

-- DROP SEQUENCE public.directus_presets_id_seq;

CREATE SEQUENCE public.directus_presets_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.directus_presets_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.directus_presets_id_seq TO userpg;

-- DROP SEQUENCE public.directus_relations_id_seq;

CREATE SEQUENCE public.directus_relations_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.directus_relations_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.directus_relations_id_seq TO userpg;

-- DROP SEQUENCE public.directus_revisions_id_seq;

CREATE SEQUENCE public.directus_revisions_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.directus_revisions_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.directus_revisions_id_seq TO userpg;

-- DROP SEQUENCE public.directus_settings_id_seq;

CREATE SEQUENCE public.directus_settings_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.directus_settings_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.directus_settings_id_seq TO userpg;

-- DROP SEQUENCE public.directus_webhooks_id_seq;

CREATE SEQUENCE public.directus_webhooks_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.directus_webhooks_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.directus_webhooks_id_seq TO userpg;

-- DROP SEQUENCE public.empleos_cargos_comisiones_id_seq;

CREATE SEQUENCE public.empleos_cargos_comisiones_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.empleos_cargos_comisiones_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.empleos_cargos_comisiones_id_seq TO userpg;

-- DROP SEQUENCE public.enajenaciones_bienes_id_seq;

CREATE SEQUENCE public.enajenaciones_bienes_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.enajenaciones_bienes_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.enajenaciones_bienes_id_seq TO userpg;

-- DROP SEQUENCE public.ente_publico_id_seq;

CREATE SEQUENCE public.ente_publico_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.ente_publico_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.ente_publico_id_seq TO userpg;

-- DROP SEQUENCE public.niveles_jerarquicos_id_seq;

CREATE SEQUENCE public.niveles_jerarquicos_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.niveles_jerarquicos_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.niveles_jerarquicos_id_seq TO userpg;

-- DROP SEQUENCE public.niveles_responsabilidades_avaluos_id_seq;

CREATE SEQUENCE public.niveles_responsabilidades_avaluos_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.niveles_responsabilidades_avaluos_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.niveles_responsabilidades_avaluos_id_seq TO userpg;

-- DROP SEQUENCE public.niveles_responsabilidades_concesiones_id_seq;

CREATE SEQUENCE public.niveles_responsabilidades_concesiones_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.niveles_responsabilidades_concesiones_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.niveles_responsabilidades_concesiones_id_seq TO userpg;

-- DROP SEQUENCE public.niveles_responsabilidades_contrataciones_adquisiciones_id_seq;

CREATE SEQUENCE public.niveles_responsabilidades_contrataciones_adquisiciones_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.niveles_responsabilidades_contrataciones_adquisiciones_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.niveles_responsabilidades_contrataciones_adquisiciones_id_seq TO userpg;

-- DROP SEQUENCE public.niveles_responsabilidades_enajenaciones_id_seq;

CREATE SEQUENCE public.niveles_responsabilidades_enajenaciones_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.niveles_responsabilidades_enajenaciones_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.niveles_responsabilidades_enajenaciones_id_seq TO userpg;

-- DROP SEQUENCE public.niveles_responsabilidades_otro_adquisiciones_id_seq;

CREATE SEQUENCE public.niveles_responsabilidades_otro_adquisiciones_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.niveles_responsabilidades_otro_adquisiciones_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.niveles_responsabilidades_otro_adquisiciones_id_seq TO userpg;

-- DROP SEQUENCE public.niveles_responsabilidades_otro_avaluos_id_seq;

CREATE SEQUENCE public.niveles_responsabilidades_otro_avaluos_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.niveles_responsabilidades_otro_avaluos_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.niveles_responsabilidades_otro_avaluos_id_seq TO userpg;

-- DROP SEQUENCE public.niveles_responsabilidades_otro_concesiones_id_seq;

CREATE SEQUENCE public.niveles_responsabilidades_otro_concesiones_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.niveles_responsabilidades_otro_concesiones_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.niveles_responsabilidades_otro_concesiones_id_seq TO userpg;

-- DROP SEQUENCE public.niveles_responsabilidades_otro_enajecaciones_id_seq;

CREATE SEQUENCE public.niveles_responsabilidades_otro_enajecaciones_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.niveles_responsabilidades_otro_enajecaciones_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.niveles_responsabilidades_otro_enajecaciones_id_seq TO userpg;

-- DROP SEQUENCE public.otorgamientos_concesiones_id_seq;

CREATE SEQUENCE public.otorgamientos_concesiones_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.otorgamientos_concesiones_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.otorgamientos_concesiones_id_seq TO userpg;

-- DROP SEQUENCE public.tipos_adquisiciones_obras_id_seq;

CREATE SEQUENCE public.tipos_adquisiciones_obras_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.tipos_adquisiciones_obras_id_seq OWNER TO userpg;
GRANT ALL ON SEQUENCE public.tipos_adquisiciones_obras_id_seq TO userpg;
-- public.directus_activity definition

-- Drop table

-- DROP TABLE public.directus_activity;

CREATE TABLE public.directus_activity (
	id serial4 NOT NULL,
	"action" varchar(45) NOT NULL,
	"user" uuid NULL,
	"timestamp" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	ip varchar(50) NULL,
	user_agent text NULL,
	collection varchar(64) NOT NULL,
	item varchar(255) NOT NULL,
	"comment" text NULL,
	origin varchar(255) NULL,
	CONSTRAINT directus_activity_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_activity OWNER TO userpg;
GRANT ALL ON TABLE public.directus_activity TO userpg;


-- public.directus_extensions definition

-- Drop table

-- DROP TABLE public.directus_extensions;

CREATE TABLE public.directus_extensions (
	enabled bool DEFAULT true NOT NULL,
	id uuid NOT NULL,
	folder varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL,
	bundle uuid NULL,
	CONSTRAINT directus_extensions_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_extensions OWNER TO userpg;
GRANT ALL ON TABLE public.directus_extensions TO userpg;


-- public.directus_fields definition

-- Drop table

-- DROP TABLE public.directus_fields;

CREATE TABLE public.directus_fields (
	id serial4 NOT NULL,
	collection varchar(64) NOT NULL,
	field varchar(64) NOT NULL,
	special varchar(64) NULL,
	interface varchar(64) NULL,
	"options" json NULL,
	display varchar(64) NULL,
	display_options json NULL,
	readonly bool DEFAULT false NOT NULL,
	hidden bool DEFAULT false NOT NULL,
	sort int4 NULL,
	width varchar(30) DEFAULT 'full'::character varying NULL,
	translations json NULL,
	note text NULL,
	conditions json NULL,
	required bool DEFAULT false NULL,
	"group" varchar(64) NULL,
	validation json NULL,
	validation_message text NULL,
	CONSTRAINT directus_fields_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_fields OWNER TO userpg;
GRANT ALL ON TABLE public.directus_fields TO userpg;


-- public.directus_migrations definition

-- Drop table

-- DROP TABLE public.directus_migrations;

CREATE TABLE public.directus_migrations (
	"version" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"timestamp" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT directus_migrations_pkey PRIMARY KEY (version)
);

-- Permissions

ALTER TABLE public.directus_migrations OWNER TO userpg;
GRANT ALL ON TABLE public.directus_migrations TO userpg;


-- public.directus_relations definition

-- Drop table

-- DROP TABLE public.directus_relations;

CREATE TABLE public.directus_relations (
	id serial4 NOT NULL,
	many_collection varchar(64) NOT NULL,
	many_field varchar(64) NOT NULL,
	one_collection varchar(64) NULL,
	one_field varchar(64) NULL,
	one_collection_field varchar(64) NULL,
	one_allowed_collections text NULL,
	junction_field varchar(64) NULL,
	sort_field varchar(64) NULL,
	one_deselect_action varchar(255) DEFAULT 'nullify'::character varying NOT NULL,
	CONSTRAINT directus_relations_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_relations OWNER TO userpg;
GRANT ALL ON TABLE public.directus_relations TO userpg;


-- public.directus_roles definition

-- Drop table

-- DROP TABLE public.directus_roles;

CREATE TABLE public.directus_roles (
	id uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	icon varchar(30) DEFAULT 'supervised_user_circle'::character varying NOT NULL,
	description text NULL,
	ip_access text NULL,
	enforce_tfa bool DEFAULT false NOT NULL,
	admin_access bool DEFAULT false NOT NULL,
	app_access bool DEFAULT true NOT NULL,
	CONSTRAINT directus_roles_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_roles OWNER TO userpg;
GRANT ALL ON TABLE public.directus_roles TO userpg;


-- public.directus_translations definition

-- Drop table

-- DROP TABLE public.directus_translations;

CREATE TABLE public.directus_translations (
	id uuid NOT NULL,
	"language" varchar(255) NOT NULL,
	"key" varchar(255) NOT NULL,
	value text NOT NULL,
	CONSTRAINT directus_translations_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_translations OWNER TO userpg;
GRANT ALL ON TABLE public.directus_translations TO userpg;


-- public.directus_collections definition

-- Drop table

-- DROP TABLE public.directus_collections;

CREATE TABLE public.directus_collections (
	collection varchar(64) NOT NULL,
	icon varchar(30) NULL,
	note text NULL,
	display_template varchar(255) NULL,
	hidden bool DEFAULT false NOT NULL,
	singleton bool DEFAULT false NOT NULL,
	translations json NULL,
	archive_field varchar(64) NULL,
	archive_app_filter bool DEFAULT true NOT NULL,
	archive_value varchar(255) NULL,
	unarchive_value varchar(255) NULL,
	sort_field varchar(64) NULL,
	accountability varchar(255) DEFAULT 'all'::character varying NULL,
	color varchar(255) NULL,
	item_duplication_fields json NULL,
	sort int4 NULL,
	"group" varchar(64) NULL,
	collapse varchar(255) DEFAULT 'open'::character varying NOT NULL,
	preview_url varchar(255) NULL,
	"versioning" bool DEFAULT false NOT NULL,
	CONSTRAINT directus_collections_pkey PRIMARY KEY (collection),
	CONSTRAINT directus_collections_group_foreign FOREIGN KEY ("group") REFERENCES public.directus_collections(collection)
);

-- Permissions

ALTER TABLE public.directus_collections OWNER TO userpg;
GRANT ALL ON TABLE public.directus_collections TO userpg;


-- public.directus_folders definition

-- Drop table

-- DROP TABLE public.directus_folders;

CREATE TABLE public.directus_folders (
	id uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	parent uuid NULL,
	CONSTRAINT directus_folders_pkey PRIMARY KEY (id),
	CONSTRAINT directus_folders_parent_foreign FOREIGN KEY (parent) REFERENCES public.directus_folders(id)
);

-- Permissions

ALTER TABLE public.directus_folders OWNER TO userpg;
GRANT ALL ON TABLE public.directus_folders TO userpg;


-- public.directus_permissions definition

-- Drop table

-- DROP TABLE public.directus_permissions;

CREATE TABLE public.directus_permissions (
	id serial4 NOT NULL,
	"role" uuid NULL,
	collection varchar(64) NOT NULL,
	"action" varchar(10) NOT NULL,
	permissions json NULL,
	validation json NULL,
	presets json NULL,
	fields text NULL,
	CONSTRAINT directus_permissions_pkey PRIMARY KEY (id),
	CONSTRAINT directus_permissions_role_foreign FOREIGN KEY ("role") REFERENCES public.directus_roles(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.directus_permissions OWNER TO userpg;
GRANT ALL ON TABLE public.directus_permissions TO userpg;


-- public.contrataciones_adquisiciones definition

-- Drop table

-- DROP TABLE public.contrataciones_adquisiciones;

CREATE TABLE public.contrataciones_adquisiciones (
	id serial4 NOT NULL,
	"tipoArea" json NOT NULL,
	"nivelResponsabilidadContratacion" int4 NULL,
	"informacionPersonasBeneficiarias" int4 NULL,
	"entePublico" int4 NULL,
	"continuaParticipando" varchar(255) DEFAULT NULL::character varying NULL,
	CONSTRAINT contrataciones_adquisiciones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.contrataciones_adquisiciones OWNER TO userpg;
GRANT ALL ON TABLE public.contrataciones_adquisiciones TO userpg;


-- public.contrataciones_obras definition

-- Drop table

-- DROP TABLE public.contrataciones_obras;

CREATE TABLE public.contrataciones_obras (
	id serial4 NOT NULL,
	"tipoArea" json NULL,
	"nivelResponsabilidadObra" int4 NULL,
	"informacionPersonasBeneficiarias" int4 NULL,
	"entePublico" int4 NULL,
	"continuaParticipando" varchar(255) DEFAULT NULL::character varying NULL,
	CONSTRAINT contrataciones_obras_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.contrataciones_obras OWNER TO userpg;
GRANT ALL ON TABLE public.contrataciones_obras TO userpg;


-- public.contrataciones_publicas definition

-- Drop table

-- DROP TABLE public.contrataciones_publicas;

CREATE TABLE public.contrataciones_publicas (
	id serial4 NOT NULL,
	"entePublico" int4 NULL,
	"contratacionesAdquisiciones" varchar(255) DEFAULT NULL::character varying NULL,
	"contratacionesObras" varchar(255) DEFAULT NULL::character varying NULL,
	"valorContrataciones" varchar(255) DEFAULT NULL::character varying NULL,
	"valorObras" varchar(255) DEFAULT NULL::character varying NULL,
	"datosContratacionesPublicas" int4 NULL,
	"nivelesResponsabilidadesContrataciones" int4 NULL,
	CONSTRAINT contrataciones_publicas_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.contrataciones_publicas OWNER TO userpg;
GRANT ALL ON TABLE public.contrataciones_publicas TO userpg;


-- public.datos_contrataciones_publicas definition

-- Drop table

-- DROP TABLE public.datos_contrataciones_publicas;

CREATE TABLE public.datos_contrataciones_publicas (
	id serial4 NOT NULL,
	"entePublico" int4 NULL,
	"fechaInicioProcedimiento" date NULL,
	"numeroExpedienteFolio" varchar(255) DEFAULT NULL::character varying NULL,
	materia varchar(255) DEFAULT NULL::character varying NULL,
	"otroMateria" varchar(255) DEFAULT NULL::character varying NULL,
	"fechaConclusionProcedimiento" date NULL,
	"tipoProcedimiento" varchar(255) DEFAULT NULL::character varying NULL,
	fk_datos_procedimientos_adquisiciones int4 NULL,
	CONSTRAINT datos_contrataciones_publicas_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.datos_contrataciones_publicas OWNER TO userpg;
GRANT ALL ON TABLE public.datos_contrataciones_publicas TO userpg;


-- public.datos_dictaminaciones_avaluos definition

-- Drop table

-- DROP TABLE public.datos_dictaminaciones_avaluos;

CREATE TABLE public.datos_dictaminaciones_avaluos (
	id serial4 NOT NULL,
	"numeroExpedienteFolio" varchar(255) DEFAULT NULL::character varying NULL,
	"fechaInicioProcedimiento" date NULL,
	"fechaConclusionProcedimiento" date NULL,
	descripcion varchar(255) DEFAULT NULL::character varying NULL,
	"entePublico" int4 NULL,
	CONSTRAINT datos_dictaminaciones_avaluos_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.datos_dictaminaciones_avaluos OWNER TO userpg;
GRANT ALL ON TABLE public.datos_dictaminaciones_avaluos TO userpg;


-- public.datos_enajenaciones_bienes definition

-- Drop table

-- DROP TABLE public.datos_enajenaciones_bienes;

CREATE TABLE public.datos_enajenaciones_bienes (
	id serial4 NOT NULL,
	"numeroExpedienteFolio" varchar(255) DEFAULT NULL::character varying NULL,
	"fechaInicioProcedimiento" date NULL,
	"fechaConclusionProcedimiento" date NULL,
	descripcion varchar(255) DEFAULT NULL::character varying NULL,
	"entePublico" int4 NULL,
	CONSTRAINT datos_enajenaciones_bienes_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.datos_enajenaciones_bienes OWNER TO userpg;
GRANT ALL ON TABLE public.datos_enajenaciones_bienes TO userpg;


-- public.datos_generales definition

-- Drop table

-- DROP TABLE public.datos_generales;

CREATE TABLE public.datos_generales (
	id serial4 NOT NULL,
	"primerApellido" varchar(255) DEFAULT NULL::character varying NULL,
	"segundoApellido" varchar(255) DEFAULT NULL::character varying NULL,
	curp varchar(255) DEFAULT NULL::character varying NULL,
	rfc varchar(255) DEFAULT NULL::character varying NULL,
	sexo varchar(255) DEFAULT NULL::character varying NULL,
	nombre varchar(255) DEFAULT NULL::character varying NULL,
	"entePublico" int4 NULL,
	CONSTRAINT datos_generales_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.datos_generales OWNER TO userpg;
GRANT ALL ON TABLE public.datos_generales TO userpg;


-- public.datos_generales_concesiones definition

-- Drop table

-- DROP TABLE public.datos_generales_concesiones;

CREATE TABLE public.datos_generales_concesiones (
	id serial4 NOT NULL,
	"numeroExpedienteFolio" varchar(255) DEFAULT NULL::character varying NULL,
	denominacion varchar(255) DEFAULT NULL::character varying NULL,
	objeto varchar(255) DEFAULT NULL::character varying NULL,
	fundamento varchar(255) DEFAULT NULL::character varying NULL,
	"nombrePersonaFisica" varchar(255) DEFAULT NULL::character varying NULL,
	"denominacionPersonaMoral" varchar(255) DEFAULT NULL::character varying NULL,
	"sectorActoJuridico" json NULL,
	"fechaInicioVigencia" date NULL,
	"fechaConclusionVigencia" date NULL,
	"urlActoJuridico" varchar(255) DEFAULT NULL::character varying NULL,
	"entePublico" int4 NULL,
	monto numeric(10, 5) DEFAULT NULL::numeric NULL,
	CONSTRAINT datos_generales_concesiones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.datos_generales_concesiones OWNER TO userpg;
GRANT ALL ON TABLE public.datos_generales_concesiones TO userpg;


-- public.datos_generales_obras definition

-- Drop table

-- DROP TABLE public.datos_generales_obras;

CREATE TABLE public.datos_generales_obras (
	id serial4 NOT NULL,
	"numeroExpedienteFolio" varchar(255) DEFAULT NULL::character varying NULL,
	materia varchar(255) DEFAULT NULL::character varying NULL,
	"inicioProcedimiento" date NULL,
	"conclusionProcedimiento" date NULL,
	"entePublico" int4 NULL,
	fk_fatos_procedimientos_obras int4 NULL,
	"tipoProcedimiento" varchar(255) DEFAULT NULL::character varying NULL,
	CONSTRAINT datos_generales_obras_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.datos_generales_obras OWNER TO userpg;
GRANT ALL ON TABLE public.datos_generales_obras TO userpg;


-- public.datos_otorgamientos_concesiones definition

-- Drop table

-- DROP TABLE public.datos_otorgamientos_concesiones;

CREATE TABLE public.datos_otorgamientos_concesiones (
	id serial4 NOT NULL,
	"numeroExpedienteFolio" varchar(255) DEFAULT NULL::character varying NULL,
	denominacion varchar(255) DEFAULT NULL::character varying NULL,
	objeto varchar(255) DEFAULT NULL::character varying NULL,
	fundamento varchar(255) DEFAULT NULL::character varying NULL,
	"nombrePersonaSolicitaOtorga" varchar(255) DEFAULT NULL::character varying NULL,
	"denominacionPersona" varchar(255) DEFAULT NULL::character varying NULL,
	"sectorActo" varchar(255) DEFAULT NULL::character varying NULL,
	vigencia varchar(255) DEFAULT NULL::character varying NULL,
	"fechaInicioVigencia" date NULL,
	"fechaConclusionVigencia" date NULL,
	monto varchar(20) DEFAULT NULL::character varying NULL,
	"urlInformacionActo" varchar(255) DEFAULT NULL::character varying NULL,
	"nombrePersonaBeneficiaria" varchar(255) DEFAULT NULL::character varying NULL,
	"entePublico" int4 NULL,
	CONSTRAINT datos_otorgamientos_concesiones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.datos_otorgamientos_concesiones OWNER TO userpg;
GRANT ALL ON TABLE public.datos_otorgamientos_concesiones TO userpg;


-- public.datos_personas_beneficiarias definition

-- Drop table

-- DROP TABLE public.datos_personas_beneficiarias;

CREATE TABLE public.datos_personas_beneficiarias (
	id serial4 NOT NULL,
	"razonSocial" varchar(255) DEFAULT NULL::character varying NULL,
	nombre varchar(255) DEFAULT NULL::character varying NULL,
	"primerApellido" varchar(255) DEFAULT NULL::character varying NULL,
	"segundoApellido" varchar(255) DEFAULT NULL::character varying NULL,
	"entePublico" int4 NULL,
	CONSTRAINT datos_personas_beneficiarias_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.datos_personas_beneficiarias OWNER TO userpg;
GRANT ALL ON TABLE public.datos_personas_beneficiarias TO userpg;


-- public.dictaminaciones_avaluos definition

-- Drop table

-- DROP TABLE public.dictaminaciones_avaluos;

CREATE TABLE public.dictaminaciones_avaluos (
	id serial4 NOT NULL,
	"entePublico" int4 NULL,
	"nivelesResponsabilidadesAvaluos" int4 NULL,
	"datosDictaminacionesAvaluos" int4 NULL,
	"continuaParticipando" varchar(255) DEFAULT NULL::character varying NULL,
	CONSTRAINT dictaminaciones_avaluos_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.dictaminaciones_avaluos OWNER TO userpg;
GRANT ALL ON TABLE public.dictaminaciones_avaluos TO userpg;


-- public.directus_dashboards definition

-- Drop table

-- DROP TABLE public.directus_dashboards;

CREATE TABLE public.directus_dashboards (
	id uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	icon varchar(30) DEFAULT 'dashboard'::character varying NOT NULL,
	note text NULL,
	date_created timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	user_created uuid NULL,
	color varchar(255) NULL,
	CONSTRAINT directus_dashboards_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_dashboards OWNER TO userpg;
GRANT ALL ON TABLE public.directus_dashboards TO userpg;


-- public.directus_files definition

-- Drop table

-- DROP TABLE public.directus_files;

CREATE TABLE public.directus_files (
	id uuid NOT NULL,
	"storage" varchar(255) NOT NULL,
	filename_disk varchar(255) NULL,
	filename_download varchar(255) NOT NULL,
	title varchar(255) NULL,
	"type" varchar(255) NULL,
	folder uuid NULL,
	uploaded_by uuid NULL,
	created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	modified_by uuid NULL,
	modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	charset varchar(50) NULL,
	filesize int8 NULL,
	width int4 NULL,
	height int4 NULL,
	duration int4 NULL,
	embed varchar(200) NULL,
	description text NULL,
	"location" text NULL,
	tags text NULL,
	metadata json NULL,
	focal_point_x int4 NULL,
	focal_point_y int4 NULL,
	tus_id varchar(64) NULL,
	tus_data json NULL,
	uploaded_on timestamptz NULL,
	CONSTRAINT directus_files_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_files OWNER TO userpg;
GRANT ALL ON TABLE public.directus_files TO userpg;


-- public.directus_flows definition

-- Drop table

-- DROP TABLE public.directus_flows;

CREATE TABLE public.directus_flows (
	id uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	icon varchar(30) NULL,
	color varchar(255) NULL,
	description text NULL,
	status varchar(255) DEFAULT 'active'::character varying NOT NULL,
	"trigger" varchar(255) NULL,
	accountability varchar(255) DEFAULT 'all'::character varying NULL,
	"options" json NULL,
	operation uuid NULL,
	date_created timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	user_created uuid NULL,
	CONSTRAINT directus_flows_operation_unique UNIQUE (operation),
	CONSTRAINT directus_flows_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_flows OWNER TO userpg;
GRANT ALL ON TABLE public.directus_flows TO userpg;


-- public.directus_notifications definition

-- Drop table

-- DROP TABLE public.directus_notifications;

CREATE TABLE public.directus_notifications (
	id serial4 NOT NULL,
	"timestamp" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	status varchar(255) DEFAULT 'inbox'::character varying NULL,
	recipient uuid NOT NULL,
	sender uuid NULL,
	subject varchar(255) NOT NULL,
	message text NULL,
	collection varchar(64) NULL,
	item varchar(255) NULL,
	CONSTRAINT directus_notifications_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_notifications OWNER TO userpg;
GRANT ALL ON TABLE public.directus_notifications TO userpg;


-- public.directus_operations definition

-- Drop table

-- DROP TABLE public.directus_operations;

CREATE TABLE public.directus_operations (
	id uuid NOT NULL,
	"name" varchar(255) NULL,
	"key" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	position_x int4 NOT NULL,
	position_y int4 NOT NULL,
	"options" json NULL,
	resolve uuid NULL,
	reject uuid NULL,
	flow uuid NOT NULL,
	date_created timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	user_created uuid NULL,
	CONSTRAINT directus_operations_pkey PRIMARY KEY (id),
	CONSTRAINT directus_operations_reject_unique UNIQUE (reject),
	CONSTRAINT directus_operations_resolve_unique UNIQUE (resolve)
);

-- Permissions

ALTER TABLE public.directus_operations OWNER TO userpg;
GRANT ALL ON TABLE public.directus_operations TO userpg;


-- public.directus_panels definition

-- Drop table

-- DROP TABLE public.directus_panels;

CREATE TABLE public.directus_panels (
	id uuid NOT NULL,
	dashboard uuid NOT NULL,
	"name" varchar(255) NULL,
	icon varchar(30) DEFAULT NULL::character varying NULL,
	color varchar(10) NULL,
	show_header bool DEFAULT false NOT NULL,
	note text NULL,
	"type" varchar(255) NOT NULL,
	position_x int4 NOT NULL,
	position_y int4 NOT NULL,
	width int4 NOT NULL,
	height int4 NOT NULL,
	"options" json NULL,
	date_created timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	user_created uuid NULL,
	CONSTRAINT directus_panels_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_panels OWNER TO userpg;
GRANT ALL ON TABLE public.directus_panels TO userpg;


-- public.directus_presets definition

-- Drop table

-- DROP TABLE public.directus_presets;

CREATE TABLE public.directus_presets (
	id serial4 NOT NULL,
	bookmark varchar(255) NULL,
	"user" uuid NULL,
	"role" uuid NULL,
	collection varchar(64) NULL,
	"search" varchar(100) NULL,
	layout varchar(100) DEFAULT 'tabular'::character varying NULL,
	layout_query json NULL,
	layout_options json NULL,
	refresh_interval int4 NULL,
	"filter" json NULL,
	icon varchar(30) DEFAULT 'bookmark'::character varying NULL,
	color varchar(255) NULL,
	CONSTRAINT directus_presets_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_presets OWNER TO userpg;
GRANT ALL ON TABLE public.directus_presets TO userpg;


-- public.directus_revisions definition

-- Drop table

-- DROP TABLE public.directus_revisions;

CREATE TABLE public.directus_revisions (
	id serial4 NOT NULL,
	activity int4 NOT NULL,
	collection varchar(64) NOT NULL,
	item varchar(255) NOT NULL,
	"data" json NULL,
	delta json NULL,
	parent int4 NULL,
	"version" uuid NULL,
	CONSTRAINT directus_revisions_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_revisions OWNER TO userpg;
GRANT ALL ON TABLE public.directus_revisions TO userpg;


-- public.directus_sessions definition

-- Drop table

-- DROP TABLE public.directus_sessions;

CREATE TABLE public.directus_sessions (
	"token" varchar(64) NOT NULL,
	"user" uuid NULL,
	expires timestamptz NOT NULL,
	ip varchar(255) NULL,
	user_agent text NULL,
	"share" uuid NULL,
	origin varchar(255) NULL,
	next_token varchar(64) NULL,
	CONSTRAINT directus_sessions_pkey PRIMARY KEY (token)
);

-- Permissions

ALTER TABLE public.directus_sessions OWNER TO userpg;
GRANT ALL ON TABLE public.directus_sessions TO userpg;


-- public.directus_settings definition

-- Drop table

-- DROP TABLE public.directus_settings;

CREATE TABLE public.directus_settings (
	id serial4 NOT NULL,
	project_name varchar(100) DEFAULT 'Directus'::character varying NOT NULL,
	project_url varchar(255) NULL,
	project_color varchar(255) DEFAULT '#6644FF'::character varying NOT NULL,
	project_logo uuid NULL,
	public_foreground uuid NULL,
	public_background uuid NULL,
	public_note text NULL,
	auth_login_attempts int4 DEFAULT 25 NULL,
	auth_password_policy varchar(100) NULL,
	storage_asset_transform varchar(7) DEFAULT 'all'::character varying NULL,
	storage_asset_presets json NULL,
	custom_css text NULL,
	storage_default_folder uuid NULL,
	basemaps json NULL,
	mapbox_key varchar(255) NULL,
	module_bar json NULL,
	project_descriptor varchar(100) NULL,
	default_language varchar(255) DEFAULT 'en-US'::character varying NOT NULL,
	custom_aspect_ratios json NULL,
	public_favicon uuid NULL,
	default_appearance varchar(255) DEFAULT 'auto'::character varying NOT NULL,
	default_theme_light varchar(255) NULL,
	theme_light_overrides json NULL,
	default_theme_dark varchar(255) NULL,
	theme_dark_overrides json NULL,
	report_error_url varchar(255) NULL,
	report_bug_url varchar(255) NULL,
	report_feature_url varchar(255) NULL,
	public_registration bool DEFAULT false NOT NULL,
	public_registration_verify_email bool DEFAULT true NOT NULL,
	public_registration_role uuid NULL,
	public_registration_email_filter json NULL,
	CONSTRAINT directus_settings_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_settings OWNER TO userpg;
GRANT ALL ON TABLE public.directus_settings TO userpg;


-- public.directus_shares definition

-- Drop table

-- DROP TABLE public.directus_shares;

CREATE TABLE public.directus_shares (
	id uuid NOT NULL,
	"name" varchar(255) NULL,
	collection varchar(64) NOT NULL,
	item varchar(255) NOT NULL,
	"role" uuid NULL,
	"password" varchar(255) NULL,
	user_created uuid NULL,
	date_created timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	date_start timestamptz NULL,
	date_end timestamptz NULL,
	times_used int4 DEFAULT 0 NULL,
	max_uses int4 NULL,
	CONSTRAINT directus_shares_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_shares OWNER TO userpg;
GRANT ALL ON TABLE public.directus_shares TO userpg;


-- public.directus_users definition

-- Drop table

-- DROP TABLE public.directus_users;

CREATE TABLE public.directus_users (
	id uuid NOT NULL,
	first_name varchar(50) NOT NULL,
	last_name varchar(50) NOT NULL,
	email varchar(128) NOT NULL,
	"password" varchar(255) NULL,
	"location" varchar(255) NULL,
	title varchar(50) NULL,
	description text NULL,
	tags json NULL,
	avatar uuid NULL,
	"language" varchar(255) DEFAULT NULL::character varying NULL,
	tfa_secret varchar(255) NULL,
	status varchar(16) DEFAULT 'active'::character varying NOT NULL,
	"role" uuid NULL,
	"token" varchar(255) NULL,
	last_access timestamptz NULL,
	last_page varchar(255) NULL,
	provider varchar(128) DEFAULT 'default'::character varying NOT NULL,
	external_identifier varchar(255) NULL,
	auth_data json NULL,
	email_notifications bool DEFAULT true NULL,
	appearance varchar(255) NULL,
	theme_dark varchar(255) NULL,
	theme_light varchar(255) NULL,
	theme_light_overrides json NULL,
	theme_dark_overrides json NULL,
	"entePublico" int4 NULL,
	CONSTRAINT directus_users_email_unique UNIQUE (email),
	CONSTRAINT directus_users_external_identifier_unique UNIQUE (external_identifier),
	CONSTRAINT directus_users_pkey PRIMARY KEY (id),
	CONSTRAINT directus_users_token_unique UNIQUE (token)
);

-- Permissions

ALTER TABLE public.directus_users OWNER TO userpg;
GRANT ALL ON TABLE public.directus_users TO userpg;


-- public.directus_versions definition

-- Drop table

-- DROP TABLE public.directus_versions;

CREATE TABLE public.directus_versions (
	id uuid NOT NULL,
	"key" varchar(64) NOT NULL,
	"name" varchar(255) NULL,
	collection varchar(64) NOT NULL,
	item varchar(255) NOT NULL,
	hash varchar(255) NULL,
	date_created timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	date_updated timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	user_created uuid NULL,
	user_updated uuid NULL,
	CONSTRAINT directus_versions_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_versions OWNER TO userpg;
GRANT ALL ON TABLE public.directus_versions TO userpg;


-- public.directus_webhooks definition

-- Drop table

-- DROP TABLE public.directus_webhooks;

CREATE TABLE public.directus_webhooks (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	"method" varchar(10) DEFAULT 'POST'::character varying NOT NULL,
	url varchar(255) NOT NULL,
	status varchar(10) DEFAULT 'active'::character varying NOT NULL,
	"data" bool DEFAULT true NOT NULL,
	actions varchar(100) NOT NULL,
	collections varchar(255) NOT NULL,
	headers json NULL,
	was_active_before_deprecation bool DEFAULT false NOT NULL,
	migrated_flow uuid NULL,
	CONSTRAINT directus_webhooks_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.directus_webhooks OWNER TO userpg;
GRANT ALL ON TABLE public.directus_webhooks TO userpg;


-- public.empleos_cargos_comisiones definition

-- Drop table

-- DROP TABLE public.empleos_cargos_comisiones;

CREATE TABLE public.empleos_cargos_comisiones (
	id serial4 NOT NULL,
	"entidadFederativa" varchar(255) DEFAULT NULL::character varying NULL,
	"nivelOrdenGobierno" varchar(255) DEFAULT NULL::character varying NULL,
	"ambitoPublico" varchar(255) DEFAULT NULL::character varying NULL,
	"nombreEntePublico" varchar(255) DEFAULT NULL::character varying NULL,
	"siglasEntePublico" varchar(255) DEFAULT NULL::character varying NULL,
	"nivelJerarquico" int4 NULL,
	denominacion varchar(255) DEFAULT NULL::character varying NULL,
	"areaAdscripcion" varchar(255) DEFAULT NULL::character varying NULL,
	"entePublico" int4 NULL,
	CONSTRAINT empleos_cargos_comisiones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.empleos_cargos_comisiones OWNER TO userpg;
GRANT ALL ON TABLE public.empleos_cargos_comisiones TO userpg;


-- public.enajenaciones_bienes definition

-- Drop table

-- DROP TABLE public.enajenaciones_bienes;

CREATE TABLE public.enajenaciones_bienes (
	id serial4 NOT NULL,
	"nivelesResponsabilidadesEnajenaciones" int4 NULL,
	"datosEnajenacionesBienes" int4 NULL,
	"entePublico" int4 NULL,
	"continuaParticipando" varchar(255) DEFAULT NULL::character varying NULL,
	CONSTRAINT enajenaciones_bienes_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.enajenaciones_bienes OWNER TO userpg;
GRANT ALL ON TABLE public.enajenaciones_bienes TO userpg;


-- public.ente_publico definition

-- Drop table

-- DROP TABLE public.ente_publico;

CREATE TABLE public.ente_publico (
	id serial4 NOT NULL,
	nombre varchar(255) DEFAULT NULL::character varying NULL,
	fk_ente_publico uuid NULL,
	CONSTRAINT ente_publico_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.ente_publico OWNER TO userpg;
GRANT ALL ON TABLE public.ente_publico TO userpg;


-- public.niveles_jerarquicos definition

-- Drop table

-- DROP TABLE public.niveles_jerarquicos;

CREATE TABLE public.niveles_jerarquicos (
	id serial4 NOT NULL,
	clave varchar(255) DEFAULT NULL::character varying NULL,
	valor varchar(255) DEFAULT NULL::character varying NULL,
	"entePublico" int4 NULL,
	CONSTRAINT niveles_jerarquicos_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.niveles_jerarquicos OWNER TO userpg;
GRANT ALL ON TABLE public.niveles_jerarquicos TO userpg;


-- public.niveles_responsabilidades_avaluos definition

-- Drop table

-- DROP TABLE public.niveles_responsabilidades_avaluos;

CREATE TABLE public.niveles_responsabilidades_avaluos (
	id serial4 NOT NULL,
	propuestas json NULL,
	asignacion json NULL,
	emision json NULL,
	"entePublico" int4 NULL,
	CONSTRAINT niveles_responsabilidades_avaluos_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.niveles_responsabilidades_avaluos OWNER TO userpg;
GRANT ALL ON TABLE public.niveles_responsabilidades_avaluos TO userpg;


-- public.niveles_responsabilidades_concesiones definition

-- Drop table

-- DROP TABLE public.niveles_responsabilidades_concesiones;

CREATE TABLE public.niveles_responsabilidades_concesiones (
	id serial4 NOT NULL,
	convocatoria json NULL,
	dictamenes json NULL,
	visitas json NULL,
	evaluacion json NULL,
	determinacion json NULL,
	"entePublico" int4 NULL,
	CONSTRAINT niveles_responsabilidades_concesiones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.niveles_responsabilidades_concesiones OWNER TO userpg;
GRANT ALL ON TABLE public.niveles_responsabilidades_concesiones TO userpg;


-- public.niveles_responsabilidades_contrataciones_adquisiciones definition

-- Drop table

-- DROP TABLE public.niveles_responsabilidades_contrataciones_adquisiciones;

CREATE TABLE public.niveles_responsabilidades_contrataciones_adquisiciones (
	id serial4 NOT NULL,
	autorizacion json NULL,
	justificacion json NULL,
	convocatoria json NULL,
	evaluacion json NULL,
	adjudicacion json NULL,
	formalizacion json NULL,
	"entePublico" int4 NULL,
	CONSTRAINT niveles_responsabilidades_contrataciones_adquisiciones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.niveles_responsabilidades_contrataciones_adquisiciones OWNER TO userpg;
GRANT ALL ON TABLE public.niveles_responsabilidades_contrataciones_adquisiciones TO userpg;


-- public.niveles_responsabilidades_enajenaciones definition

-- Drop table

-- DROP TABLE public.niveles_responsabilidades_enajenaciones;

CREATE TABLE public.niveles_responsabilidades_enajenaciones (
	id serial4 NOT NULL,
	autorizaciones json NULL,
	analisis json NULL,
	modificaciones json NULL,
	presentacion json NULL,
	evaluacion json NULL,
	adjudicacion json NULL,
	formalizacoin json NULL,
	"entePublico" int4 NULL,
	CONSTRAINT niveles_responsabilidades_enajenaciones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.niveles_responsabilidades_enajenaciones OWNER TO userpg;
GRANT ALL ON TABLE public.niveles_responsabilidades_enajenaciones TO userpg;


-- public.niveles_responsabilidades_otro_adquisiciones definition

-- Drop table

-- DROP TABLE public.niveles_responsabilidades_otro_adquisiciones;

CREATE TABLE public.niveles_responsabilidades_otro_adquisiciones (
	id serial4 NOT NULL,
	fk_otro_niveles_responsabilidades_contrataciones_adquisiciones int4 NULL,
	"entePublico" int4 NULL,
	"especifiqueOtro" varchar(255) DEFAULT NULL::character varying NULL,
	CONSTRAINT niveles_responsabilidades_otro_adquisiciones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.niveles_responsabilidades_otro_adquisiciones OWNER TO userpg;
GRANT ALL ON TABLE public.niveles_responsabilidades_otro_adquisiciones TO userpg;


-- public.niveles_responsabilidades_otro_avaluos definition

-- Drop table

-- DROP TABLE public.niveles_responsabilidades_otro_avaluos;

CREATE TABLE public.niveles_responsabilidades_otro_avaluos (
	id serial4 NOT NULL,
	fk_otro_niveles_responsabilidades_avaluos int4 NULL,
	"entePublico" int4 NULL,
	"otroEspecifique" varchar(255) DEFAULT NULL::character varying NULL,
	CONSTRAINT niveles_responsabilidades_otro_avaluos_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.niveles_responsabilidades_otro_avaluos OWNER TO userpg;
GRANT ALL ON TABLE public.niveles_responsabilidades_otro_avaluos TO userpg;


-- public.niveles_responsabilidades_otro_concesiones definition

-- Drop table

-- DROP TABLE public.niveles_responsabilidades_otro_concesiones;

CREATE TABLE public.niveles_responsabilidades_otro_concesiones (
	id serial4 NOT NULL,
	fk_otro_niveles_responsabilidad_concesiones int4 NULL,
	"entePublico" int4 NULL,
	"otroEspecifique" varchar(255) DEFAULT NULL::character varying NULL,
	CONSTRAINT niveles_responsabilidades_otro_concesiones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.niveles_responsabilidades_otro_concesiones OWNER TO userpg;
GRANT ALL ON TABLE public.niveles_responsabilidades_otro_concesiones TO userpg;


-- public.niveles_responsabilidades_otro_enajecaciones definition

-- Drop table

-- DROP TABLE public.niveles_responsabilidades_otro_enajecaciones;

CREATE TABLE public.niveles_responsabilidades_otro_enajecaciones (
	id serial4 NOT NULL,
	fk_otro_niveles_responsabilidades_enajenaciones int4 NULL,
	"entePublico" int4 NULL,
	"otroEspecifique" varchar(255) DEFAULT NULL::character varying NULL,
	CONSTRAINT niveles_responsabilidades_otro_enajecaciones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.niveles_responsabilidades_otro_enajecaciones OWNER TO userpg;
GRANT ALL ON TABLE public.niveles_responsabilidades_otro_enajecaciones TO userpg;


-- public.otorgamientos_concesiones definition

-- Drop table

-- DROP TABLE public.otorgamientos_concesiones;

CREATE TABLE public.otorgamientos_concesiones (
	id serial4 NOT NULL,
	"tipoActo" varchar(255) DEFAULT NULL::character varying NULL,
	"nivelResponsabilidadConcesiones" int4 NULL,
	"entePublico" int4 NULL,
	"datosGeneralesConcesiones" int4 NULL,
	"informacionPersonasBeneficiarias" int4 NULL,
	"continuaParticipando" varchar(255) DEFAULT NULL::character varying NULL,
	CONSTRAINT otorgamientos_concesiones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.otorgamientos_concesiones OWNER TO userpg;
GRANT ALL ON TABLE public.otorgamientos_concesiones TO userpg;


-- public.servidores_intervengan_procedimientos_contrataciones definition

-- Drop table

-- DROP TABLE public.servidores_intervengan_procedimientos_contrataciones;

CREATE TABLE public.servidores_intervengan_procedimientos_contrataciones (
	id uuid NOT NULL,
	user_created uuid NULL,
	date_created timestamptz NULL,
	user_updated uuid NULL,
	date_updated timestamptz NULL,
	"entePublico" int4 NULL,
	fecha date NULL,
	"datosGenerales" int4 NULL,
	"empleoCargoComision" int4 NULL,
	ejercicio int4 NULL,
	"tipoProcedimiento" varchar(255) DEFAULT NULL::character varying NULL,
	"otorgamientoConcesion" int4 NULL,
	"Observaciones" text NULL,
	"avaluosJustipreciacion" int4 NULL,
	"enajenacionBien" int4 NULL,
	CONSTRAINT servidores_intervengan_procedimientos_contrataciones_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.servidores_intervengan_procedimientos_contrataciones OWNER TO userpg;
GRANT ALL ON TABLE public.servidores_intervengan_procedimientos_contrataciones TO userpg;


-- public.tipos_adquisiciones_obras definition

-- Drop table

-- DROP TABLE public.tipos_adquisiciones_obras;

CREATE TABLE public.tipos_adquisiciones_obras (
	id serial4 NOT NULL,
	"contratacionAdquisicion" int4 NULL,
	"contratacionObra" int4 NULL,
	"entePublico" int4 NULL,
	clave varchar(255) DEFAULT NULL::character varying NULL,
	fk_id uuid NULL,
	CONSTRAINT tipos_adquisiciones_obras_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.tipos_adquisiciones_obras OWNER TO userpg;
GRANT ALL ON TABLE public.tipos_adquisiciones_obras TO userpg;


-- public.contrataciones_adquisiciones foreign keys

ALTER TABLE public.contrataciones_adquisiciones ADD CONSTRAINT contrataciones_adquisiciones_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.contrataciones_adquisiciones ADD CONSTRAINT contrataciones_adquisiciones_informacionper__a68a7ea_foreign FOREIGN KEY ("informacionPersonasBeneficiarias") REFERENCES public.datos_personas_beneficiarias(id) ON DELETE SET NULL;
ALTER TABLE public.contrataciones_adquisiciones ADD CONSTRAINT contrataciones_adquisiciones_nivelresponsa__538ef87e_foreign FOREIGN KEY ("nivelResponsabilidadContratacion") REFERENCES public.niveles_responsabilidades_contrataciones_adquisiciones(id) ON DELETE SET NULL;


-- public.contrataciones_obras foreign keys

ALTER TABLE public.contrataciones_obras ADD CONSTRAINT contrataciones_obras_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.contrataciones_obras ADD CONSTRAINT contrataciones_obras_informacionpersonasbe__75309304_foreign FOREIGN KEY ("informacionPersonasBeneficiarias") REFERENCES public.datos_personas_beneficiarias(id) ON DELETE SET NULL;
ALTER TABLE public.contrataciones_obras ADD CONSTRAINT contrataciones_obras_nivelresponsabilidadobra_foreign FOREIGN KEY ("nivelResponsabilidadObra") REFERENCES public.niveles_responsabilidades_contrataciones_adquisiciones(id) ON DELETE SET NULL;


-- public.contrataciones_publicas foreign keys

ALTER TABLE public.contrataciones_publicas ADD CONSTRAINT contrataciones_publicas_datoscontratacionespublicas_foreign FOREIGN KEY ("datosContratacionesPublicas") REFERENCES public.datos_contrataciones_publicas(id) ON DELETE SET NULL;
ALTER TABLE public.contrataciones_publicas ADD CONSTRAINT contrataciones_publicas_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.contrataciones_publicas ADD CONSTRAINT contrataciones_publicas_nivelesresponsabil__52737260_foreign FOREIGN KEY ("nivelesResponsabilidadesContrataciones") REFERENCES public.niveles_responsabilidades_contrataciones_adquisiciones(id) ON DELETE SET NULL;


-- public.datos_contrataciones_publicas foreign keys

ALTER TABLE public.datos_contrataciones_publicas ADD CONSTRAINT datos_contrataciones_publicas_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.datos_contrataciones_publicas ADD CONSTRAINT datos_contrataciones_publicas_fk_datos_pro__7ab37594_foreign FOREIGN KEY (fk_datos_procedimientos_adquisiciones) REFERENCES public.contrataciones_adquisiciones(id) ON DELETE SET NULL;


-- public.datos_dictaminaciones_avaluos foreign keys

ALTER TABLE public.datos_dictaminaciones_avaluos ADD CONSTRAINT datos_dictaminaciones_avaluos_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.datos_enajenaciones_bienes foreign keys

ALTER TABLE public.datos_enajenaciones_bienes ADD CONSTRAINT datos_enajenaciones_bienes_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.datos_generales foreign keys

ALTER TABLE public.datos_generales ADD CONSTRAINT datos_generales_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.datos_generales_concesiones foreign keys

ALTER TABLE public.datos_generales_concesiones ADD CONSTRAINT datos_generales_concesiones_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.datos_generales_obras foreign keys

ALTER TABLE public.datos_generales_obras ADD CONSTRAINT datos_generales_obras_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.datos_generales_obras ADD CONSTRAINT datos_generales_obras_fk_fatos_procedimientos_obras_foreign FOREIGN KEY (fk_fatos_procedimientos_obras) REFERENCES public.contrataciones_obras(id) ON DELETE SET NULL;


-- public.datos_otorgamientos_concesiones foreign keys

ALTER TABLE public.datos_otorgamientos_concesiones ADD CONSTRAINT datos_otorgamientos_concesiones_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.datos_personas_beneficiarias foreign keys

ALTER TABLE public.datos_personas_beneficiarias ADD CONSTRAINT datos_personas_beneficiarias_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.dictaminaciones_avaluos foreign keys

ALTER TABLE public.dictaminaciones_avaluos ADD CONSTRAINT dictaminaciones_avaluos_datosdictaminacionesavaluos_foreign FOREIGN KEY ("datosDictaminacionesAvaluos") REFERENCES public.datos_dictaminaciones_avaluos(id) ON DELETE SET NULL;
ALTER TABLE public.dictaminaciones_avaluos ADD CONSTRAINT dictaminaciones_avaluos_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.dictaminaciones_avaluos ADD CONSTRAINT dictaminaciones_avaluos_nivelesresponsabil__16afd8ae_foreign FOREIGN KEY ("nivelesResponsabilidadesAvaluos") REFERENCES public.niveles_responsabilidades_avaluos(id) ON DELETE SET NULL;


-- public.directus_dashboards foreign keys

ALTER TABLE public.directus_dashboards ADD CONSTRAINT directus_dashboards_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


-- public.directus_files foreign keys

ALTER TABLE public.directus_files ADD CONSTRAINT directus_files_folder_foreign FOREIGN KEY (folder) REFERENCES public.directus_folders(id) ON DELETE SET NULL;
ALTER TABLE public.directus_files ADD CONSTRAINT directus_files_modified_by_foreign FOREIGN KEY (modified_by) REFERENCES public.directus_users(id);
ALTER TABLE public.directus_files ADD CONSTRAINT directus_files_uploaded_by_foreign FOREIGN KEY (uploaded_by) REFERENCES public.directus_users(id);


-- public.directus_flows foreign keys

ALTER TABLE public.directus_flows ADD CONSTRAINT directus_flows_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


-- public.directus_notifications foreign keys

ALTER TABLE public.directus_notifications ADD CONSTRAINT directus_notifications_recipient_foreign FOREIGN KEY (recipient) REFERENCES public.directus_users(id) ON DELETE CASCADE;
ALTER TABLE public.directus_notifications ADD CONSTRAINT directus_notifications_sender_foreign FOREIGN KEY (sender) REFERENCES public.directus_users(id);


-- public.directus_operations foreign keys

ALTER TABLE public.directus_operations ADD CONSTRAINT directus_operations_flow_foreign FOREIGN KEY (flow) REFERENCES public.directus_flows(id) ON DELETE CASCADE;
ALTER TABLE public.directus_operations ADD CONSTRAINT directus_operations_reject_foreign FOREIGN KEY (reject) REFERENCES public.directus_operations(id);
ALTER TABLE public.directus_operations ADD CONSTRAINT directus_operations_resolve_foreign FOREIGN KEY (resolve) REFERENCES public.directus_operations(id);
ALTER TABLE public.directus_operations ADD CONSTRAINT directus_operations_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


-- public.directus_panels foreign keys

ALTER TABLE public.directus_panels ADD CONSTRAINT directus_panels_dashboard_foreign FOREIGN KEY (dashboard) REFERENCES public.directus_dashboards(id) ON DELETE CASCADE;
ALTER TABLE public.directus_panels ADD CONSTRAINT directus_panels_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


-- public.directus_presets foreign keys

ALTER TABLE public.directus_presets ADD CONSTRAINT directus_presets_role_foreign FOREIGN KEY ("role") REFERENCES public.directus_roles(id) ON DELETE CASCADE;
ALTER TABLE public.directus_presets ADD CONSTRAINT directus_presets_user_foreign FOREIGN KEY ("user") REFERENCES public.directus_users(id) ON DELETE CASCADE;


-- public.directus_revisions foreign keys

ALTER TABLE public.directus_revisions ADD CONSTRAINT directus_revisions_activity_foreign FOREIGN KEY (activity) REFERENCES public.directus_activity(id) ON DELETE CASCADE;
ALTER TABLE public.directus_revisions ADD CONSTRAINT directus_revisions_parent_foreign FOREIGN KEY (parent) REFERENCES public.directus_revisions(id);
ALTER TABLE public.directus_revisions ADD CONSTRAINT directus_revisions_version_foreign FOREIGN KEY ("version") REFERENCES public.directus_versions(id) ON DELETE CASCADE;


-- public.directus_sessions foreign keys

ALTER TABLE public.directus_sessions ADD CONSTRAINT directus_sessions_share_foreign FOREIGN KEY ("share") REFERENCES public.directus_shares(id) ON DELETE CASCADE;
ALTER TABLE public.directus_sessions ADD CONSTRAINT directus_sessions_user_foreign FOREIGN KEY ("user") REFERENCES public.directus_users(id) ON DELETE CASCADE;


-- public.directus_settings foreign keys

ALTER TABLE public.directus_settings ADD CONSTRAINT directus_settings_project_logo_foreign FOREIGN KEY (project_logo) REFERENCES public.directus_files(id);
ALTER TABLE public.directus_settings ADD CONSTRAINT directus_settings_public_background_foreign FOREIGN KEY (public_background) REFERENCES public.directus_files(id);
ALTER TABLE public.directus_settings ADD CONSTRAINT directus_settings_public_favicon_foreign FOREIGN KEY (public_favicon) REFERENCES public.directus_files(id);
ALTER TABLE public.directus_settings ADD CONSTRAINT directus_settings_public_foreground_foreign FOREIGN KEY (public_foreground) REFERENCES public.directus_files(id);
ALTER TABLE public.directus_settings ADD CONSTRAINT directus_settings_public_registration_role_foreign FOREIGN KEY (public_registration_role) REFERENCES public.directus_roles(id) ON DELETE SET NULL;
ALTER TABLE public.directus_settings ADD CONSTRAINT directus_settings_storage_default_folder_foreign FOREIGN KEY (storage_default_folder) REFERENCES public.directus_folders(id) ON DELETE SET NULL;


-- public.directus_shares foreign keys

ALTER TABLE public.directus_shares ADD CONSTRAINT directus_shares_collection_foreign FOREIGN KEY (collection) REFERENCES public.directus_collections(collection) ON DELETE CASCADE;
ALTER TABLE public.directus_shares ADD CONSTRAINT directus_shares_role_foreign FOREIGN KEY ("role") REFERENCES public.directus_roles(id) ON DELETE CASCADE;
ALTER TABLE public.directus_shares ADD CONSTRAINT directus_shares_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


-- public.directus_users foreign keys

ALTER TABLE public.directus_users ADD CONSTRAINT directus_users_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.directus_users ADD CONSTRAINT directus_users_role_foreign FOREIGN KEY ("role") REFERENCES public.directus_roles(id) ON DELETE SET NULL;


-- public.directus_versions foreign keys

ALTER TABLE public.directus_versions ADD CONSTRAINT directus_versions_collection_foreign FOREIGN KEY (collection) REFERENCES public.directus_collections(collection) ON DELETE CASCADE;
ALTER TABLE public.directus_versions ADD CONSTRAINT directus_versions_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;
ALTER TABLE public.directus_versions ADD CONSTRAINT directus_versions_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


-- public.directus_webhooks foreign keys

ALTER TABLE public.directus_webhooks ADD CONSTRAINT directus_webhooks_migrated_flow_foreign FOREIGN KEY (migrated_flow) REFERENCES public.directus_flows(id) ON DELETE SET NULL;


-- public.empleos_cargos_comisiones foreign keys

ALTER TABLE public.empleos_cargos_comisiones ADD CONSTRAINT empleos_cargos_comisiones_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.empleos_cargos_comisiones ADD CONSTRAINT empleos_cargos_comisiones_niveljerarquico_foreign FOREIGN KEY ("nivelJerarquico") REFERENCES public.niveles_jerarquicos(id) ON DELETE SET NULL;


-- public.enajenaciones_bienes foreign keys

ALTER TABLE public.enajenaciones_bienes ADD CONSTRAINT enajenaciones_bienes_datosenajenacionesbienes_foreign FOREIGN KEY ("datosEnajenacionesBienes") REFERENCES public.datos_enajenaciones_bienes(id) ON DELETE SET NULL;
ALTER TABLE public.enajenaciones_bienes ADD CONSTRAINT enajenaciones_bienes_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.enajenaciones_bienes ADD CONSTRAINT enajenaciones_bienes_nivelesresponsabilida__10d4a431_foreign FOREIGN KEY ("nivelesResponsabilidadesEnajenaciones") REFERENCES public.niveles_responsabilidades_enajenaciones(id) ON DELETE SET NULL;


-- public.ente_publico foreign keys

ALTER TABLE public.ente_publico ADD CONSTRAINT ente_publico_fk_ente_publico_foreign FOREIGN KEY (fk_ente_publico) REFERENCES public.directus_users(id) ON DELETE CASCADE;


-- public.niveles_jerarquicos foreign keys

ALTER TABLE public.niveles_jerarquicos ADD CONSTRAINT niveles_jerarquicos_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.niveles_responsabilidades_avaluos foreign keys

ALTER TABLE public.niveles_responsabilidades_avaluos ADD CONSTRAINT niveles_responsabilidades_avaluos_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.niveles_responsabilidades_concesiones foreign keys

ALTER TABLE public.niveles_responsabilidades_concesiones ADD CONSTRAINT niveles_responsabilidades_concesiones_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.niveles_responsabilidades_contrataciones_adquisiciones foreign keys

ALTER TABLE public.niveles_responsabilidades_contrataciones_adquisiciones ADD CONSTRAINT niveles_responsabilidades_contrataciones_ad__fcd6029_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.niveles_responsabilidades_enajenaciones foreign keys

ALTER TABLE public.niveles_responsabilidades_enajenaciones ADD CONSTRAINT niveles_responsabilidades_enajenaciones_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.niveles_responsabilidades_otro_adquisiciones foreign keys

ALTER TABLE public.niveles_responsabilidades_otro_adquisiciones ADD CONSTRAINT niveles_responsabilidades_otro_adquisicion__55818daa_foreign FOREIGN KEY (fk_otro_niveles_responsabilidades_contrataciones_adquisiciones) REFERENCES public.niveles_responsabilidades_contrataciones_adquisiciones(id) ON DELETE SET NULL;
ALTER TABLE public.niveles_responsabilidades_otro_adquisiciones ADD CONSTRAINT niveles_responsabilidades_otro_adquisicion__5dfa7976_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.niveles_responsabilidades_otro_avaluos foreign keys

ALTER TABLE public.niveles_responsabilidades_otro_avaluos ADD CONSTRAINT niveles_responsabilidades_otro_avaluos_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.niveles_responsabilidades_otro_avaluos ADD CONSTRAINT niveles_responsabilidades_otro_avaluos_fk___3ea50188_foreign FOREIGN KEY (fk_otro_niveles_responsabilidades_avaluos) REFERENCES public.niveles_responsabilidades_avaluos(id) ON DELETE SET NULL;


-- public.niveles_responsabilidades_otro_concesiones foreign keys

ALTER TABLE public.niveles_responsabilidades_otro_concesiones ADD CONSTRAINT niveles_responsabilidades_otro_concesiones___f6cb736_foreign FOREIGN KEY (fk_otro_niveles_responsabilidad_concesiones) REFERENCES public.niveles_responsabilidades_concesiones(id) ON DELETE SET NULL;
ALTER TABLE public.niveles_responsabilidades_otro_concesiones ADD CONSTRAINT niveles_responsabilidades_otro_concesiones_e__56c086_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;


-- public.niveles_responsabilidades_otro_enajecaciones foreign keys

ALTER TABLE public.niveles_responsabilidades_otro_enajecaciones ADD CONSTRAINT niveles_responsabilidades_otro_enajecacion__18768363_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.niveles_responsabilidades_otro_enajecaciones ADD CONSTRAINT niveles_responsabilidades_otro_enajecacion__520e2733_foreign FOREIGN KEY (fk_otro_niveles_responsabilidades_enajenaciones) REFERENCES public.niveles_responsabilidades_enajenaciones(id) ON DELETE SET NULL;


-- public.otorgamientos_concesiones foreign keys

ALTER TABLE public.otorgamientos_concesiones ADD CONSTRAINT otorgamientos_concesiones_datosgeneralesconcesiones_foreign FOREIGN KEY ("datosGeneralesConcesiones") REFERENCES public.datos_generales_concesiones(id) ON DELETE SET NULL;
ALTER TABLE public.otorgamientos_concesiones ADD CONSTRAINT otorgamientos_concesiones_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.otorgamientos_concesiones ADD CONSTRAINT otorgamientos_concesiones_informacionperso__24a64f62_foreign FOREIGN KEY ("informacionPersonasBeneficiarias") REFERENCES public.datos_personas_beneficiarias(id) ON DELETE SET NULL;
ALTER TABLE public.otorgamientos_concesiones ADD CONSTRAINT otorgamientos_concesiones_nivelresponsabil__74f1abee_foreign FOREIGN KEY ("nivelResponsabilidadConcesiones") REFERENCES public.niveles_responsabilidades_concesiones(id) ON DELETE SET NULL;


-- public.servidores_intervengan_procedimientos_contrataciones foreign keys

ALTER TABLE public.servidores_intervengan_procedimientos_contrataciones ADD CONSTRAINT servidores_intervengan_procedimientos_cont__30e68fe7_foreign FOREIGN KEY ("enajenacionBien") REFERENCES public.enajenaciones_bienes(id) ON DELETE SET NULL;
ALTER TABLE public.servidores_intervengan_procedimientos_contrataciones ADD CONSTRAINT servidores_intervengan_procedimientos_cont__3731416e_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);
ALTER TABLE public.servidores_intervengan_procedimientos_contrataciones ADD CONSTRAINT servidores_intervengan_procedimientos_cont__38b85108_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.servidores_intervengan_procedimientos_contrataciones ADD CONSTRAINT servidores_intervengan_procedimientos_cont__43e6a57f_foreign FOREIGN KEY ("avaluosJustipreciacion") REFERENCES public.dictaminaciones_avaluos(id) ON DELETE SET NULL;
ALTER TABLE public.servidores_intervengan_procedimientos_contrataciones ADD CONSTRAINT servidores_intervengan_procedimientos_cont__67fd9d65_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);
ALTER TABLE public.servidores_intervengan_procedimientos_contrataciones ADD CONSTRAINT servidores_intervengan_procedimientos_cont__6f0f8429_foreign FOREIGN KEY ("empleoCargoComision") REFERENCES public.empleos_cargos_comisiones(id) ON DELETE SET NULL;
ALTER TABLE public.servidores_intervengan_procedimientos_contrataciones ADD CONSTRAINT servidores_intervengan_procedimientos_cont__7ce18223_foreign FOREIGN KEY ("otorgamientoConcesion") REFERENCES public.otorgamientos_concesiones(id) ON DELETE SET NULL;
ALTER TABLE public.servidores_intervengan_procedimientos_contrataciones ADD CONSTRAINT servidores_intervengan_procedimientos_contr__701e919_foreign FOREIGN KEY ("datosGenerales") REFERENCES public.datos_generales(id) ON DELETE SET NULL;


-- public.tipos_adquisiciones_obras foreign keys

ALTER TABLE public.tipos_adquisiciones_obras ADD CONSTRAINT tipos_adquisiciones_obras_contratacionadquisicion_foreign FOREIGN KEY ("contratacionAdquisicion") REFERENCES public.contrataciones_adquisiciones(id) ON DELETE SET NULL;
ALTER TABLE public.tipos_adquisiciones_obras ADD CONSTRAINT tipos_adquisiciones_obras_contratacionobra_foreign FOREIGN KEY ("contratacionObra") REFERENCES public.contrataciones_obras(id) ON DELETE SET NULL;
ALTER TABLE public.tipos_adquisiciones_obras ADD CONSTRAINT tipos_adquisiciones_obras_entepublico_foreign FOREIGN KEY ("entePublico") REFERENCES public.ente_publico(id) ON DELETE SET NULL;
ALTER TABLE public.tipos_adquisiciones_obras ADD CONSTRAINT tipos_adquisiciones_obras_fk_id_foreign FOREIGN KEY (fk_id) REFERENCES public.servidores_intervengan_procedimientos_contrataciones(id) ON DELETE SET NULL;




-- Permissions

GRANT ALL ON SCHEMA public TO userpg;
GRANT ALL ON SCHEMA public TO public;
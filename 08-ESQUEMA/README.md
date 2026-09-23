### David Saiz
## Esquema Login

-- ---------- 3.1 LOGIN ----------
create table login.estado_usuario (
    id             SERIAL       not null,
    nombre_estado  VARCHAR(20)  not null,
    constraint pk_estado_usuario PRIMARY KEY (id),
    constraint uc_nombre_estado UNIQUE (nombre_estado)
);

comment on table login.estado_usuario is 'Catálogo de estados de un usuario dentro del sistema';


create table login.rol (
    id      SERIAL       not null,
    nombre  VARCHAR(50)  not null,
    constraint pk_rol PRIMARY KEY (id),
    constraint uc_rol_nombre UNIQUE (nombre)
);

comment on table login.rol is 'Catálogo de roles disponibles: Arrendatario, Arrendador, Administrador';


create table login.tipo_documento (
    id                 SERIAL       not null,
    nombre_documento   VARCHAR(100) not null,
    siglas             VARCHAR(10)  not null,
    estado             VARCHAR(20)  not null,
    constraint pk_tipo_documento PRIMARY KEY (id),
    constraint uc_nombre_documento UNIQUE (nombre_documento),
    constraint uc_siglas UNIQUE (siglas)
);

comment on table login.tipo_documento is 'Catálogo de tipos de documento de identidad (CC, CE, PA, NIT, etc.)';


create table login.usuario (
    id                  SERIAL       not null,
    id_estado_usuario   INTEGER      not null,
    email               VARCHAR(254) not null,
    password            VARCHAR(60)  not null,
    lang_key            VARCHAR(6)   null,
    activation_key      VARCHAR(100) null,
    reset_key           VARCHAR(100) null,
    reset_date          TIMESTAMP    null,
    fecha_creacion      TIMESTAMP    not null,
    ultimo_acceso       TIMESTAMP    null,
    constraint pk_usuario PRIMARY KEY (id),
    constraint uc_correo UNIQUE (email),
    constraint fk_estado_usuario_usuario FOREIGN KEY (id_estado_usuario)
        references login.estado_usuario (id)
        on update cascade
        on delete restrict
);

comment on table login.usuario is 'Credenciales y datos de acceso/autenticación del usuario';
comment on column login.usuario.password is 'Password almacenado como hash (ej. bcrypt, 60 caracteres)';
comment on column login.usuario.lang_key is 'Idioma preferido del usuario (ej. es, en)';
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

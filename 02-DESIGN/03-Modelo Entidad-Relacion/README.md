# David Saiz
## Esquema Login

create schema if not exists login;
 
-- Estado_Usuario
create table login.estado_usuario (
    id             SERIAL       not null,
    nombre_estado  VARCHAR(20)  not null,
    constraint pk_estado_usuario PRIMARY KEY (id),
    constraint uc_nombre_estado UNIQUE (nombre_estado)
);

comment on table login.estado_usuario is 'Catálogo de estados de un usuario dentro del sistema';
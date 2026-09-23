-- ============================================================
-- 1. DROP SCHEMAS
-- ============================================================
DROP SCHEMA IF EXISTS login CASCADE;
DROP SCHEMA IF EXISTS vehiculo CASCADE;
DROP SCHEMA IF EXISTS parqueadero CASCADE;
DROP SCHEMA IF EXISTS reservas CASCADE;
DROP SCHEMA IF EXISTS favoritos CASCADE;
DROP SCHEMA IF EXISTS historial_resenas CASCADE;
DROP SCHEMA IF EXISTS pagos CASCADE;


-- ============================================================
-- 2. CREATE SCHEMAS
-- ============================================================
CREATE SCHEMA login;
CREATE SCHEMA vehiculo;
CREATE SCHEMA parqueadero;
CREATE SCHEMA reservas;
CREATE SCHEMA favoritos;
CREATE SCHEMA historial_resenas;
CREATE SCHEMA pagos;


-- ============================================================
-- 3. CREATE TABLES
-- ============================================================

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


create table login.rol_usuario (
    id_rol      INT not null,
    id_usuario  INT not null,
    constraint pk_rol_usuario PRIMARY KEY (id_rol, id_usuario),
    constraint fk_rol_rol_usuario FOREIGN KEY (id_rol)
        references login.rol (id),
    constraint fk_usuario_rol_usuario FOREIGN KEY (id_usuario)
        references login.usuario (id)
);

comment on table login.rol_usuario is 'Relación N:M entre usuario y rol (un usuario puede tener varios roles)';


create table login.cuenta (
    id                  SERIAL        not null,
    id_usuario          INT           not null,
    id_tipo_documento   INT           not null,
    numero_documento    VARCHAR(20)   not null,
    primer_nombre       VARCHAR(255)  not null,
    segundo_nombre      VARCHAR(255)  null,
    primer_apellido     VARCHAR(255)  not null,
    segundo_apellido    VARCHAR(255)  null,
    telefono            VARCHAR(20)   not null,
    imagen_perfil       VARCHAR(255)  null,
    constraint pk_cuenta PRIMARY KEY (id),
    constraint uc_usuario_cuenta UNIQUE (id_usuario),
    constraint uc_numero_documento UNIQUE (numero_documento),
    constraint fk_usuario_cuenta FOREIGN KEY (id_usuario)
        references login.usuario (id),
    constraint fk_tipo_documento_cuenta FOREIGN KEY (id_tipo_documento)
        references login.tipo_documento (id)
);

comment on table login.cuenta is 'Información personal / perfil del usuario, en relación 1:1 con usuario';
comment on column login.cuenta.imagen_perfil is 'Ruta o URL de la imagen de perfil';


-- ---------- 3.2 VEHICULO ----------
CREATE TABLE vehiculo.tipo (
    id      SERIAL,
    nombre  VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

comment on table vehiculo.tipo is 'Catálogo que clasifica la clase o tipo de vehículo que ingresa al parqueadero';
comment on column vehiculo.tipo.id is 'Identificador único de la categoría (Llave primaria)';
comment on column vehiculo.tipo.nombre is 'Nombre descriptivo de la categoría (ej. Carro, Moto, Camioneta, Bicicleta)';

CREATE TABLE vehiculo.estado_vehiculo (
    id                      SERIAL,
    nombre_estado_vehiculo  VARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (nombre_estado_vehiculo)
);

comment on table vehiculo.estado_vehiculo is 'Define los estados administrativos u operativos en los que puede estar registrado un vehículo';
comment on column vehiculo.estado_vehiculo.id is 'Identificador único de cada estado de vehículo (Llave primaria)';
comment on column vehiculo.estado_vehiculo.nombre_estado_vehiculo is 'Nombre descriptivo del estado (ej. Activo, Inactivo, Reportado, En Parqueadero)';

CREATE TABLE vehiculo.vehiculo (
    id                  SERIAL,
    id_tipo             INTEGER NOT NULL,
    id_estado_vehiculo  INTEGER NOT NULL,
    placa               VARCHAR(10) NOT NULL,
    marca               VARCHAR(100) NOT NULL,
    modelo              VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (placa),
    FOREIGN KEY (id_tipo) REFERENCES vehiculo.tipo (id),
    FOREIGN KEY (id_estado_vehiculo) REFERENCES vehiculo.estado_vehiculo (id)
);

comment on table vehiculo.vehiculo is 'Es la tabla principal que almacena los datos básicos e identificativos de cada uno de los automotores registrados en el sistema';
comment on column vehiculo.vehiculo.id is 'Identificador único y numérico del vehículo (Llave primaria)';
comment on column vehiculo.vehiculo.id_tipo is 'Llave foránea que define la categoría del automotor (conecta con la tabla tipo)';
comment on column vehiculo.vehiculo.id_estado_vehiculo is 'Llave foránea que indica la situación actual del carro o moto (conecta con estado_vehiculo)';
comment on column vehiculo.vehiculo.placa is 'Matrícula o caracteres únicos de identificación del vehículo (propiedad única)';
comment on table vehiculo.vehiculo is 'La relación con el dueño (cuenta) se maneja exclusivamente a través de vehiculo.cuenta_vehiculo, para no duplicar la relación en dos lugares';

CREATE TABLE vehiculo.cuenta_vehiculo (
    id_cuenta               INTEGER NOT NULL,
    id_vehiculo             INTEGER NOT NULL,
    color                   VARCHAR(30) NOT NULL,
    url_tarjeta_propiedad   VARCHAR(255),
    url_foto                VARCHAR(255) NOT NULL,
    fecha_registro          TIMESTAMP NOT NULL,
    PRIMARY KEY (id_cuenta, id_vehiculo),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo.vehiculo (id),
    FOREIGN KEY (id_cuenta) REFERENCES login.cuenta (id)
);

comment on table vehiculo.cuenta_vehiculo is 'Tabla intermedia (de ruptura) que gestiona la relación de muchos a muchos entre las cuentas de los usuarios y los vehículos en el sistema; es la única fuente de verdad para saber a quién pertenece cada vehículo';
comment on column vehiculo.cuenta_vehiculo.id_cuenta is 'Identificador único del perfil del usuario (Llave foránea / Primaria compuesta)';
comment on column vehiculo.cuenta_vehiculo.id_vehiculo is 'Identificador único del vehículo asociado (Llave foránea / Primaria compuesta)';
comment on column vehiculo.cuenta_vehiculo.color is 'Color exterior actual del automotor registrado';
comment on column vehiculo.cuenta_vehiculo.fecha_registro is 'Fecha y hora exacta en la que se creó este vínculo o asociación en la plataforma';
comment on column vehiculo.cuenta_vehiculo.url_foto is 'Ruta de la imagen o fotografía del vehículo en el sistema';
comment on column vehiculo.cuenta_vehiculo.url_tarjeta_propiedad is 'Ruta del archivo o enlace al documento digital de la tarjeta de propiedad del vehículo';


-- ---------- 3.3 PARQUEADERO — NÚCLEO ----------
create table parqueadero.estado_sitio (
	id serial not null,
	nombre_estado varchar(20) not null,
	constraint pk_estado_sitio primary key (id),
	constraint uk_estado_sitio__nombre_estado unique (nombre_estado)
);

comment on table parqueadero.estado_sitio is 'catalogo de estados posibles de un sitio de parqueadero (Activo, Inactivo, En revision)';
comment on column parqueadero.estado_sitio.id is 'identificador unico del estado';
comment on column parqueadero.estado_sitio.nombre_estado is 'nombre del estado del sitio';


create table parqueadero.estado_espacio(
	id serial not null,
	nombre_estado_espacio varchar(20) not null,
	constraint pk_estado_espacio primary key (id),
	constraint uk_estado_espacio__nombre_estado_espacio unique (nombre_estado_espacio)
);

comment on table parqueadero.estado_espacio is 'catalogo de estados posibles de un espacio dentro del sitio (disponible, ocupado, mantenimiento)';
comment on column parqueadero.estado_espacio.id is 'identificador unico del estado';
comment on column parqueadero.estado_espacio.nombre_estado_espacio is 'nombre del estado del espacio';


create table parqueadero.tipo_vehiculo (
	id serial not null,
	nombre_tipo varchar(50) not null,
	constraint pk_tipo_vehiculo primary key (id),
	constraint uk_tipo_vehiculo__nombre_tipo unique (nombre_tipo)
);

comment on table parqueadero.tipo_vehiculo is 'catalogo de tipos de vehiculo admitidos (carro, moto, bicicleta, camioneta)';
comment on column parqueadero.tipo_vehiculo.id is 'identificador unico del tipo de vehiculo';
comment on column parqueadero.tipo_vehiculo.nombre_tipo is 'nombre del tipo de vehiculo';


create table parqueadero.estado_tarifa (
	id serial not null,
	nombre_estado varchar(20) not null,
	constraint pk_estado_tarifa primary key (id),
	constraint uk_estado_tarifa__nombre_estado unique (nombre_estado)
);

comment on table parqueadero.estado_tarifa is 'catalogo de estados posibles de una tarifa (activa, inactiva, vencida)';
comment on column parqueadero.estado_tarifa.id is 'identificador unico del estado';
comment on column parqueadero.estado_tarifa.nombre_estado is 'nombre del estado de la tarifa';


create table parqueadero.sitio (
	id serial not null,
	id_estado_sitio integer not null,
	nombre varchar(100) not null,
	direccion varchar(200) not null,
	telefono varchar(20) not null,
	horario_apertura time not null,
	horario_cierre time not null,
	nit varchar(255) not null,
	descripcion varchar(500) null,
	url_certificado_ctl varchar(255) not null,
	constraint pk_sitio primary key (id),
	constraint fk_estado_sitio__sitio foreign key (id_estado_sitio) references parqueadero.estado_sitio(id)
		on update cascade on delete restrict
);

comment on table parqueadero.sitio is 'Parqueaderos registrados en la plataforma, cada uno con su ubicacion, horario y datos legales';
comment on column parqueadero.sitio.id is 'identificador unico del sitio';
comment on column parqueadero.sitio.id_estado_sitio is 'estado actual del sitio, referencia a estado_sitio';
comment on column parqueadero.sitio.nombre is 'nombre comercial del sitio de parqueo';
comment on column parqueadero.sitio.direccion is 'direccion fisica del sitio';
comment on column parqueadero.sitio.telefono is 'telefono de contacto del sitio';
comment on column parqueadero.sitio.horario_apertura is 'hora de apertura diaria del sitio';
comment on column parqueadero.sitio.horario_cierre is 'hora de cierre diaria del sitio';
comment on column parqueadero.sitio.nit is 'numero de identificacion tributaria del sitio';
comment on column parqueadero.sitio.descripcion is 'descripcion opcional del sitio de parqueo';
comment on column parqueadero.sitio.url_certificado_ctl is 'url del certificado de camara de comercio del sitio';
comment on constraint fk_estado_sitio__sitio on parqueadero.sitio is
	'si se actualiza el id de un estado en estado_sitio, se actualiza en cascada aqui (on update cascade); pero no se puede eliminar un estado de estado_sitio si algun sitio lo esta usando (on delete restrict), para evitar sitios sin estado valido';


create table parqueadero.foto_sitio (
	id serial not null,
	id_sitio integer not null,
	url_foto varchar(255) not null,
	fecha_subida timestamp not null,
	constraint pk_foto_sitio primary key (id),
	constraint fk_sitio__foto_sitio foreign key (id_sitio) references parqueadero.sitio(id)
		on update cascade on delete cascade
);

comment on table parqueadero.foto_sitio is 'Fotos asociadas a un sitio de parqueo, para mostrar la galeria del lugar';
comment on column parqueadero.foto_sitio.id is 'identificador unico de la foto';
comment on column parqueadero.foto_sitio.id_sitio is 'sitio al que pertenece la foto, referencia a sitio';
comment on column parqueadero.foto_sitio.url_foto is 'url donde esta almacenada la imagen';
comment on column parqueadero.foto_sitio.fecha_subida is 'fecha y hora en que se subio la foto';


create table parqueadero.espacio (
	id serial not null,
	id_sitio integer not null,
	id_estado_espacio integer not null,
	numero varchar(20) not null,
	largo decimal (5,2) null,
	ancho decimal (5,2) null,
	altura_maxima decimal(5,2) null,
	constraint pk_espacio primary key (id),
	constraint uk_espacio__sitio_numero unique (id_sitio, numero),
	constraint fk_sitio__espacio foreign key (id_sitio) references parqueadero.sitio(id)
		on update cascade on delete cascade,
	constraint fk_estado_espacio__espacio foreign key (id_estado_espacio) references parqueadero.estado_espacio(id)
		on update cascade on delete restrict
);

comment on table parqueadero.espacio is 'espacios fisicos de parqueo dentro de un sitio, cada uno con sus dimensiones y estado';
comment on column parqueadero.espacio.id is 'identificador unico del espacio';
comment on column parqueadero.espacio.id_sitio is 'sitio al que pertenece el espacio, referencia a sitio';
comment on column parqueadero.espacio.id_estado_espacio is 'estado actual del espacio';
comment on column parqueadero.espacio.numero is 'numero o codigo del espacio dentro del sitio, ej A-01';
comment on column parqueadero.espacio.largo is 'largo del espacio en metros, opcional';
comment on column parqueadero.espacio.ancho is 'ancho del espacio en metros, opcional';
comment on column parqueadero.espacio.altura_maxima is 'altura maxima permitida en el espacio en metros, opcional';
comment on constraint fk_sitio__espacio on parqueadero.espacio is
	'un espacio no puede existir sin su sitio: si se borra el sitio, se borran en cascada sus espacios. Sin embargo, reservas.reserva y parqueadero.registro_entrada_salida NO cascadean desde espacio (quedan en RESTRICT/SET NULL), por lo que antes de borrar un sitio con historial hay que resolver esos registros explícitamente';


create table parqueadero.foto_espacio (
	id serial not null,
	id_espacio integer not null,
	url_foto varchar(255) not null,
	fecha_subida timestamp not null,
	constraint pk_foto_espacio primary key (id),
	constraint fk_espacio__foto_espacio foreign key (id_espacio) references parqueadero.espacio(id)
		on update cascade on delete cascade
);

comment on table parqueadero.foto_espacio is 'Fotos asociadas a un espacio de parqueo especifico';
comment on column parqueadero.foto_espacio.id is 'identificador unico de la foto';
comment on column parqueadero.foto_espacio.id_espacio is 'espacio al que pertenece la foto, referencia a espacio';
comment on column parqueadero.foto_espacio.url_foto is 'url donde esta almacenada la imagen';
comment on column parqueadero.foto_espacio.fecha_subida is 'fecha y hora en que se subio la foto';


create table parqueadero.tipo_vehiculo_espacio (
	id_tipo_vehiculo integer not null,
	id_espacio integer not null,
	constraint pk_tipo_vehiculo_espacio primary key (id_tipo_vehiculo, id_espacio),
	constraint fk_tipo_vehiculo__tipo_vehiculo_espacio foreign key (id_tipo_vehiculo) references parqueadero.tipo_vehiculo(id)
		on update cascade on delete cascade,
	constraint fk_espacio__tipo_vehiculo_espacio foreign key (id_espacio) references parqueadero.espacio(id)
		on update cascade on delete cascade
);

comment on table parqueadero.tipo_vehiculo_espacio is 'Relacion muchos a muchos: que tipos de vehiculo puede admitir cada espacio de parqueo';
comment on column parqueadero.tipo_vehiculo_espacio.id_tipo_vehiculo is 'tipo de vehiculo admitido, referencia a tipo_vehiculo';
comment on column parqueadero.tipo_vehiculo_espacio.id_espacio is 'espacio que admite ese tipo de vehiculo, referencia a espacio';


create table parqueadero.tarifa (
	id serial not null,
	id_sitio integer not null,
	id_estado_tarifa integer not null,
	nombre_tarifa varchar(50) not null,
	descripcion varchar(255) null,
	valor decimal(19,0) not null,
	constraint pk_tarifa primary key (id),
	constraint fk_sitio__tarifa foreign key (id_sitio) references parqueadero.sitio(id)
		on update cascade on delete cascade,
	constraint fk_estado_tarifa__tarifa foreign key (id_estado_tarifa) references parqueadero.estado_tarifa(id)
		on update cascade on delete restrict
);

comment on table parqueadero.tarifa is 'Tarifas de cobro definidas por cada sitio de parqueo, ej tarifa hora, tarifa dia, tarifa mensual';
comment on column parqueadero.tarifa.id is 'identificador unico de la tarifa';
comment on column parqueadero.tarifa.id_sitio is 'sitio al que pertenece la tarifa, referencia a sitio';
comment on column parqueadero.tarifa.id_estado_tarifa is 'estado actual de la tarifa, referencia a estado_tarifa';
comment on column parqueadero.tarifa.nombre_tarifa is 'nombre descriptivo de la tarifa';
comment on column parqueadero.tarifa.descripcion is 'descripcion opcional de la tarifa';
comment on column parqueadero.tarifa.valor is 'valor monetario de la tarifa';


create table parqueadero.horario_tarifa (
	id serial not null,
	id_tarifa integer not null,
	dia_semana varchar(20) not null,
	hora_inicio time not null,
	hora_fin time not null,
	constraint pk_horario_tarifa primary key (id),
	constraint fk_tarifa__horario_tarifa foreign key (id_tarifa) references parqueadero.tarifa(id)
		on update cascade on delete cascade,
	constraint ck_horario_tarifa__dia_semana check (dia_semana in ('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'))
);

comment on table parqueadero.horario_tarifa is 'Dias y horas en que aplica cada tarifa definida para un sitio';
comment on column parqueadero.horario_tarifa.id is 'identificador unico del horario';
comment on column parqueadero.horario_tarifa.id_tarifa is 'tarifa a la que pertenece este horario, referencia a tarifa';
comment on column parqueadero.horario_tarifa.dia_semana is 'dia de la semana en que aplica la tarifa, valores permitidos: Lunes a Domingo';
comment on column parqueadero.horario_tarifa.hora_inicio is 'hora de inicio en que aplica la tarifa ese dia';
comment on column parqueadero.horario_tarifa.hora_fin is 'hora de fin en que aplica la tarifa ese dia';


create table parqueadero.tarifa_tipo_vehiculo (
	id_tarifa integer not null,
	id_tipo_vehiculo integer not null,
	constraint pk_tarifa_tipo_vehiculo primary key (id_tarifa, id_tipo_vehiculo),
	constraint fk_tarifa__tarifa_tipo_vehiculo foreign key (id_tarifa) references parqueadero.tarifa(id)
		on update cascade on delete cascade,
	constraint fk_tipo_vehiculo__tarifa_tipo_vehiculo foreign key (id_tipo_vehiculo) references parqueadero.tipo_vehiculo(id)
		on update cascade on delete cascade
);

comment on table parqueadero.tarifa_tipo_vehiculo is 'Relacion muchos a muchos: que tarifa aplica segun el tipo de vehiculo';
comment on column parqueadero.tarifa_tipo_vehiculo.id_tarifa is 'tarifa aplicada, referencia a tarifa';
comment on column parqueadero.tarifa_tipo_vehiculo.id_tipo_vehiculo is 'tipo de vehiculo al que aplica la tarifa, referencia a tipo_vehiculo';


-- ---------- 3.4 RESERVAS ----------
CREATE TABLE reservas.estado_reserva (
    id SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL
);

comment on table reservas.estado_reserva is 'Catálogo que define las diferentes situaciones o etapas en las que puede estar una reserva';
comment on column reservas.estado_reserva.id is 'Identificador único de cada estado de reserva (Llave primaria)';
comment on column reservas.estado_reserva.nombre_estado is 'Nombre descriptivo del estado (ej. Activa, En Progreso, Completada, Cancelada)';

CREATE TABLE reservas.reserva (
    id SERIAL PRIMARY KEY,
    id_cuenta INT NOT NULL,
    id_vehiculo INT NOT NULL,
    id_espacio INT NOT NULL,
    id_estado_reserva INT NOT NULL,
    codigo_reserva VARCHAR(50) UNIQUE NOT NULL,
    fecha_reserva TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    valor_total NUMERIC(10, 2) NOT NULL,
    observaciones VARCHAR(255),
    fecha_cancelacion TIMESTAMP,
    CONSTRAINT fk_reserva_estado_reserva FOREIGN KEY (id_estado_reserva) REFERENCES reservas.estado_reserva(id),
    CONSTRAINT fk_reserva_cuenta FOREIGN KEY (id_cuenta) REFERENCES login.cuenta(id),
    CONSTRAINT fk_reserva_vehiculo FOREIGN KEY (id_vehiculo) REFERENCES vehiculo.vehiculo(id),
    CONSTRAINT fk_reserva_espacio FOREIGN KEY (id_espacio) REFERENCES parqueadero.espacio(id)
        on update cascade on delete restrict
);

comment on table reservas.reserva is 'Es la tabla principal que registra y gestiona cada una de las solicitudes de reserva de estacionamiento en el sistema';
comment on column reservas.reserva.id is 'Identificador único y numérico de la reserva (Llave primaria)';
comment on column reservas.reserva.id_cuenta is 'Llave foránea que asocia la reserva con la cuenta que la solicitó';
comment on column reservas.reserva.id_espacio is 'Llave foránea que indica el cupo o celda de parqueo reservada';
comment on column reservas.reserva.id_estado_reserva is 'Llave foránea que conecta con el estado actual de la solicitud (ej. Pendiente, Confirmada, Cancelada)';
comment on column reservas.reserva.id_vehiculo is 'Llave foránea que asocia el vehículo específico que ocupará el lugar';
comment on column reservas.reserva.codigo_reserva is 'Código alfanumérico único generado para que el usuario identifique o valide su reserva (ej. para un código QR)';
comment on column reservas.reserva.fecha_reserva is 'Fecha y hora exacta en la que el usuario creó la reserva en el sistema';
comment on column reservas.reserva.fecha_inicio is 'Fecha y hora programada para el ingreso del vehículo al parqueadero';
comment on column reservas.reserva.fecha_fin is 'Fecha y hora programada para la salida del vehículo y finalización del servicio';
comment on column reservas.reserva.fecha_cancelacion is 'Fecha y hora exacta en la que se anuló la reserva (solo se llena si aplica, opcional)';
comment on column reservas.reserva.observaciones is 'Comentarios adicionales, notas o requerimientos especiales del usuario (campo opcional)';
comment on column reservas.reserva.valor_total is 'Costo económico total calculado para el tiempo de la reserva';


-- ---------- 3.5 FAVORITOS ----------
CREATE TABLE favoritos.favorito (
    id SERIAL PRIMARY KEY,
    id_cuenta INT NOT NULL,
    id_sitio INT NOT NULL,
    guardado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uc_cuenta_sitio_favorito UNIQUE (id_cuenta, id_sitio),
    CONSTRAINT fk_favorito_cuenta FOREIGN KEY (id_cuenta) REFERENCES login.cuenta(id),
    CONSTRAINT fk_favorito_sitio FOREIGN KEY (id_sitio) REFERENCES parqueadero.sitio(id)
);

comment on table favoritos.favorito is 'Permite a los usuarios guardar sus parqueaderos preferidos o recurrentes para accesos rápidos en el futuro';
comment on column favoritos.favorito.id_cuenta is 'Llave foránea que identifica al cliente dueño del favorito';
comment on column favoritos.favorito.id_sitio is 'Llave foránea que identifica la sede o parqueadero marcado como favorito';
comment on column favoritos.favorito.guardado_en is 'Fecha y hora exacta en la que el usuario guardó el parqueadero en su lista de favoritos';


-- ---------- 3.6 PARQUEADERO — registro_entrada_salida ----------
create table parqueadero.registro_entrada_salida (
	id serial not null,
	id_espacio integer not null,
	id_tarifa integer not null,
	id_vehiculo integer not null,
	id_reserva integer null,
	fecha_hora_entrada timestamp not null,
	fecha_hora_salida timestamp null,
	monto_cobrado decimal(19,0) null,
	constraint pk_registro_entrada_salida primary key (id),
	constraint fk_espacio__registro_entrada_salida foreign key (id_espacio) references parqueadero.espacio(id)
		on update cascade on delete restrict,
	constraint fk_tarifa__registro_entrada_salida foreign key (id_tarifa) references parqueadero.tarifa(id)
		on update cascade on delete restrict,
	constraint fk_vehiculo__registro_entrada_salida foreign key (id_vehiculo) references vehiculo.vehiculo(id)
		on update cascade on delete restrict,
	constraint fk_reserva__registro_entrada_salida foreign key (id_reserva) references reservas.reserva(id)
		on update cascade on delete set null
);

comment on table parqueadero.registro_entrada_salida is 'Registro real de entrada y salida de un vehiculo en un espacio de parqueo, con o sin reserva previa';
comment on column parqueadero.registro_entrada_salida.id is 'identificador unico del registro';
comment on column parqueadero.registro_entrada_salida.id_espacio is 'espacio donde se parqueo el vehiculo, referencia a espacio';
comment on column parqueadero.registro_entrada_salida.id_tarifa is 'tarifa aplicada al momento del cobro, referencia a tarifa';
comment on column parqueadero.registro_entrada_salida.id_vehiculo is 'vehiculo que entro, referencia a vehiculo.vehiculo';
comment on column parqueadero.registro_entrada_salida.id_reserva is 'reserva asociada a esta entrada, opcional, referencia a reservas.reserva';
comment on column parqueadero.registro_entrada_salida.fecha_hora_entrada is 'fecha y hora real en que el vehiculo entro al espacio';
comment on column parqueadero.registro_entrada_salida.fecha_hora_salida is 'fecha y hora real en que el vehiculo salio, null mientras sigue parqueado';
comment on column parqueadero.registro_entrada_salida.monto_cobrado is 'valor cobrado por el tiempo de parqueo, null mientras el vehiculo sigue adentro';
comment on constraint fk_reserva__registro_entrada_salida on parqueadero.registro_entrada_salida is
	'permite entradas sin reserva previa (walk-in); si se borra la reserva, el registro no se borra, solo queda sin reserva asociada';


-- ---------- 3.7 HISTORIAL Y RESEÑAS ----------
CREATE TABLE historial_resenas.historial (
    id SERIAL PRIMARY KEY,
    id_registro_entrada_salida INT NOT NULL,
    id_reserva INT NOT NULL,
    id_usuario INT NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    entrada_real TIMESTAMP NOT NULL,
    salida_real TIMESTAMP NOT NULL,
    metodo_acceso VARCHAR(50),
    observaciones VARCHAR(500),
    CONSTRAINT fk_historial_reserva FOREIGN KEY (id_reserva) REFERENCES reservas.reserva(id),
    CONSTRAINT fk_historial_usuario FOREIGN KEY (id_usuario) REFERENCES login.usuario(id),
    CONSTRAINT fk_historial_registro FOREIGN KEY (id_registro_entrada_salida) REFERENCES parqueadero.registro_entrada_salida(id)
);

comment on table historial_resenas.historial is 'Registra de forma detallada cada evento físico de entrada y salida de los usuarios y vehículos en el sistema';
comment on column historial_resenas.historial.id is 'Identificador único y numérico del registro de historial (Llave primaria)';
comment on column historial_resenas.historial.id_registro_entrada_salida is 'Llave foránea que conecta con la bitácora física de control del parqueadero';
comment on column historial_resenas.historial.id_reserva is 'Llave foránea que vincula este acceso con una reserva programada (si aplica)';
comment on column historial_resenas.historial.id_usuario is 'Llave foránea que identifica al conductor o usuario que accedió';
comment on column historial_resenas.historial.creado_en is 'Fecha y hora en la que el sistema generó automáticamente el registro';
comment on column historial_resenas.historial.entrada_real is 'Fecha y hora exacta capturada en el momento del ingreso del vehículo';
comment on column historial_resenas.historial.salida_real is 'Fecha y hora exacta capturada en el momento del egreso del vehículo';
comment on column historial_resenas.historial.metodo_acceso is 'Mecanismo tecnológico utilizado para validar el ingreso (ej. Código QR, Reconocimiento de Placa, Tarjeta)';
comment on column historial_resenas.historial.observaciones is 'Notas complementarias o incidencias reportadas durante la estancia (campo opcional)';

CREATE TABLE historial_resenas.resena (
    id SERIAL PRIMARY KEY,
    calificacion INT NOT NULL,
    comentario VARCHAR(500),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_reserva INT NOT NULL,
    id_sitio INT NOT NULL,
    CONSTRAINT ck_resena_calificacion CHECK (calificacion BETWEEN 1 AND 5),
    CONSTRAINT fk_resena_reserva FOREIGN KEY (id_reserva) REFERENCES reservas.reserva(id),
    CONSTRAINT fk_resena_sitio FOREIGN KEY (id_sitio) REFERENCES parqueadero.sitio(id)
);

comment on table historial_resenas.resena is 'Almacena la calificación y comentarios que los usuarios otorgan a los parqueaderos para medir la calidad del servicio';
comment on column historial_resenas.resena.id is 'Identificador único de la reseña (Llave primaria)';
comment on column historial_resenas.resena.id_reserva is 'Llave foránea que conecta la opinión con la reserva que originó la experiencia';
comment on column historial_resenas.resena.id_sitio is 'Llave foránea que asocia directamente la calificación con la sede del parqueadero evaluado';
comment on column historial_resenas.resena.calificacion is 'Valor numérico de 1 a 5 que representa la puntuación asignada por el usuario';
comment on column historial_resenas.resena.comentario is 'Opinión o feedback textual escrito por el cliente sobre su experiencia (campo opcional)';
comment on column historial_resenas.resena.creado_en is 'Fecha y hora exacta en la que se publicó la reseña';




-- ============================================================
-- 4. DML — INSERTS
-- ============================================================

-- ---------- 4.1 LOGIN ----------
-- Se cargan los estados, roles y documentos base del sistema de autenticación.
-- Estos datos permiten crear usuarios con perfiles y permisos válidos desde el inicio.
INSERT INTO login.estado_usuario (nombre_estado) values
    ('ACTIVO'), ('INACTIVO'), ('BLOQUEADO'), ('PENDIENTE'), ('ELIMINADO');

-- Se definen los roles que pueden tener los usuarios del sistema.
INSERT INTO login.rol (nombre) values
    ('ARRENDATARIO'), ('ARRENDADOR'), ('ADMINISTRADOR');

-- Se registran los tipos de documento de identidad soportados por la plataforma.
INSERT INTO login.tipo_documento (nombre_documento, siglas, estado) values
    ('Cédula de Ciudadanía', 'CC', 'ACTIVO'),
    ('Cédula de Extranjería', 'CE', 'ACTIVO'),
    ('NIT', 'NIT', 'ACTIVO');

-- Se crean los usuarios base del sistema y sus credenciales iniciales.
INSERT INTO login.usuario (id_estado_usuario, email, password, lang_key, fecha_creacion) values
    (1, 'luisdavid@gmail.com', 'hash_pass_1', 'es', current_timestamp),
    (1, 'julianbautista56@gmail.com', 'hash_pass_2', 'es', current_timestamp),
    (4, 'dylancardozo_9889@outlook.com', 'hash_pass_3', 'es', current_timestamp);

-- Se registra la información personal asociada a cada usuario.
INSERT INTO login.cuenta (id_usuario, id_tipo_documento, numero_documento, primer_nombre, primer_apellido, telefono) values
    (1, 1, '1031567890', 'Luis', 'Diaz', '3003254678'),
    (2, 1, '1013810876', 'Julian', 'Niño', '3228276549'),
    (3, 3, '52347490', 'Dylan', 'Cardozo', '3138097865');

-- Se asignan los roles a los usuarios creados previamente.
INSERT INTO login.rol_usuario (id_rol, id_usuario) values
    (1, 1), (2, 2), (2, 1), (3, 3);


-- ---------- 4.2 VEHICULO ----------
-- Se cargan los datos base del catálogo y del primer vehículo registrado.
-- Esto permite que existan tipos, estados y asociaciones del propietario con su vehículo.
INSERT INTO vehiculo.tipo (nombre) VALUES ('Automóvil');
INSERT INTO vehiculo.estado_vehiculo (nombre_estado_vehiculo) VALUES ('Activo');
INSERT INTO vehiculo.vehiculo (id_tipo, id_estado_vehiculo, placa, marca, modelo)
VALUES (1, 1, 'ABC123', 'Mazda', '3');

INSERT INTO vehiculo.cuenta_vehiculo (id_cuenta, id_vehiculo, color, url_foto, fecha_registro)
VALUES (1, 1, 'Gris', 'https://parkiox.com/fotos/vehiculos/abc123.jpg', current_timestamp);


-- ---------- 4.3 PARQUEADERO ----------
-- Se cargan los catálogos del parqueadero y la información inicial de sitios,
-- espacios, fotos y tarifas para levantar una operación de prueba realista.
INSERT INTO parqueadero.estado_sitio (nombre_estado) values ('Activo'),('Inactivo'),('En revision');
INSERT INTO parqueadero.estado_espacio (nombre_estado_espacio) values ('Disponible'),('Ocupado'),('Mantenimiento');
INSERT INTO parqueadero.tipo_vehiculo (nombre_tipo) values ('Carro'),('Moto'),('Bicicleta'),('Camioneta');
INSERT INTO parqueadero.estado_tarifa (nombre_estado) values ('Activa'),('Inactiva'),('Vencida');

-- Se registran los tres sitios de parqueadero con sus horarios y datos legales.
INSERT INTO parqueadero.sitio (id_estado_sitio, nombre, direccion, telefono, horario_apertura, horario_cierre, nit, descripcion, url_certificado_ctl) values
(1, 'Parqueadero Central Bogota', 'Cra 7 # 45-12, Bogota', '6013456789', '06:00', '22:00', '900123456-1', 'Parqueadero cubierto en el centro de la ciudad', 'https://parkiox.com/certificados/central.pdf'),
(1, 'Parqueadero Zona Rosa', 'Cl 82 # 12-30, Bogota', '6017654321', '00:00', '23:59', '900654321-2', null, 'https://parkiox.com/certificados/zonarosa.pdf'),
(3, 'Parqueadero Chapinero', 'Cra 13 # 60-25, Bogota', '6019988776', '05:30', '21:00', '900998877-3', 'Parqueadero en remodelacion, apertura parcial', 'https://parkiox.com/certificados/chapinero.pdf');

-- Se habilitan fotos de cada sitio para simular una galería pública.
INSERT INTO parqueadero.foto_sitio (id_sitio, url_foto, fecha_subida) values
(1, 'https://parkiox.com/fotos/central_1.jpg', '2026-01-15 09:00:00'),
(1, 'https://parkiox.com/fotos/central_2.jpg', '2026-01-15 09:05:00'),
(2, 'https://parkiox.com/fotos/zonarosa_1.jpg', '2026-02-10 14:20:00'),
(2, 'https://parkiox.com/fotos/zonarosa_2.jpg', '2026-02-10 14:25:00'),
(3, 'https://parkiox.com/fotos/chapinero_1.jpg', '2026-03-01 11:10:00'),
(3, 'https://parkiox.com/fotos/chapinero_2.jpg', '2026-03-01 11:15:00');

-- Se crean los espacios físicos disponibles para cada parqueadero,
-- con sus dimensiones y estado inicial.
INSERT INTO parqueadero.espacio (id_sitio, id_estado_espacio, numero, largo, ancho, altura_maxima) values
(1, 1, 'A-01', 5.00, 2.50, 2.10),
(1, 1, 'A-02', 5.00, 2.50, 2.10),
(1, 2, 'A-03', 5.00, 2.50, 2.10),
(1, 3, 'A-04', 5.00, 2.50, 2.10),
(1, 1, 'A-05', 5.50, 2.80, 2.30),
(2, 1, 'B-01', 4.80, 2.40, 2.00),
(2, 2, 'B-02', 4.80, 2.40, 2.00),
(2, 1, 'B-03', 4.80, 2.40, 2.00),
(2, 1, 'B-04', 5.20, 2.60, 2.20),
(2, 3, 'B-05', 5.20, 2.60, 2.20),
(3, 1, 'C-01', 5.00, 2.50, 2.10),
(3, 1, 'C-02', 5.00, 2.50, 2.10),
(3, 2, 'C-03', 5.00, 2.50, 2.10),
(3, 1, 'C-04', 6.00, 3.00, 2.50),
(3, 3, 'C-05', 6.00, 3.00, 2.50);

-- Se agregan imágenes representativas de cada espacio disponible.
INSERT INTO parqueadero.foto_espacio (id_espacio, url_foto, fecha_subida) values
(1, 'https://parkiox.com/fotos/espacios/a01.jpg', '2026-01-16 08:00:00'),
(2, 'https://parkiox.com/fotos/espacios/a02.jpg', '2026-01-16 08:01:00'),
(3, 'https://parkiox.com/fotos/espacios/a03.jpg', '2026-01-16 08:02:00'),
(4, 'https://parkiox.com/fotos/espacios/a04.jpg', '2026-01-16 08:03:00'),
(5, 'https://parkiox.com/fotos/espacios/a05.jpg', '2026-01-16 08:04:00'),
(6, 'https://parkiox.com/fotos/espacios/b01.jpg', '2026-02-11 09:00:00'),
(7, 'https://parkiox.com/fotos/espacios/b02.jpg', '2026-02-11 09:01:00'),
(8, 'https://parkiox.com/fotos/espacios/b03.jpg', '2026-02-11 09:02:00'),
(9, 'https://parkiox.com/fotos/espacios/b04.jpg', '2026-02-11 09:03:00'),
(10, 'https://parkiox.com/fotos/espacios/b05.jpg', '2026-02-11 09:04:00'),
(11, 'https://parkiox.com/fotos/espacios/c01.jpg', '2026-03-02 10:00:00'),
(12, 'https://parkiox.com/fotos/espacios/c02.jpg', '2026-03-02 10:01:00'),
(13, 'https://parkiox.com/fotos/espacios/c03.jpg', '2026-03-02 10:02:00'),
(14, 'https://parkiox.com/fotos/espacios/c04.jpg', '2026-03-02 10:03:00'),
(15, 'https://parkiox.com/fotos/espacios/c05.jpg', '2026-03-02 10:04:00');

-- Se vinculan los tipos de vehículo con cada espacio disponible.
INSERT INTO parqueadero.tipo_vehiculo_espacio (id_tipo_vehiculo, id_espacio) values
(1, 1), (2, 1), (1, 2), (2, 2), (1, 3), (2, 3), (1, 4), (2, 4),
(1, 5), (2, 5), (4, 5),
(1, 6), (2, 6), (1, 7), (2, 7), (1, 8), (2, 8),
(1, 9), (2, 9), (4, 9),
(1, 10), (2, 10), (1, 11), (2, 11), (1, 12), (2, 12), (1, 13), (2, 13),
(1, 14), (2, 14), (4, 14),
(1, 15), (2, 15);

-- Se cargan las tarifas básicas por sitio y el rango de aplicación de cada una.
INSERT INTO parqueadero.tarifa (id_sitio, id_estado_tarifa, nombre_tarifa, descripcion, valor) values
(1, 1, 'Tarifa Hora', 'Cobro por hora o fraccion', 3500),
(1, 1, 'Tarifa Dia', 'Cobro por dia completo, maximo 24 horas', 25000),
(2, 1, 'Tarifa Hora', 'Cobro por hora o fraccion', 4200),
(2, 2, 'Tarifa Nocturna', 'Tarifa especial fuera de servicio temporalmente', 15000),
(3, 1, 'Tarifa Hora', null, 3000),
(3, 3, 'Tarifa Mensual', 'Tarifa mensual vencida, pendiente de renovacion', 180000);

INSERT INTO parqueadero.horario_tarifa (id_tarifa, dia_semana, hora_inicio, hora_fin) values
(1, 'Lunes', '06:00', '22:00'), (1, 'Martes', '06:00', '22:00'),
(2, 'Sabado', '06:00', '22:00'), (2, 'Domingo', '06:00', '22:00'),
(3, 'Lunes', '00:00', '23:59'), (3, 'Viernes', '00:00', '23:59'),
(4, 'Viernes', '22:00', '23:59'), (4, 'Sabado', '00:00', '06:00'),
(5, 'Lunes', '05:30', '21:00'), (5, 'Miercoles', '05:30', '21:00'),
(6, 'Lunes', '00:00', '23:59'), (6, 'Domingo', '00:00', '23:59');

-- Se asocian las tarifas con los tipos de vehículo a los que aplican.
INSERT INTO parqueadero.tarifa_tipo_vehiculo (id_tarifa, id_tipo_vehiculo) values
(1, 1), (1, 2), (2, 1), (2, 4), (3, 1), (3, 2),
(4, 1), (5, 1), (5, 2), (6, 1), (6, 4);


-- ---------- 4.4 RESERVAS ----------
-- Se inicializan los estados de la reserva y se cargan dos reservas reales
-- para validar el flujo de negocio desde la solicitud hasta el cobro.
INSERT INTO reservas.estado_reserva (nombre_estado) VALUES ('PENDIENTE'), ('CONFIRMADA'), ('CANCELADA'), ('FINALIZADA');

INSERT INTO reservas.reserva (id_cuenta, id_vehiculo, id_espacio, id_estado_reserva, codigo_reserva, fecha_inicio, fecha_fin, valor_total)
VALUES
    (1, 1, 1, 2, 'RSV-2026-0001', '2026-09-07 08:00:00', '2026-09-07 12:00:00', 14000),
    (1, 1, 6, 4, 'RSV-2026-0002', '2026-08-01 09:00:00', '2026-08-01 11:00:00', 8400);


-- ---------- 4.5 PARQUEADERO — registro_entrada_salida ----------
-- Se registra un ingreso físico real en un espacio, ligado a una reserva
-- y a una tarifa específica para representar el uso efectivo del parqueadero.
INSERT INTO parqueadero.registro_entrada_salida
    (id_espacio, id_tarifa, id_vehiculo, id_reserva, fecha_hora_entrada, fecha_hora_salida, monto_cobrado)
VALUES
    (1, 1, 1, 1, '2026-09-07 08:00:00', '2026-09-07 12:00:00', 14000);


-- ---------- 4.6 PAGOS ----------

INSERT INTO pagos.metodos (nombre) values
    ('Tarjeta de crédito');

INSERT INTO pagos.pagos
    (id_reserva, monto, referencia_externa, fecha_de_creacion, procesado_en, comprobante_url)
values
    (1, 14000, 'REF-2026-0001', '2026-09-07 14:00:00', '2026-09-07 14:05:00', 'https://comprobantes.com/rec001.pdf');

INSERT INTO pagos.pagos_metodos (id_pagos, id_metodos, valor_pagado) values
    (1, 1, 14000);

INSERT INTO pagos.factura (id_pagos, numero_recibo, fecha_emision, total, descripcion)
VALUES (1, 'REC-0001', now(), 14000.00, 'Pago reserva de parqueadero RSV-2026-0001');

INSERT INTO pagos.estado_pago (id_pagos, nombre_estado)
VALUES (1, 'APROBADO');



-- ============================================================
-- 5. UPDATES (5) ACTUALIZACIONES DE REGISTROS
-- ============================================================

-- ---------- 5.1 VEHICULO -------------
-- Esta actualización corrige el color registrado del vehículo asociado a la
-- cuenta 1 y al vehículo 1, simulando una modificación de datos del automotor.
UPDATE vehiculo.cuenta_vehiculo
SET color = 'Blanco'
WHERE id_cuenta = 1 AND id_vehiculo = 1;

-- ---------- 5.2 PARQUEADERO —----------
-- Se reemplaza la URL de una foto de espacio por una nueva versión,
-- con el fin de actualizar la imagen pública del espacio A-01.
UPDATE parqueadero.foto_espacio
SET url_foto = 'https://parkiox.com/fotos/espacios/a01_v2.jpg'
WHERE id_espacio = 1;

-- ---------- 5.3 PARQUEADERO —----------
-- Se modifica el horario de finalización de la tarifa del lunes para un
-- espacio o tarifa determinada, ajustando la vigencia del cobro.
UPDATE parqueadero.horario_tarifa
SET hora_fin = '23:00'
WHERE id_tarifa = 1 AND dia_semana = 'Lunes';

-- ---------- 5.4 PAGOS —----------
-- Esta actualización corrige el monto realmente pagado con un método de pago
-- específico dentro de una transacción, reflejando un ajuste o validación del pago.
UPDATE pagos.pagos_metodos
SET valor_pagado = 15000
WHERE id_pagos = 1 AND id_metodos = 1;

-- ---------- 5.5 HISTORIAL_RESENAS —----------
-- Se actualiza el texto de la reseña asociada a una reserva para reflejar
-- una opinión final corregida o mejor redactada por el usuario.
UPDATE historial_resenas.resena
SET comentario = 'Buen servicio, espacio amplio y bien ubicado'
WHERE id_reserva = 1;


-- ============================================================
-- 6. JOINS (5)
-- ============================================================

-- ---------- 6.1 LOGIN ----------
-- Esta consulta une usuarios, cuentas y estados para mostrar la información
-- completa del perfil de cada usuario junto con su estado actual en el sistema.
select
    u.id                                             AS id_usuario,
    u.email,
    c.primer_nombre || ' ' || c.primer_apellido       AS nombre_completo,
    eu.nombre_estado
from login.usuario u
join login.cuenta c on c.id_usuario = u.id
join login.estado_usuario eu on eu.id = u.id_estado_usuario
order by u.id;

-- ---------- 6.2 VEHICULO ----------
-- Esta consulta combina cada vehículo con su tipo y su estado para ver
-- la clasificación y la situación operativa de cada automotor registrado.
SELECT
    v.id, v.placa, v.marca, v.modelo,
    t.nombre AS tipo_vehiculo,
    ev.nombre_estado_vehiculo AS estado
FROM vehiculo.vehiculo v
INNER JOIN vehiculo.tipo t ON v.id_tipo = t.id
INNER JOIN vehiculo.estado_vehiculo ev ON v.id_estado_vehiculo = ev.id;

-- ---------- 6.3 PARQUEADERO ----------
-- Esta consulta relaciona un registro de entrada y salida con el espacio,
-- el sitio y la tarifa aplicada para conocer exactamente dónde y cuánto se cobró.
SELECT
    r.id AS id_registro,
    s.nombre AS sitio,
    e.numero AS espacio,
    t.valor AS tarifa_aplicada,
    r.fecha_hora_entrada,
    r.fecha_hora_salida,
    r.monto_cobrado
FROM parqueadero.registro_entrada_salida r
JOIN parqueadero.espacio e ON e.id = r.id_espacio
JOIN parqueadero.sitio s ON s.id = e.id_sitio
JOIN parqueadero.tarifa t ON t.id = r.id_tarifa;

-- ---------- 6.4 RESERVAS ----------
-- Esta consulta muestra la información principal de cada reserva con su
-- cliente, vehículo, espacio asignado y el estado actual de la solicitud.
SELECT
    r.codigo_reserva,
    c.primer_nombre,
    v.placa,
    esp.numero AS espacio,
    er.nombre_estado
FROM reservas.reserva r
JOIN login.cuenta c ON c.id = r.id_cuenta
JOIN vehiculo.vehiculo v ON v.id = r.id_vehiculo
JOIN parqueadero.espacio esp ON esp.id = r.id_espacio
JOIN reservas.estado_reserva er ON er.id = r.id_estado_reserva;

-- ---------- 6.5 PAGOS ----------
-- Esta consulta combina el pago con su método de pago, el valor pagado y
-- el estado de la transacción para observar el historial financiero de una reserva.
select
    p.id            as id_pago,
    p.referencia_externa,
    p.monto,
    m.nombre        as metodo_pago,
    pm.valor_pagado,
    ep.nombre_estado
from pagos.pagos p
join pagos.pagos_metodos pm on pm.id_pagos = p.id
join pagos.metodos m on m.id = pm.id_metodos
left join pagos.estado_pago ep on ep.id_pagos = p.id
where p.id_reserva = 1;


-- ============================================================
-- 7. SUBCONSULTAS (5)
-- ============================================================

-- ---------- 7.1 LOGIN ----------
-- Esta subconsulta devuelve los usuarios que tienen el rol de ARRENDADOR.
-- Se usa una subconsulta correlacionada dentro del WHERE para filtrar
-- los usuarios cuya identificación aparece en la tabla de roles asignados.
SELECT u.id, u.email
FROM login.usuario u
WHERE u.id IN (
    select ru.id_usuario
    from login.rol_usuario ru
    join login.rol r ON r.id = ru.id_rol
    where r.nombre = 'ARRENDADOR'
);

-- ---------- 7.2 VEHICULO ----------
-- Esta subconsulta obtiene los vehículos que comparten el mismo estado
-- operativo que el vehículo con placa ABC123.
-- Es útil para agrupar o detectar vehículos con el mismo comportamiento
-- administrativo o de operación dentro del sistema.
SELECT id, placa, marca, modelo
FROM vehiculo.vehiculo
WHERE id_estado_vehiculo = (
    SELECT id_estado_vehiculo FROM vehiculo.vehiculo WHERE placa = 'ABC123'
);

-- ---------- 7.3 PARQUEADERO ----------
-- Esta subconsulta identifica los sitios que tienen tarifas superiores al
-- promedio general de tarifas registradas en el sistema.
-- Permite ver qué parqueaderos se encuentran en una franja de precios más alta.
SELECT nombre, direccion
FROM parqueadero.sitio
WHERE id IN (
    SELECT id_sitio
    FROM parqueadero.tarifa
    WHERE valor > (SELECT AVG(valor) FROM parqueadero.tarifa)
);

-- ---------- 7.4 RESERVAS ----------
-- Esta subconsulta lista las reservas cuyo valor total supera el promedio
-- de todas las reservas realizadas.
-- Sirve para detectar reservas de mayor costo o valor excepcional.
SELECT codigo_reserva, valor_total
FROM reservas.reserva
WHERE valor_total > (
    SELECT AVG(valor_total) FROM reservas.reserva
);

-- ---------- 7.5 PAGOS ----------
-- Esta subconsulta devuelve los pagos que tienen asociada una factura.
-- Se usa para validar qué transacciones ya están respaldadas por un comprobante fiscal.
SELECT id, referencia_externa, monto
FROM pagos.pagos p
where id in (select f.id_pagos from pagos.factura f);


-- ============================================================
-- 8. DELETES DE INFORMACIÓN (5)
-- ============================================================

-- ---------- 8.1 LOGIN ----------

DELETE FROM login.rol_usuario
where id_usuario = (select id from login.usuario where email = 'luisdavid@gmail.com')
  and id_rol = (select id from login.rol where nombre = 'ARRENDATARIO');

-- ---------- 8.2 VEHICULO ----------
DELETE FROM vehiculo.cuenta_vehiculo
WHERE id_cuenta = 1 AND id_vehiculo = 1;

-- ---------- 8.3 PARQUEADERO ----------
DELETE FROM parqueadero.foto_espacio
WHERE id_espacio = 15;

-- ---------- 8.4 RESERVAS ----------
DELETE FROM reservas.reserva
WHERE codigo_reserva = 'RSV-2026-0002';

-- ---------- 8.5 PAGOS ----------
DELETE FROM pagos.estado_pago
WHERE id_pagos = 1 and nombre_estado = 'PENDIENTE';
CREATE TABLE Usuarios (
	id SERIAL PRIMARY KEY, 
	nombre VARCHAR(30) NOT NULL,
	apellido VARCHAR(30) NOT NULL,
	email VARCHAR(30) UNIQUE NOT NULL,
	rut VARCHAR(20) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	region VARCHAR(100) NOT NULL,
	comuna VARCHAR(100) NOT NULL
);

CREATE TABLE Proyectos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    creador_id INTEGER NOT NULL,
    fecha_inicio DATE DEFAULT CURRENT_DATE,
    fecha_fin DATE,
    FOREIGN KEY (creador_id) REFERENCES Usuarios(id)
);

CREATE TABLE Proyectos_Usuarios (
    proyecto_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    es_favorito BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (proyecto_id, usuario_id),
    FOREIGN KEY (proyecto_id) REFERENCES Proyectos(id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

CREATE TABLE Tareas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    proyecto_id INTEGER NOT NULL,
    titulo VARCHAR(15) NOT NULL,
    descripcion TEXT NOT NULL,
    completado BOOLEAN DEFAULT FALSE,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    FOREIGN KEY (proyecto_id) REFERENCES Proyectos(id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

CREATE TABLE Comentarios (
    id SERIAL PRIMARY KEY,
    Comentario TEXT NOT NULL,
    usuario_id INTEGER NOT NULL,
    tarea_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    FOREIGN KEY (tarea_id) REFERENCES Tareas(id) ON DELETE CASCADE
);

CREATE TABLE Notificaciones(
	ID SERIAL PRIMARY KEY,
	ID_UsuarioCreador INT REFERENCES Usuarios(ID) ON DELETE SET NULL,
	ID_UsuarioReceptor INT REFERENCES Usuarios(ID) ON DELETE CASCADE,
	ID_Proyecto INT REFERENCES Proyectos(ID) ON DELETE CASCADE,
	ID_Tarea INT REFERENCES Tareas(ID) ON DELETE CASCADE,
	Texto VARCHAR(155) NOT NULL,
	Leida BOOLEAN DEFAULT FALSE,
	FechaCreacion TIMESTAMP DEFAULT NOW()
);
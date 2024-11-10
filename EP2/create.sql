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

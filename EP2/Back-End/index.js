const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Client } = require("pg");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

//BD

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "WEB",
  password: "admin",
  port: 5432,
});

client.connect();

//BD

app.post("/api/register", async (req, res) => {
  const {
    nombre,
    apellido,
    email,
    rut,
    password,
    region,
    comuna,
    captchaToken,
  } = req.body;

  //console.log(req.body);

  try {
    const captchaSecret = "6LdTW3kqAAAAAP8gNGRbj6Qsan7gqqWn6pFPjMGG";
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: captchaSecret,
          response: captchaToken,
        },
      }
    );

    if (!response.data.success) {
      return res
        .status(400)
        .json({ message: "Fallo en reCAPTCHA. Intenta nuevamente." });
    }
  } catch (error) {
    console.error("Error de verificación de reCAPTCHA:", error);
    return res
      .status(500)
      .json({ message: "Error en el servidor al verificar CAPTCHA" });
  }

  if (
    !nombre ||
    !apellido ||
    !email ||
    !rut ||
    !password ||
    !region ||
    !comuna
  ) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      "INSERT INTO Usuarios (nombre, apellido, email, rut, password, region, comuna) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [nombre, apellido, email, rut, hashedPassword, region, comuna]
    );

    res
      .status(201)
      .json({ message: "Usuario registrado con éxito", user: result.rows[0] });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Email:", email);
  console.log("Password", password);

  try {
    const result = await client.query(
      "SELECT * FROM Usuarios WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id, email: user.email }, "secret", {
        expiresIn: "1h",
      });
      res.json({ message: "Login exitoso", token, userID: user.id });
    } else {
      res.status(400).json({ message: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

//PROYECTOS

app.get("/api/proyectos", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    const email = decoded.email;

    const userResult = await client.query(
      "SELECT id FROM Usuarios WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const proyectosResult = await client.query(
      `
            SELECT P.*, PU.es_favorito
            FROM Proyectos P
            JOIN Proyectos_Usuarios PU ON P.id = PU.proyecto_id
            WHERE PU.usuario_id = $1
        `,
      [user.id]
    );

    res.json(proyectosResult.rows);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }
    res.status(500).json({ message: "Error al obtener proyectos" });
  }
});

app.post("/api/proyectos", async (req, res) => {
  const { titulo, colaboradores } = req.body;

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No se proporcionó token" });
  }

  if (!titulo) {
    return res
      .status(400)
      .json({ error: "El título del proyecto es necesario." });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    const creadorId = decoded.id;
    await client.query("BEGIN");

    const proyectoResult = await client.query(
      "INSERT INTO Proyectos (titulo, creador_id, fecha_inicio) VALUES ($1, $2, CURRENT_DATE) RETURNING id",
      [titulo, creadorId]
    );

    const proyectoId = proyectoResult.rows[0].id;

    await client.query(
      "INSERT INTO Proyectos_Usuarios (proyecto_id, usuario_id, es_favorito) VALUES ($1, $2, FALSE)",
      [proyectoId, creadorId]
    );

    if (colaboradores && colaboradores.length > 0) {
      const colaboradorPromises = colaboradores.map((correo) => {
        return client.query(
          "INSERT INTO Proyectos_Usuarios (proyecto_id, usuario_id) VALUES ($1, (SELECT id FROM Usuarios WHERE email = $2))",
          [proyectoId, correo]
        );
      });

      await Promise.all(colaboradorPromises);
    }
    await client.query("COMMIT");

    res.status(201).json({ message: "Proyecto creado con éxito" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear el proyecto:", error);
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
});

app.get("/api/proyectos/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    const userId = decoded.id;

    const authCheck = await client.query(
      "SELECT 1 FROM Proyectos_Usuarios WHERE proyecto_id = $1 AND usuario_id = $2",
      [id, userId]
    );

    if (authCheck.rows.length === 0) {
      return res.status(403).json({ message: "Acceso denegado al proyecto" });
    }

    const result = await client.query(
      "SELECT titulo, fecha_inicio, fecha_fin, creador_id FROM Proyectos WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener los detalles del proyecto:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los detalles del proyecto" });
  }
});

app.put("/api/proyectos/:id/favorite", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    const userId = decoded.id;
    const projectId = req.params.id;
    const { es_favorito } = req.body;

    await client.query(
      "UPDATE Proyectos_Usuarios SET es_favorito = $1 WHERE proyecto_id = $2 AND usuario_id = $3",
      [es_favorito, projectId, userId]
    );

    res
      .status(200)
      .json({ message: "Estado de favorito actualizado con éxito" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }
    console.error("Error al actualizar favorito:", error);
    res.status(500).json({ message: "Error al actualizar favorito" });
  }
});

//PROYECTOS

//TASKS

app.get("/api/task/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const taskResult = await client.query(
      `
      SELECT 
        T.id, T.titulo, T.descripcion, T.completado, T.fecha_creacion, T.fecha_vencimiento, 
        T.usuario_id, U.nombre AS usuario_nombre, U.apellido AS usuario_apellido
      FROM Tareas T
      JOIN Usuarios U ON T.usuario_id = U.id
      WHERE T.id = $1
      `,
      [id]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json(taskResult.rows[0]);
  } catch (error) {
    console.error("Error al obtener la tarea:", error);
    res.status(500).json({ message: "Error al obtener las tarea" });
  }
});

app.get("/api/proyectos/:id/tasks", async (req, res) => {
  const { id } = req.params;

  try {
    const tasksResult = await client.query(
      "SELECT id, titulo, descripcion, completado, fecha_creacion, fecha_vencimiento, usuario_id FROM Tareas WHERE proyecto_id = $1",
      [id]
    );

    res.json(tasksResult.rows);
  } catch (error) {
    console.error("Error al obtener las tareas del proyecto:", error);
    res
      .status(500)
      .json({ message: "Error al obtener las tareas del proyecto" });
  }
});

app.post("/api/proyectos/:id/usuarios", async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const userResult = await client.query(
      "SELECT id FROM Usuarios WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userID = userResult.rows[0].id;

    await client.query(
      "INSERT INTO Proyectos_Usuarios (proyecto_id, usuario_id) VALUES ($1, $2)",
      [id, userID]
    );

    res.json({ message: "Usuario agregado al proyecto" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar usuario al proyecto" });
  }
});

app.post("/api/proyectos/:id/tareas", async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, usuario_id, fechaVencimiento } = req.body;

  if (!titulo || !usuario_id) {
    return res
      .status(400)
      .json({ error: "El título y usuario asignado son requeridos" });
  }

  try {
    const usuarioProyecto = await client.query(
      "SELECT * FROM Proyectos_Usuarios WHERE proyecto_id = $1 AND usuario_id = $2",
      [id, usuario_id]
    );

    if (usuarioProyecto.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "El usuario no está asignado a este proyecto" });
    }

    const nuevaTarea = await client.query(
      `INSERT INTO Tareas (proyecto_id, titulo, descripcion, completado, usuario_id, fecha_vencimiento) 
             VALUES ($1, $2, $3, FALSE, $4, $5) RETURNING *`,
      [id, titulo, descripcion, usuario_id, fechaVencimiento]
    );

    res.status(201).json(nuevaTarea.rows[0]);
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    res.status(500).json({ error: "Error al crear la tarea" });
  }
});

app.delete("/api/proyectos/:projectId/usuarios/:userId", async (req, res) => {
  const { projectId, userId } = req.params;

  try {
    await client.query(
      "DELETE FROM Proyectos_Usuarios WHERE proyecto_id = $1 AND usuario_id = $2",
      [projectId, userId]
    );

    res.json({ message: "Usuario eliminado del proyecto" });
  } catch (error) {
    console.error("Error al eliminar usuario del proyecto:", error);
    res.status(500).json({ message: "Error al eliminar usuario del proyecto" });
  }
});

//TASKS

//TEAM

app.get("/api/proyectos/:id/usuarios", async (req, res) => {
  const { id } = req.params;

  try {
    const usuariosProyecto = await client.query(
      `
      SELECT U.id, U.nombre, U.apellido, U.email, U.rut, U.region, U.comuna 
      FROM Usuarios U
      JOIN Proyectos_Usuarios PU ON U.id = PU.usuario_id
      WHERE PU.proyecto_id = $1
      `,
      [id]
    );

    res.json(usuariosProyecto.rows);
  } catch (error) {
    console.error("Error al obtener los usuarios del proyecto:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los usuarios del proyecto" });
  }
});

//TEAM

//SERVER
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
//SERVER

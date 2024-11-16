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
      const colaboradorPromises = colaboradores.map(async (correo) => {
        await client.query(
          "INSERT INTO Proyectos_Usuarios (proyecto_id, usuario_id) VALUES ($1, (SELECT id FROM Usuarios WHERE email = $2))",
          [proyectoId, correo]
        );

        const usuarioId = (
          await client.query("SELECT id FROM Usuarios WHERE email = $1", [
            correo,
          ])
        ).rows[0]?.id;

        if (usuarioId) {
          await client.query(
            "INSERT INTO Notificaciones (id_usuariocreador, id_usuarioreceptor, id_proyecto, texto, fechacreacion) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)",
            [
              creadorId,
              usuarioId,
              proyectoId,
              `Has sido agregado al proyecto "${titulo}"`,
            ]
          );
        }
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

app.delete("/api/proyectos/:id", async (req, res) => {
  const { id } = req.params;

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No se proporcionó token" });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    const userId = decoded.id;

    const proyectoResult = await client.query(
      "SELECT * FROM Proyectos WHERE id = $1",
      [id]
    );

    if (proyectoResult.rows.length === 0) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    const proyecto = proyectoResult.rows[0];

    if (proyecto.creador_id !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para eliminar este proyecto" });
    }

    await client.query("BEGIN");

    await client.query("DELETE FROM Tareas WHERE proyecto_id = $1", [id]);

    await client.query(
      "DELETE FROM Proyectos_Usuarios WHERE proyecto_id = $1",
      [id]
    );

    await client.query("DELETE FROM Proyectos WHERE id = $1", [id]);

    await client.query("COMMIT");

    res.status(200).json({ message: "Proyecto eliminado con éxito" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al eliminar el proyecto:", error);
    res.status(500).json({ error: "Error al eliminar el proyecto" });
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

app.put("/api/project/:projectId/title", async (req, res) => {
  const { projectId } = req.params;
  const { newTitle } = req.body;

  try {
    await client.query("UPDATE Proyectos SET titulo = $1 WHERE id = $2", [
      newTitle,
      projectId,
    ]);
    res.json({ message: "Título actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el título del proyecto:", error);
    res.status(500).json({ message: "Error al actualizar el título" });
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
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret");
    const creadorId = decoded.id;

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

    const projectResult = await client.query(
      "SELECT titulo FROM Proyectos WHERE id = $1",
      [id]
    );

    if (projectResult.rows.length > 0) {
      const projectTitle = projectResult.rows[0].titulo;

      await client.query(
        "INSERT INTO Notificaciones (id_usuariocreador, id_usuarioreceptor, id_proyecto, texto, fecha_creacion) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)",
        [
          creadorId,
          userID,
          id,
          `Has sido agregado al proyecto "${projectTitle}"`,
        ]
      );
    }

    res.json({ message: "Usuario agregado al proyecto" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar usuario al proyecto" });
  }
});

app.post("/api/proyectos/:id/tareas", async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, usuario_id, fechaVencimiento } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No se proporcionó token" });
  }

  if (!titulo || !usuario_id) {
    return res
      .status(400)
      .json({ error: "El título y usuario asignado son requeridos" });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    const creadorId = decoded.id;

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

    const tareaId = nuevaTarea.rows[0].id;

    const proyectoResult = await client.query(
      "SELECT titulo FROM Proyectos WHERE id = $1",
      [id]
    );

    if (proyectoResult.rowCount > 0) {
      const tituloProyecto = proyectoResult.rows[0].titulo;

      await client.query(
        `INSERT INTO Notificaciones (id_usuariocreador, id_usuarioreceptor, id_proyecto, id_tarea, texto, fechacreacion) 
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
        [
          creadorId,
          usuario_id,
          id,
          tareaId,
          `Se te ha asignado la tarea "${titulo}" en el proyecto "${tituloProyecto}"`,
        ]
      );
    }

    res.status(201).json(nuevaTarea.rows[0]);
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    res.status(500).json({ error: "Error al crear la tarea" });
  }
});

app.patch("/api/task/:id/complete", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const result = await client.query(
      "UPDATE Tareas SET completado = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json({ message: "Tarea marcada como completada" });
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    res.status(500).json({ message: "Error al completar la tarea" });
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

//COMMENTS

app.post("/api/comentarios", async (req, res) => {
  const { comentario, usuario_id, tarea_id } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO Comentarios (Comentario, usuario_id, tarea_id) VALUES ($1, $2, $3) RETURNING *",
      [comentario, usuario_id, tarea_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al insertar el comentario:", error);
    res.status(500).send("Error al insertar el comentario");
  }
});

app.get("/api/comentarios/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const query = `
      SELECT comentarios.id, comentarios.comentario, usuarios.nombre AS usuario_nombre, usuarios.apellido AS usuario_apellido
      FROM comentarios
      JOIN usuarios ON comentarios.usuario_id = usuarios.id
      WHERE comentarios.tarea_id = $1
      ORDER BY comentarios.id DESC
    `;
    const { rows } = await client.query(query, [taskId]);
    res.json(rows);
  } catch (error) {
    console.error("Error al cargar comentarios:", error);
    res.status(500).json({ error: "Error al cargar comentarios" });
  }
});

//User

app.get("/api/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const query =
      "SELECT nombre, apellido, email, rut, region, comuna, password FROM usuarios WHERE id = $1";
    const { rows } = await client.query(query, [userId]);
    res.json(rows);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Notificaciones

app.get("/api/notificaciones", async (req, res) => {
  const userID = req.query.userID; // Recibir userID desde query params

  if (!userID) {
    return res.status(400).json({ error: "El userID es obligatorio" });
  }

  try {
    // Obtener todas las notificaciones asociadas al usuario
    const notificaciones = await client.query(
      `SELECT n.id, n.id_proyecto, n.id_tarea, n.texto, n.fechacreacion, n.leida, 
              p.titulo AS titulo_proyecto, t.titulo AS titulo_tarea, u.nombre as nombreCreador
       FROM Notificaciones n
       LEFT JOIN Proyectos p ON n.id_proyecto = p.id
       LEFT JOIN Tareas t ON n.id_tarea = t.id
       JOIN usuarios as u ON id_usuariocreador = u.id
       WHERE n.id_usuarioreceptor = $1
       ORDER BY n.fechacreacion DESC`,
      [userID]
    );

    res.json(notificaciones.rows);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ error: "Error al obtener notificaciones" });
  }
});

app.put("/api/notificaciones/:id", async (req, res) => {
  const { id } = req.params;
  const { isRead } = req.body;

  try {
    const result = await client.query(
      "UPDATE Notificaciones SET leida = $1 WHERE id = $2 RETURNING *",
      [isRead, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    res.json({
      message: "Notificación actualizada",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar notificación:", error);
    res.status(500).json({ message: "Error al actualizar notificación" });
  }
});

//SERVER
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
//SERVER

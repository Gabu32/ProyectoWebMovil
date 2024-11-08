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
      res.json({ message: "Login exitoso", token });
    } else {
      res.status(400).json({ message: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

//PROOYECTOS

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
      "INSERT INTO Proyectos_Usuarios (proyecto_id, usuario_id, es_favorito) VALUES ($1, $2, TRUE)",
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

//PROYECTOS

//SERVER
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

//SERVER

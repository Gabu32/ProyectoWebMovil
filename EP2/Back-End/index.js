const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'WEB',
  password: 'admin',
  port: 5432
});

client.connect();

app.post('/api/register', async (req, res) => {
  const { nombre, apellido, email, rut, password, region, comuna } = req.body;

  console.log(req.body);

  if (!nombre || !apellido || !email || !rut || !password || !region || !comuna) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await client.query(
          'INSERT INTO Usuarios (nombre, apellido, email, rut, password, region, comuna) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [nombre, apellido, email, rut, hashedPassword, region, comuna]
      );

      res.status(201).json({ message: 'Usuario registrado con éxito', user: result.rows[0] });
  } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Email:', email);
    console.log('Password', password);
    
    try {
        const result = await client.query('SELECT * FROM Usuarios WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email: user.email }, 'secret', { expiresIn: '1h' });
            res.json({ message: 'Login exitoso', token });
        } else {
            res.status(400).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

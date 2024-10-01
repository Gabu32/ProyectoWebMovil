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
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      users.push({ email, password: hashedPassword });
      res.json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error while registering user' });
    }
  });

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
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

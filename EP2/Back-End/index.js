const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const users = []; 

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
  
    // Verifica que el password y el email sean válidos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      users.push({ email, password: hashedPassword });
      res.json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error while registering user' });
    }
  });

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, 'secret');
    res.json({ message: 'Login successful', token });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

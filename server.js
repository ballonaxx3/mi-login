const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// 1. Configuración de Middleware (ESTO DEBE IR ARRIBA)
app.use(express.urlencoded({ extended: true }));
// Servir estáticos primero para que Express encuentre los HTML fácilmente
app.use(express.static(path.join(__dirname))); 

// Conexión a la base de datos
const connection = mysql.createConnection(process.env.MYSQL_URL);

// 2. RUTAS
// Mostrar el login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Procesar el inicio de sesión
app.post('/login', (req, res) => {
  const { usuario, password } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ?';

  connection.query(sql, [usuario, password], (err, results) => {
    if (err) {
      console.error("Error en DB:", err);
      return res.status(500).send('Error en la base de datos');
    }

    if (results.length > 0) {
      res.sendFile(path.join(__dirname, 'dashboard.html'));
    } else {
      res.sendFile(path.join(__dirname, 'error.html'));
    }
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.redirect('/login');
});

// 3. PUERTO PARA RAILWAY
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor online en puerto ${PORT}`);
});

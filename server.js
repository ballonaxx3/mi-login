const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');

const app = express();

// 1. CONFIGURACIÓN DE MIDDLEWARE
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: false
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Conexión a la base de datos
const connection = mysql.createConnection(process.env.MYSQL_URL);

// 2. RUTAS

// Mostrar login (si ya está logueado, lo manda al dashboard)
app.get('/login', (req, res) => {
  if (req.session.usuario) {
    return res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Procesar login
app.post('/login', (req, res) => {
  const { usuario, password } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ?';

  connection.query(sql, [usuario, password], (err, results) => {
    if (err) {
      console.error("Error en DB:", err);
      return res.status(500).send('Error en la base de datos');
    }

    if (results.length > 0) {
      req.session.usuario = usuario; // ✅ guardar sesión
      return res.redirect('/dashboard');
    } else {
      return res.sendFile(path.join(__dirname, 'error.html'));
    }
  });
});

// Dashboard protegido
app.get('/dashboard', (req, res) => {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }

  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Logout (cerrar sesión)
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.redirect('/login');
});

// 3. PUERTO
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor online en puerto ${PORT}`);
});
